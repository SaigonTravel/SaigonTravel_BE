require('dotenv').config();
const mongoose = require('mongoose');
const app = require('./src/app');
const http = require('http');

const connectDB = require('./src/config/db');

async function runTests() {
  await connectDB();
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

    // Promote tester to Admin to test Admin/Manager Tour CRUD
    await User.updateOne({ username: 'saigontester' }, { role: 'admin' });
    const adminLoginRes = await request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username: 'saigontester', password: 'Password123@' }),
    });
    const adminToken = adminLoginRes.data.data?.token;

    // 15. Test Admin POST /api/tours (Create Tour)
    console.log('\n--- 15. Testing POST /api/tours (Admin Create Tour) ---');
    const dest = destGroupRes.data.data?.[0]?.items?.[0];
    const cat = catRes.data.data?.[0];
    const createTourRes = await request('/api/tours', {
      method: 'POST',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: JSON.stringify({
        title: 'Tour Test Khám Phá Mới 2026',
        destinations: [dest?._id],
        categories: [cat?._id],
        duration: { days: 4, nights: 3, text: '4 Ngày 3 Đêm' },
        price: { adult: 12500000, child: 9000000, currency: 'VND' },
        highlights: ['Khách sạn 4 sao', 'Trọn gói ăn uống'],
      }),
    });
    console.log('Create Tour Status:', createTourRes.status);
    console.log('Created Tour Code & Title:', createTourRes.data.data?.code, createTourRes.data.data?.title);
    const createdTourId = createTourRes.data.data?._id;

    // 16. Test Admin PUT /api/tours/:id (Update Tour)
    console.log('\n--- 16. Testing PUT /api/tours/:id (Admin Update Tour) ---');
    const updateTourRes = await request(`/api/tours/${createdTourId}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: JSON.stringify({
        title: 'Tour Test Khám Phá Mới 2026 (Đã cập nhật giá)',
        price: { adult: 11900000, child: 8500000, currency: 'VND' },
        isFeatured: true,
      }),
    });
    console.log('Update Tour Status:', updateTourRes.status);
    console.log('Updated Adult Price:', updateTourRes.data.data?.price?.adult);
    console.log('Updated isFeatured:', updateTourRes.data.data?.isFeatured);

    // 17. Test Admin PATCH /api/tours/:id/status (Quick Status & Hot Toggle)
    console.log('\n--- 17. Testing PATCH /api/tours/:id/status ---');
    const statusTourRes = await request(`/api/tours/${createdTourId}/status`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: JSON.stringify({
        status: 'draft',
        isHot: true,
      }),
    });
    console.log('Patch Tour Status:', statusTourRes.status);
    console.log('Updated Status Field:', statusTourRes.data.data?.status);
    console.log('Updated isHot Field:', statusTourRes.data.data?.isHot);

    // 18. Test Admin POST /api/tours/:id/duplicate (Duplicate Tour)
    console.log('\n--- 18. Testing POST /api/tours/:id/duplicate ---');
    const duplicateTourRes = await request(`/api/tours/${createdTourId}/duplicate`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    console.log('Duplicate Tour Status:', duplicateTourRes.status);
    console.log('Duplicated Tour Title:', duplicateTourRes.data.data?.title);
    console.log('Duplicated Tour Code:', duplicateTourRes.data.data?.code);
    const duplicatedTourId = duplicateTourRes.data.data?._id;

    // 19. Test Admin DELETE /api/tours/:id (Delete Tour)
    console.log('\n--- 19. Testing DELETE /api/tours/:id (Admin Delete Tour) ---');
    const deleteTourRes = await request(`/api/tours/${createdTourId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    console.log('Delete Tour Status:', deleteTourRes.status);
    console.log('Delete Tour Message:', deleteTourRes.data.message);

    // Clean up duplicated tour as well
    if (duplicatedTourId) {
      await request(`/api/tours/${duplicatedTourId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${adminToken}` },
      });
    }
  } finally {
    server.close();
    await mongoose.connection.close();
    console.log('\nAll 19 API integration tests completed successfully!');
    process.exit(0);
  }
}

runTests().catch((err) => {
  console.error(err);
  process.exit(1);
});
