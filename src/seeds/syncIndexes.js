require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const models = require('../models');

/**
 * Đồng bộ index trong DB theo định nghĩa schema của tất cả models:
 * tạo index còn thiếu, xóa index không còn khai báo trong schema.
 */
const syncIndexes = async () => {
  try {
    await connectDB();

    for (const Model of Object.values(models)) {
      const dropped = await Model.syncIndexes();
      const current = (await Model.listIndexes()).map((idx) => idx.name);
      console.log(`${Model.modelName}: ${current.join(', ')}${dropped.length ? ` (đã xóa: ${dropped.join(', ')})` : ''}`);
    }

    await mongoose.connection.close();
  } catch (error) {
    console.error('Error during index sync:', error);
    process.exit(1);
  }
};

if (require.main === module) {
  syncIndexes();
}

module.exports = syncIndexes;
