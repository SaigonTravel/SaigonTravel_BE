require('dotenv').config();
const mongoose = require('mongoose');

console.log('URI from .env:', process.env.MONGODB_URI);

mongoose.connect(process.env.MONGODB_URI, {
  serverSelectionTimeoutMS: 5000,
})
.then(() => console.log('Atlas Connected!'))
.catch(err => console.error('Atlas Error:', err.message));
