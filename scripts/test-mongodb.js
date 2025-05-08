/**
 * MongoDB Connection Test Script
 *
 * This script tests the connection to MongoDB and performs basic CRUD operations.
 * Run with: node scripts/test-mongodb.js
 */

require('dotenv').config();
const mongoose = require('mongoose');

// MongoDB connection string - use the direct connection string to avoid DNS issues
const MONGODB_URI = 'mongodb+srv://polokpoddar:R7THOg45tgCcOxle@cluster0.kvtm9t5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

// Define a simple user schema for testing
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['user', 'landlord', 'admin'],
    default: 'user'
  },
  verified: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create the User model
const User = mongoose.model('User', UserSchema);

// Connect to MongoDB
async function connectToMongoDB() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB successfully!');
    return true;
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    return false;
  }
}

// Create a test user
async function createTestUser() {
  try {
    // Check if test user already exists
    const existingUser = await User.findOne({ email: 'test@example.com' });

    if (existingUser) {
      console.log('Test user already exists:', existingUser);
      return existingUser;
    }

    // Create a new test user
    const newUser = new User({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      role: 'user',
      verified: true
    });

    await newUser.save();
    console.log('Test user created successfully:', newUser);
    return newUser;
  } catch (error) {
    console.error('Error creating test user:', error);
    return null;
  }
}

// Read users from the database
async function readUsers() {
  try {
    const users = await User.find({}).limit(5);
    console.log('Users in database:', users);
    return users;
  } catch (error) {
    console.error('Error reading users:', error);
    return [];
  }
}

// Update the test user
async function updateTestUser(userId) {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { role: 'landlord' },
      { new: true }
    );

    console.log('User updated successfully:', updatedUser);
    return updatedUser;
  } catch (error) {
    console.error('Error updating user:', error);
    return null;
  }
}

// Delete the test user
async function deleteTestUser(userId) {
  try {
    const result = await User.findByIdAndDelete(userId);
    console.log('User deleted successfully:', result);
    return true;
  } catch (error) {
    console.error('Error deleting user:', error);
    return false;
  }
}

// Run the test
async function runTest() {
  console.log('Starting MongoDB connection test...');

  // Connect to MongoDB
  const connected = await connectToMongoDB();
  if (!connected) {
    console.error('Test failed: Could not connect to MongoDB');
    process.exit(1);
  }

  try {
    // Create a test user
    const testUser = await createTestUser();
    if (!testUser) {
      throw new Error('Failed to create test user');
    }

    // Read users
    await readUsers();

    // Update the test user
    const updatedUser = await updateTestUser(testUser._id);
    if (!updatedUser) {
      throw new Error('Failed to update test user');
    }

    // Delete the test user (uncomment to test deletion)
    // const deleted = await deleteTestUser(testUser._id);
    // if (!deleted) {
    //   throw new Error('Failed to delete test user');
    // }

    console.log('All tests completed successfully!');
  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    // Close the MongoDB connection
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
}

// Run the test
runTest();
