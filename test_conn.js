console.log('Script started');
const mongoose = require('mongoose');
console.log('Mongoose loaded');
mongoose.connect('mongodb://127.0.0.1:27017/saigontravel_db')
  .then(() => {
    console.log('Connected to MongoDB successfully!');
    process.exit(0);
  })
  .catch(err => {
    console.error('Connection error:', err);
    process.exit(1);
  });
