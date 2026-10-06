const mongoose = require('mongoose');

const connectDB = async () => {
  const primaryUri = process.env.MONGODB_URI;
  const localUri = 'mongodb://127.0.0.1:27017/saigontravel_db';
  // Production không được tự chuyển sang DB local, tránh ghi dữ liệu nhầm chỗ mà không ai biết
  const isProduction = process.env.NODE_ENV === 'production';

  if (isProduction && !primaryUri) {
    console.error('Database Connection Error: Thiếu MONGODB_URI trong môi trường production');
    process.exit(1);
  }

  if (primaryUri) {
    try {
      const conn = await mongoose.connect(primaryUri, {
        serverSelectionTimeoutMS: 5000,
      });
      console.log(`MongoDB Connected: ${conn.connection.host}`);
      return conn;
    } catch (error) {
      if (isProduction) {
        console.error(`Database Connection Error: ${error.message}`);
        process.exit(1);
      }
      console.warn(`[WARN] Không thể kết nối tới MONGODB_URI chính (${error.message}).`);
      console.log(`[INFO] Đang tự động chuyển sang kết nối MongoDB nội bộ: ${localUri}...`);
    }
  }

  try {
    const conn = await mongoose.connect(localUri);
    console.log(`MongoDB Connected (Local): ${conn.connection.host}`);
    return conn;
  } catch (localError) {
    console.error(`Database Connection Error: ${localError.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
