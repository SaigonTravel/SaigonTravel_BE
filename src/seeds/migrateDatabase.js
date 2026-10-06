require('dotenv').config();
const mongoose = require('mongoose');

/**
 * Copy toàn bộ collections (giữ nguyên _id) từ DB nguồn sang DB đích trên cùng cluster.
 * - Từ chối chạy nếu DB đích đã có dữ liệu.
 * - Không xóa DB nguồn (giữ làm backup).
 * Cách dùng: node src/seeds/migrateDatabase.js <sourceDb> <targetDb>
 */
const migrateDatabase = async (sourceName, targetName) => {
  if (!sourceName || !targetName || sourceName === targetName) {
    console.error('Cách dùng: node src/seeds/migrateDatabase.js <sourceDb> <targetDb>');
    process.exit(1);
  }

  const conn = await mongoose.createConnection(process.env.MONGODB_URI).asPromise();

  try {
    const source = conn.useDb(sourceName).db;
    const target = conn.useDb(targetName).db;

    const existing = await target.listCollections().toArray();
    if (existing.length) {
      throw new Error(`DB đích '${targetName}' đã có ${existing.length} collection, dừng để tránh ghi đè.`);
    }

    let hasMismatch = false;
    for (const { name } of await source.listCollections({ type: 'collection' }).toArray()) {
      const docs = await source.collection(name).find({}).toArray();
      if (docs.length) {
        await target.collection(name).insertMany(docs, { ordered: true });
      } else {
        await target.createCollection(name);
      }

      const sourceCount = await source.collection(name).countDocuments();
      const targetCount = await target.collection(name).countDocuments();
      if (sourceCount !== targetCount) hasMismatch = true;
      console.log(`${name}: ${sourceCount} -> ${targetCount} ${sourceCount === targetCount ? 'OK' : 'MISMATCH'}`);
    }

    console.log(hasMismatch ? 'Có collection bị lệch số lượng, vui lòng kiểm tra!' : `Đã copy xong '${sourceName}' -> '${targetName}'.`);
  } finally {
    await conn.close();
  }
};

if (require.main === module) {
  migrateDatabase(process.argv[2], process.argv[3]).catch((error) => {
    console.error('Error during database migration:', error.message);
    process.exit(1);
  });
}

module.exports = migrateDatabase;
