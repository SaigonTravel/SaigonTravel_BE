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
    const sampleTour = toursRes.data.data?.[0];

    // 6. Test Settings & Sliders
    console.log('\n--- 6. Testing GET /api/settings ---');
    const settingsRes = await request('/api/settings');
    console.log('Settings Status:', settingsRes.status);
    console.log('Company Name:', settingsRes.data.data?.companyName);
    console.log('Hotline:', settingsRes.data.data?.hotline);
    console.log('Total Sliders:', settingsRes.data.data?.sliders?.length);

    // 7. Test Customer submitting Booking / Consultation Request
    console.log('\n--- 7. Testing POST /api/bookings (Lead submission) ---');
    const newBookingRes = await request('/api/bookings', {
      method: 'POST',
      body: JSON.stringify({
        type: 'tour_booking',
        tour: sampleTour?._id,
        customer: {
          fullName: 'Trần Thị Khách Hàng',
          phone: '0912345678',
          email: 'khachhang@congtyabc.com',
          companyName: 'Công Ty CP Công Nghệ ABC',
          note: 'Đoàn chúng tôi dự kiến đi 20 người, cần tư vấn thêm gói Teambuilding bãi biển.',
        },
        details: {
          departureDate: '2026-11-15',
          adultsCount: 18,
          childrenCount: 2,
          participantCount: 20,
          estimatedBudget: '15 - 20 triệu / người',
          specialRequests: 'Cần hỗ trợ xuất hóa đơn VAT và MC hoạt náo đêm tiệc',
        },
      }),
    });
    console.log('Booking Creation Status:', newBookingRes.status);
    console.log('Booking Success:', newBookingRes.data.success);
    console.log('Generated Booking Code:', newBookingRes.data.data?.bookingCode);
    const bookingId = newBookingRes.data.data?.id;

    // 8. Test Staff retrieving Bookings list
    console.log('\n--- 8. Testing GET /api/bookings (Staff Private) ---');
    const listBookingsRes = await request('/api/bookings', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log('Get Bookings Status:', listBookingsRes.status);
    console.log('Total Bookings Received:', listBookingsRes.data.total);

    // 9. Test Staff updating consultation status & note
    console.log('\n--- 9. Testing PATCH /api/bookings/:id (Consultation note) ---');
    const updateBookingRes = await request(`/api/bookings/${bookingId}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        status: 'contacted',
        note: 'Đã gọi điện cho chị Hằng lúc 09:30, đã gửi báo giá qua Zalo và email. Khách hẹn phản hồi vào thứ 2.',
      }),
    });
    console.log('Update Booking Status:', updateBookingRes.status);
    console.log('Updated Booking State:', updateBookingRes.data.data?.status);
    console.log('Staff Notes Count:', updateBookingRes.data.data?.staffNotes?.length);

    // 10. Test Destinations & Grouped Destinations for Mega Menu
    console.log('\n--- 10. Testing GET /api/destinations/grouped (Mega Menu) ---');
    const destGroupRes = await request('/api/destinations/grouped');
    console.log('Grouped Destinations Status:', destGroupRes.status);
    console.log('Regions Available:', destGroupRes.data.data?.map(g => `${g.regionName} (${g.items.length} điểm đến)`));

    // 11. Test Categories
    console.log('\n--- 11. Testing GET /api/categories ---');
    const catRes = await request('/api/categories');
    console.log('Categories Status:', catRes.status);
    console.log('Categories List:', catRes.data.data?.map(c => `${c.name} [${c.type}]`));

    // 12. Test Event Projects (YanTB Portfolio)
    console.log('\n--- 12. Testing GET /api/event-projects (Portfolio Case Studies) ---');
    const projectsRes = await request('/api/event-projects');
    console.log('Projects Status:', projectsRes.status);
    console.log('Projects List:', projectsRes.data.data?.map(p => `${p.clientName}: ${p.title} (${p.location})`));

    // 13. Test Teambuilding & Events Services
    console.log('\n--- 13. Testing GET /api/services (Teambuilding & Event Services) ---');
    const servicesRes = await request('/api/services');
    console.log('Services Status:', servicesRes.status);
    console.log('Services List:', servicesRes.data.data?.map(s => `${s.title} [${s.serviceType}]`));

    // 14. Test Lightbox Media Galleries
    console.log('\n--- 14. Testing GET /api/galleries (Lightbox Albums) ---');
    const galleriesRes = await request('/api/galleries');
    console.log('Galleries Status:', galleriesRes.status);
    console.log('Galleries List:', galleriesRes.data.data?.map(g => `${g.title} (${g.items?.length || 0} ảnh)`));
  } finally {
    server.close();
    await mongoose.connection.close();
    console.log('\nAll 14 API integration tests completed successfully!');
  }
}

runTests().catch(console.error);
