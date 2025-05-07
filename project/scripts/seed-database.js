/**
 * Database Seeding Script
 * 
 * This script seeds the MongoDB database with initial data.
 * Run with: node scripts/seed-database.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// MongoDB connection string
const MONGODB_URI = 'mongodb+srv://polokpoddar:R7THOg45tgCcOxle@cluster0.kvtm9t5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

// Define schemas
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  image: String,
  role: { type: String, enum: ['user', 'landlord', 'admin'], default: 'user' },
  verified: { type: Boolean, default: false },
  phone: String,
  nid: String,
  createdAt: { type: Date, default: Date.now },
  lastActive: { type: Date, default: Date.now }
});

const MessageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const PostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isAnonymous: { type: Boolean, default: false },
  category: { type: String, required: true },
  tags: [String],
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  views: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Create models
const User = mongoose.model('User', UserSchema);
const Message = mongoose.model('Message', MessageSchema);
const Post = mongoose.model('Post', PostSchema);

// Sample data
const users = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'admin123',
    role: 'admin',
    verified: true,
    image: 'https://randomuser.me/api/portraits/men/1.jpg',
  },
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    role: 'user',
    verified: true,
    image: 'https://randomuser.me/api/portraits/men/2.jpg',
  },
  {
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    password: 'password123',
    role: 'landlord',
    verified: true,
    image: 'https://randomuser.me/api/portraits/women/3.jpg',
  },
  {
    name: 'Michael Chen',
    email: 'michael@example.com',
    password: 'password123',
    role: 'user',
    verified: true,
    image: 'https://randomuser.me/api/portraits/men/4.jpg',
  },
  {
    name: 'Aisha Patel',
    email: 'aisha@example.com',
    password: 'password123',
    role: 'landlord',
    verified: true,
    image: 'https://randomuser.me/api/portraits/women/5.jpg',
  }
];

const posts = [
  {
    title: 'Welcome to Notun Thikana',
    content: 'This is a community platform for connecting with neighbors, sharing information, and building relationships.',
    category: 'announcement',
    tags: ['welcome', 'community'],
  },
  {
    title: 'Looking for roommates in downtown area',
    content: 'I have a 3-bedroom apartment and looking for 2 roommates. Rent is $800 per person, utilities included.',
    category: 'housing',
    tags: ['roommate', 'apartment'],
  },
  {
    title: 'Community cleanup event this weekend',
    content: 'Join us for a community cleanup event this Saturday at 10 AM. Meet at the community center.',
    category: 'event',
    tags: ['cleanup', 'community', 'event'],
  },
  {
    title: 'Best restaurants in the neighborhood',
    content: 'Here are some of my favorite restaurants in the area: 1. The Local Spot, 2. Cafe Bloom, 3. Spice Garden',
    category: 'recommendation',
    tags: ['food', 'restaurants'],
  },
  {
    title: 'Safety concerns in the park',
    content: 'There have been reports of suspicious activity in the park after dark. Please be cautious.',
    category: 'safety',
    tags: ['safety', 'park'],
  }
];

// Connect to MongoDB and seed data
async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB successfully!');
    
    // Clear existing data
    await User.deleteMany({});
    await Message.deleteMany({});
    await Post.deleteMany({});
    console.log('Cleared existing data');
    
    // Hash passwords for users
    const hashedUsers = await Promise.all(
      users.map(async (user) => ({
        ...user,
        password: await bcrypt.hash(user.password, 10)
      }))
    );
    
    // Insert users
    const createdUsers = await User.insertMany(hashedUsers);
    console.log(`Created ${createdUsers.length} users`);
    
    // Create posts with user references
    const postsWithAuthors = posts.map((post, index) => ({
      ...post,
      author: createdUsers[index % createdUsers.length]._id
    }));
    
    // Insert posts
    const createdPosts = await Post.insertMany(postsWithAuthors);
    console.log(`Created ${createdPosts.length} posts`);
    
    // Create some messages between users
    const messages = [
      {
        sender: createdUsers[1]._id, // John
        receiver: createdUsers[2]._id, // Sarah
        content: 'Hi Sarah, I saw your post about the apartment. Is it still available?',
        read: true,
      },
      {
        sender: createdUsers[2]._id, // Sarah
        receiver: createdUsers[1]._id, // John
        content: 'Yes, it is! Would you like to schedule a viewing?',
        read: true,
      },
      {
        sender: createdUsers[1]._id, // John
        receiver: createdUsers[2]._id, // Sarah
        content: 'That would be great. How about this weekend?',
        read: false,
      },
      {
        sender: createdUsers[3]._id, // Michael
        receiver: createdUsers[4]._id, // Aisha
        content: 'Hello Aisha, I\'m interested in your property listing.',
        read: true,
      },
      {
        sender: createdUsers[4]._id, // Aisha
        receiver: createdUsers[3]._id, // Michael
        content: 'Hi Michael, thanks for your interest. It\'s a great property in a nice neighborhood.',
        read: false,
      }
    ];
    
    // Insert messages
    const createdMessages = await Message.insertMany(messages);
    console.log(`Created ${createdMessages.length} messages`);
    
    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    // Close the MongoDB connection
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
}

// Run the seeding function
seedDatabase();
