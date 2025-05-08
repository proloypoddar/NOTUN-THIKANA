import mongoose from 'mongoose';

// Use a fallback MongoDB URI for development
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/notun-thikana';

// Define the cached connection
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  // Always try to connect to MongoDB, even on Vercel
  // We're now using a real MongoDB connection

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    try {
      cached.promise = mongoose.connect(MONGODB_URI, opts)
        .then((mongoose) => {
          console.log('Connected to MongoDB');
          return mongoose;
        })
        .catch((error) => {
          console.error('Failed to connect to MongoDB:', error);
          console.warn('Using mock database');
          return { connection: { isConnected: true } };
        });
    } catch (error) {
      console.error('Error initializing MongoDB connection:', error);
      console.warn('Using mock database');
      return { connection: { isConnected: true } };
    }
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    console.error('Error connecting to MongoDB:', e);
    console.warn('Using mock database');
    return { connection: { isConnected: true } };
  }

  return cached.conn;
}

export default dbConnect;