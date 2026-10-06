require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const { User } = require('../models');

/**
 * Tạo tài khoản admin từ biến môi trường ADMIN_EMAIL, ADMIN_USERNAME, ADMIN_PASSWORD.
 * Nếu username/email đã tồn tại: nâng quyền lên admin và kích hoạt lại (không đổi mật khẩu).
 */
const seedAdmin = async () => {
  const { ADMIN_EMAIL, ADMIN_USERNAME, ADMIN_PASSWORD, ADMIN_NAME } = process.env;

  if (!ADMIN_EMAIL || !ADMIN_USERNAME || !ADMIN_PASSWORD) {
    console.error('Vui lòng khai báo ADMIN_EMAIL, ADMIN_USERNAME, ADMIN_PASSWORD trong file .env');
    process.exit(1);
  }

  try {
    await connectDB();

    const email = ADMIN_EMAIL.toLowerCase().trim();
    const username = ADMIN_USERNAME.toLowerCase().trim();

    const existing = await User.findOne({ $or: [{ email }, { username }] });

    if (existing) {
      existing.role = 'admin';
      existing.isActive = true;
      await existing.save();
      console.log(`Tài khoản '${existing.username}' đã tồn tại -> đã nâng quyền admin.`);
    } else {
      const admin = await User.create({
        email,
        username,
        password: ADMIN_PASSWORD,
        name: ADMIN_NAME || 'Administrator',
        role: 'admin',
      });
      console.log(`Đã tạo tài khoản admin '${admin.username}'.`);
    }

    await mongoose.connection.close();
  } catch (error) {
    console.error('Error during admin seeding:', error);
    process.exit(1);
  }
};

if (require.main === module) {
  seedAdmin();
}

module.exports = seedAdmin;
