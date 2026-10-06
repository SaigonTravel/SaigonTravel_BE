const mongoose = require('mongoose');

// Serverless (Vercel) không chạy server.js và tái sử dụng instance giữa các request
// → cache promise kết nối ở global để không mở kết nối mới mỗi lần gọi
const isServerless = !!process.env.VERCEL;
const cached = global._mongooseConn || (global._mongooseConn = { promise: null });

const fail = (message) => {
  console.error(`Database Connection Error: ${message}`);
  // Trên serverless không được process.exit (làm sập function) → ném lỗi để errorHandler trả 500
  if (isServerless) throw new Error(message);
  process.exit(1);
};

const doConnect = async () => {
  const primaryUri = process.env.MONGODB_URI;
  const localUri = 'mongodb://127.0.0.1:27017/saigontravel_db';
  // Production không được tự chuyển sang DB local, tránh ghi dữ liệu nhầm chỗ mà không ai biết
  const isProduction = process.env.NODE_ENV === 'production' || isServerless;

  if (isProduction && !primaryUri) {
    return fail('Thiếu MONGODB_URI trong môi trường production');
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
        return fail(error.message);
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
    return fail(localError.message);
  }
};

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) return mongoose;
  if (!cached.promise) {
    cached.promise = doConnect().catch((err) => {
      cached.promise = null; // cho phép thử lại ở request sau
      throw err;
    });
  }
  return cached.promise;
};

module.exports = connectDB;
