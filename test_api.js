require('dotenv').config();
const mongoose = require('mongoose');
const app = require('./src/app');
const http = require('http');

async function runTests() {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/saigontravel_db';
  await mongoose.connect(mongoUri);
  console.log('Connected to MongoDB for API testing.');

  // Clean test user if exists
  const { User } = require('./src/models');
  await User.deleteOne({ email: 'tester@saigon-travel.com' });
  await User.deleteOne({ username: 'saigontester' });

  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(5099, resolve));
  console.log('Test server listening on port 5099');

  async function request(path, options = {}) {
    const res = await fetch(`http://localhost:5099${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
    });
    const data = await res.json();
    return { status: res.status, data };
  }

  try {
    // 1. Test Register
    console.log('\n--- 1. Testing Register (email, username, password) ---');
    const regRes = await request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        email: 'tester@saigon-travel.com',
        username: 'saigontester',
        password: 'Password123@',
        name: 'Nguyễn Văn Tester',
        phone: '0989998888',
      }),
    });
    console.log('Register Response Status:', regRes.status);
    console.log('Register User:', regRes.data.data?.user);
    console.log('Has Token:', !!regRes.data.data?.token);

    // 2. Test Login with Username
    console.log('\n--- 2. Testing Login with Username ---');
    const loginUserRes = await request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        username: 'saigontester',
        password: 'Password123@',
      }),
    });
    console.log('Login (Username) Status:', loginUserRes.status);
    console.log('Login Success:', loginUserRes.data.success);
    const token = loginUserRes.data.data?.token;

    // 3. Test Login with Email
    console.log('\n--- 3. Testing Login with Email ---');
    const loginEmailRes = await request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: 'tester@saigon-travel.com',
        password: 'Password123@',
      }),
    });
    console.log('Login (Email) Status:', loginEmailRes.status);
    console.log('Login Success:', loginEmailRes.data.success);

    // 4. Test Get Me with Token
    console.log('\n--- 4. Testing GET /api/auth/me (Private) ---');
    const meRes = await request('/api/auth/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log('GetMe Status:', meRes.status);
    console.log('Current User:', meRes.data.data?.username, meRes.data.data?.email);

    // 5. Test Get Tours
    console.log('\n--- 5. Testing GET /api/tours ---');
    const toursRes = await request('/api/tours');
    console.log('Tours Status:', toursRes.status);
    console.log('Total Tours Seeded:', toursRes.data.total);
    console.log(
      'Sample Tour Titles:',
      toursRes.data.data?.map((t) => `${t.code}: ${t.title}`)
    );
  } finally {
    server.close();
    await mongoose.connection.close();
    console.log('\nTest completed and server closed.');
  }
}

runTests().catch(console.error);
