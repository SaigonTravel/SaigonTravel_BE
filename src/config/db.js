const mongoose = require('mongoose');

const connectDB = async () => {
  const primaryUri = process.env.MONGODB_URI;
  const localUri = 'mongodb://127.0.0.1:27017/saigontravel_db';

  if (primaryUri) {
    try {
      const conn = await mongoose.connect(primaryUri, {
        serverSelectionTimeoutMS: 5000,
      });
      console.log(`MongoDB Connected: ${conn.connection.host}`);
      return conn;
    } catch (error) {
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
