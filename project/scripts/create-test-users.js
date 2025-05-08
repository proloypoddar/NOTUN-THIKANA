// This script creates two test users for demonstration purposes
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI;

// User schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  image: { type: String },
  role: { type: String, enum: ['user', 'landlord', 'admin'], default: 'user' },
  verified: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  lastActive: { type: Date, default: Date.now },
});

// Create User model
const User = mongoose.model('User', userSchema);

// Test users data
const testUsers = [
  {
    name: 'Test User 1',
    email: 'user1@example.com',
    password: 'password123',
    image: 'https://randomuser.me/api/portraits/men/1.jpg',
    role: 'user',
  },
  {
    name: 'Test User 2',
    email: 'user2@example.com',
    password: 'password123',
    image: 'https://randomuser.me/api/portraits/women/1.jpg',
    role: 'landlord',
  },
];

// Function to create users
async function createUsers() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Create users
    for (const userData of testUsers) {
      // Check if user already exists
      const existingUser = await User.findOne({ email: userData.email });
      
      if (existingUser) {
        console.log(`User with email ${userData.email} already exists`);
        continue;
      }
      
      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(userData.password, salt);
      
      // Create new user
      const newUser = new User({
        ...userData,
        password: hashedPassword,
      });
      
      await newUser.save();
      console.log(`Created user: ${userData.name} (${userData.email})`);
    }
    
    console.log('Test users created successfully');
  } catch (error) {
    console.error('Error creating test users:', error);
  } finally {
    // Close MongoDB connection
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
}

// Run the function
createUsers();
