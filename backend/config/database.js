/**
 * database.js
 * -----------
 * MongoDB connection configuration using Mongoose.
 * Call connectDB() once at server startup.
 */

const mongoose = require('mongoose');

/**
 * Establishes a connection to MongoDB.
 * Reads the connection string from process.env.MONGO_URI.
 * Throws on failure so the caller can decide how to handle it.
 */
const connectDB = async () => {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    throw new Error('MONGO_URI is not defined in environment variables.');
  }

  // Mongoose 7+ no longer needs useNewUrlParser / useUnifiedTopology
  const conn = await mongoose.connect(uri);

  console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

  // Log meaningful connection lifecycle events
  mongoose.connection.on('error', (err) => {
    console.error(`❌ MongoDB connection error: ${err.message}`);
  });

  mongoose.connection.on('disconnected', () => {
    console.warn('⚠️  MongoDB disconnected.');
  });
};

module.exports = connectDB;
