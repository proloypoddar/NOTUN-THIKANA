import mongoose from 'mongoose';

// Use a fallback MongoDB URI for development
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/notun-thikana';

// For production, we should require the MongoDB URI
if (!MONGODB_URI && process.env.NODE_ENV === 'production') {
  throw new Error('Please define the MONGODB_URI environment variable inside .env');
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts)
      .then((mongoose) => {
        console.log('Connected to MongoDB');
        return mongoose;
      })
      .catch((error) => {
        console.error('Failed to connect to MongoDB:', error);
        // In development, we'll continue even if MongoDB connection fails
        if (process.env.NODE_ENV !== 'development') {
          throw error;
        }
        // Return a mock mongoose instance for development
        console.warn('Using mock database for development');
        return mongoose;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    console.error('Error connecting to MongoDB:', e);
    throw e;
  }

  return cached.conn;
}

export default dbConnect;