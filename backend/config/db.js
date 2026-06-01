const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // We will connect to a local database for absolute simplicity
    await mongoose.connect('mongodb://127.0.0.1:27017/primetrade');
    console.log('MongoDB Connected Successfully! 🗄️');
  } catch (err) {
    console.error('Database Connection Error:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;