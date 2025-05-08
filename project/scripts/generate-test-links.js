// This script generates test links for our two test users
require('dotenv').config();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI;
const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET || 'notun-thikana-secret-key-for-jwt-signing-secure';

// User schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, enum: ['user', 'landlord', 'admin'], default: 'user' },
});

// Create User model
const User = mongoose.model('User', userSchema);

// Function to generate a JWT token for a user
function generateToken(user) {
  const payload = {
    name: user.name,
    email: user.email,
    id: user._id.toString(),
    role: user.role,
  };
  
  return jwt.sign(payload, NEXTAUTH_SECRET, { expiresIn: '7d' });
}

// Function to generate test links
async function generateTestLinks() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Get our test users
    const user1 = await User.findOne({ email: 'user1@example.com' });
    const user2 = await User.findOne({ email: 'user2@example.com' });
    
    if (!user1 || !user2) {
      console.log('Test users not found. Please run create-test-users.js first.');
      return;
    }
    
    // Generate tokens
    const token1 = generateToken(user1);
    const token2 = generateToken(user2);
    
    // Generate links
    const baseUrl = 'http://localhost:3000';
    const link1 = `${baseUrl}/api/auth/callback/credentials?token=${token1}`;
    const link2 = `${baseUrl}/api/auth/callback/credentials?token=${token2}`;
    
    console.log('Test User 1 (Regular User):');
    console.log(`Email: ${user1.email}`);
    console.log(`Password: password123`);
    console.log(`Direct Link: ${link1}`);
    console.log('\n');
    
    console.log('Test User 2 (Landlord):');
    console.log(`Email: ${user2.email}`);
    console.log(`Password: password123`);
    console.log(`Direct Link: ${link2}`);
    
    // Also generate Vercel links
    const vercelUrl = 'https://notun-thikana.vercel.app';
    const vercelLink1 = `${vercelUrl}/api/auth/callback/credentials?token=${token1}`;
    const vercelLink2 = `${vercelUrl}/api/auth/callback/credentials?token=${token2}`;
    
    console.log('\nVercel Links:');
    console.log('Test User 1 (Regular User):');
    console.log(`Direct Link: ${vercelLink1}`);
    console.log('\n');
    
    console.log('Test User 2 (Landlord):');
    console.log(`Direct Link: ${vercelLink2}`);
    
  } catch (error) {
    console.error('Error generating test links:', error);
  } finally {
    // Close MongoDB connection
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
}

// Run the function
generateTestLinks();
