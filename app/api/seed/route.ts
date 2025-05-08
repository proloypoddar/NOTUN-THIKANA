import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/db/connect';
import { User } from '@/lib/db/models/User';
import { Post } from '@/lib/db/models/Post';
import { Message } from '@/lib/db/models/Message';

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

export async function GET() {
  try {
    // Check if user is authenticated and is an admin
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Connect to the database
    await dbConnect();

    // Clear existing data
    await User.deleteMany({});
    await Post.deleteMany({});
    await Message.deleteMany({});

    // Hash passwords for users
    const hashedUsers = await Promise.all(
      users.map(async (user) => ({
        ...user,
        password: await bcrypt.hash(user.password, 10)
      }))
    );

    // Insert users
    const createdUsers = await User.insertMany(hashedUsers);

    // Create posts with user references
    const postsWithAuthors = posts.map((post, index) => ({
      ...post,
      author: createdUsers[index % createdUsers.length]._id
    }));

    // Insert posts
    const createdPosts = await Post.insertMany(postsWithAuthors);

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

    return NextResponse.json({
      message: 'Database seeded successfully',
      counts: {
        users: createdUsers.length,
        posts: createdPosts.length,
        messages: createdMessages.length
      }
    }, { status: 200 });
  } catch (error) {
    console.error('Error seeding database:', error);
    return NextResponse.json({
      message: 'Error seeding database',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
