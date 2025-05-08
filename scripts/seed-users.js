require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// MongoDB connection string from environment variables
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://polokpoddar:R7THOg45tgCcOxle@cluster0.kvtm9t5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

// User schema
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  image: String,
  role: { type: String, enum: ['user', 'landlord', 'admin'], default: 'user' },
  verified: { type: Boolean, default: true },
  phone: String,
  nid: String,
  createdAt: { type: Date, default: Date.now },
  lastActive: { type: Date, default: Date.now }
});

// Create User model
let User;
try {
  User = mongoose.model('User');
} catch (error) {
  User = mongoose.model('User', UserSchema);
}

// Sample user data
const userData = [
  {
    name: 'PROLOY',
    email: 'proloy@example.com',
    password: '123456789',
    role: 'admin',
    image: 'https://randomuser.me/api/portraits/men/1.jpg',
    phone: '+8801712345678',
    verified: true
  },
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'admin123',
    role: 'admin',
    image: 'https://randomuser.me/api/portraits/men/2.jpg',
    phone: '+8801712345679',
    verified: true
  },
  {
    name: 'Landlord One',
    email: 'landlord1@example.com',
    password: 'landlord123',
    role: 'landlord',
    image: 'https://randomuser.me/api/portraits/men/3.jpg',
    phone: '+8801712345680',
    verified: true
  },
  {
    name: 'Landlord Two',
    email: 'landlord2@example.com',
    password: 'landlord123',
    role: 'landlord',
    image: 'https://randomuser.me/api/portraits/women/3.jpg',
    phone: '+8801712345681',
    verified: true
  },
  {
    name: 'Regular User',
    email: 'user@example.com',
    password: 'user123',
    role: 'user',
    image: 'https://randomuser.me/api/portraits/men/4.jpg',
    phone: '+8801712345682',
    verified: true
  },
  {
    name: 'Tenant One',
    email: 'tenant1@example.com',
    password: 'tenant123',
    role: 'user',
    image: 'https://randomuser.me/api/portraits/women/4.jpg',
    phone: '+8801712345683',
    verified: true
  },
  {
    name: 'Tenant Two',
    email: 'tenant2@example.com',
    password: 'tenant123',
    role: 'user',
    image: 'https://randomuser.me/api/portraits/women/5.jpg',
    phone: '+8801712345684',
    verified: true
  }
];

// Connect to MongoDB and seed users
async function seedUsers() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Hash passwords and prepare user data
    const usersWithHashedPasswords = await Promise.all(
      userData.map(async (user) => {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        return { ...user, password: hashedPassword };
      })
    );

    // Clear existing users (optional - be careful in production)
    // await User.deleteMany({});
    // console.log('Cleared existing users');

    // Check for existing users and only insert new ones
    for (const userData of usersWithHashedPasswords) {
      const existingUser = await User.findOne({ email: userData.email });
      if (!existingUser) {
        await User.create(userData);
        console.log(`Created user: ${userData.name} (${userData.email})`);
      } else {
        console.log(`User already exists: ${userData.email}`);
      }
    }

    console.log('Database seeded with users successfully');
    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedUsers();
