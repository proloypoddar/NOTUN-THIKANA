/**
 * Database Initialization
 *
 * This file initializes the database with default data.
 */

import { readCollection, writeCollection } from './core';
import { DB_CONFIG } from './config';
import { User, UserRole, UserStatus, USERS_COLLECTION } from './models/user.model';
import { createUser, userExists, findUserByEmail } from './services/user.service';
import {
  PostCategory,
  PostVisibility,
  POSTS_COLLECTION,
  COMMENTS_COLLECTION
} from './models/post.model';
import {
  createPost,
  createComment,
  findPostById
} from './services/post.service';
import {
  MessageType,
  MESSAGES_COLLECTION,
  CONVERSATIONS_COLLECTION
} from './models/message.model';
import {
  createMessage,
  findOrCreateConversation
} from './services/message.service';

/**
 * Initialize the database with default data
 */
export const initializeDatabase = (): void => {
  console.log('Initializing database...');

  // Initialize users collection with default users
  initializeUsers();

  // Initialize posts collection with sample posts
  initializePosts();

  // Initialize messages collection with sample messages
  initializeMessages();

  console.log('Database initialization complete.');
};

/**
 * Initialize the users collection with default users
 */
const initializeUsers = (): void => {
  // Default users
  const defaultUsers = [
    {
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'admin123',
      role: UserRole.ADMIN,
    },
    {
      name: 'Regular User',
      email: 'user@example.com',
      password: 'user123',
      role: UserRole.USER,
    },
    {
      name: 'Landlord User',
      email: 'landlord@example.com',
      password: 'landlord123',
      role: UserRole.LANDLORD,
    },
    {
      name: 'Agent User',
      email: 'agent@example.com',
      password: 'agent123',
      role: UserRole.AGENT,
    },
  ];

  // Create default users if they don't exist
  for (const user of defaultUsers) {
    try {
      if (!userExists(user.email)) {
        createUser(user.name, user.email, user.password, user.role);
        console.log(`Created default user: ${user.email}`);
      }
    } catch (error) {
      console.error(`Error creating default user ${user.email}:`, error);
    }
  }
};

/**
 * Initialize the posts collection with sample posts
 */
const initializePosts = (): void => {
  // Check if posts collection is empty
  const posts = readCollection(POSTS_COLLECTION);
  if (posts.length > 0) {
    return;
  }

  // Get user IDs for sample posts
  const adminUser = findUserByEmail('admin@example.com');
  const regularUser = findUserByEmail('user@example.com');
  const landlordUser = findUserByEmail('landlord@example.com');
  const agentUser = findUserByEmail('agent@example.com');

  if (!adminUser || !regularUser || !landlordUser || !agentUser) {
    console.error('Cannot initialize posts: some users are missing');
    return;
  }

  // Sample posts
  const samplePosts = [
    {
      title: 'Welcome to Notun Thikana',
      content: 'Welcome to our community! This is a platform for finding and sharing housing information in Bangladesh. Feel free to explore and connect with others.',
      authorId: adminUser.id,
      authorName: adminUser.name,
      authorImage: adminUser.image,
      category: PostCategory.ANNOUNCEMENT,
      isPinned: true,
      isFeatured: true,
    },
    {
      title: 'Looking for a 2-bedroom apartment in Dhanmondi',
      content: 'I am looking for a 2-bedroom apartment in Dhanmondi area. My budget is around 25,000 BDT per month. Please contact me if you have any leads.',
      authorId: regularUser.id,
      authorName: regularUser.name,
      authorImage: regularUser.image,
      category: PostCategory.GENERAL,
    },
    {
      title: 'New property available in Gulshan',
      content: 'I have a new 3-bedroom apartment available for rent in Gulshan 2. It has modern amenities including 24/7 security, generator, and parking space. Rent is 45,000 BDT per month.',
      authorId: landlordUser.id,
      authorName: landlordUser.name,
      authorImage: landlordUser.image,
      category: PostCategory.PROPERTY,
      isFeatured: true,
    },
    {
      title: 'Tips for finding good housing in Dhaka',
      content: 'After years of experience in the real estate market, here are my top tips for finding good housing in Dhaka:\n\n1. Start your search early\n2. Be clear about your requirements\n3. Visit the property at different times of day\n4. Check water and electricity supply\n5. Talk to neighbors if possible\n\nHope this helps!',
      authorId: agentUser.id,
      authorName: agentUser.name,
      authorImage: agentUser.image,
      category: PostCategory.DISCUSSION,
    },
    {
      title: 'Anonymous question about rental agreements',
      content: 'I have a question about rental agreements in Bangladesh. Is it normal for landlords to ask for 3 months of advance payment? What are my rights as a tenant?',
      authorId: regularUser.id,
      authorName: 'Anonymous',
      category: PostCategory.QUESTION,
      isAnonymous: true,
    },
  ];

  // Create sample posts
  for (const post of samplePosts) {
    try {
      const createdPost = createPost(
        post.title,
        post.content,
        post.authorId,
        post.authorName,
        post.authorImage,
        post.category,
        PostVisibility.PUBLIC,
        post.isAnonymous || false
      );

      // Update post with additional properties
      if (post.isPinned || post.isFeatured) {
        const update: any = {};
        if (post.isPinned) update.isPinned = true;
        if (post.isFeatured) update.isFeatured = true;

        const updatedPost = findPostById(createdPost.id);
        if (updatedPost) {
          writeCollection(POSTS_COLLECTION, readCollection(POSTS_COLLECTION).map(p => {
            if (p.id === createdPost.id) {
              return { ...p, ...update };
            }
            return p;
          }));
        }
      }

      console.log(`Created sample post: ${post.title}`);

      // Add sample comments to the first two posts
      if (samplePosts.indexOf(post) < 2) {
        const commentAuthors = [adminUser, regularUser, landlordUser, agentUser];
        const commentTexts = [
          'Great post! Thanks for sharing.',
          'I have a question about this. Can you provide more details?',
          'This is very helpful information.',
          'I agree with your points. Well said!',
        ];

        for (let i = 0; i < commentAuthors.length; i++) {
          if (commentAuthors[i].id !== post.authorId) { // Don't comment on your own post
            createComment(
              createdPost.id,
              commentTexts[i],
              commentAuthors[i].id,
              commentAuthors[i].name,
              commentAuthors[i].image
            );
          }
        }
      }
    } catch (error) {
      console.error(`Error creating sample post ${post.title}:`, error);
    }
  }

  console.log(`Created ${samplePosts.length} sample posts`);
};

/**
 * Initialize the messages collection with sample messages
 */
const initializeMessages = (): void => {
  // Check if messages collection is empty
  const messages = readCollection(MESSAGES_COLLECTION);
  if (messages.length > 0) {
    return;
  }

  // Get user IDs for sample messages
  const adminUser = findUserByEmail('admin@example.com');
  const regularUser = findUserByEmail('user@example.com');
  const landlordUser = findUserByEmail('landlord@example.com');
  const agentUser = findUserByEmail('agent@example.com');

  if (!adminUser || !regularUser || !landlordUser || !agentUser) {
    console.error('Cannot initialize messages: some users are missing');
    return;
  }

  // Create conversations and messages between users
  try {
    // Conversation between admin and regular user
    const conversation1 = findOrCreateConversation(adminUser.id, regularUser.id);
    createMessage(adminUser.id, regularUser.id, 'Hello! Welcome to Notun Thikana. How can I help you today?');
    createMessage(regularUser.id, adminUser.id, 'Hi! Thanks for the welcome. I\'m looking for an apartment in Dhanmondi area.');
    createMessage(adminUser.id, regularUser.id, 'Great! We have several listings in that area. What\'s your budget range?');
    createMessage(regularUser.id, adminUser.id, 'I\'m looking for something around 25,000 BDT per month.');
    createMessage(adminUser.id, regularUser.id, 'Perfect. I\'ll connect you with some landlords who have properties in that range.');

    // Conversation between regular user and landlord
    const conversation2 = findOrCreateConversation(regularUser.id, landlordUser.id);
    createMessage(regularUser.id, landlordUser.id, 'Hi, I saw your listing for the apartment in Gulshan. Is it still available?');
    createMessage(landlordUser.id, regularUser.id, 'Yes, it\'s still available. Would you like to schedule a viewing?');
    createMessage(regularUser.id, landlordUser.id, 'That would be great. When would be a good time?');
    createMessage(landlordUser.id, regularUser.id, 'How about this Saturday at 3 PM?');
    createMessage(regularUser.id, landlordUser.id, 'Saturday at 3 PM works for me. Please send me the address.');

    // Conversation between agent and landlord
    const conversation3 = findOrCreateConversation(agentUser.id, landlordUser.id);
    createMessage(agentUser.id, landlordUser.id, 'Hello, I have a client interested in your property in Gulshan.');
    createMessage(landlordUser.id, agentUser.id, 'That\'s great news! What are they looking for specifically?');
    createMessage(agentUser.id, landlordUser.id, 'They\'re a family of four looking for a 3-bedroom apartment with good security.');
    createMessage(landlordUser.id, agentUser.id, 'My property would be perfect for them. It has 24/7 security and is in a family-friendly area.');
    createMessage(agentUser.id, landlordUser.id, 'Excellent. Can we arrange a viewing for them next week?');

    console.log('Created sample conversations and messages');
  } catch (error) {
    console.error('Error creating sample messages:', error);
  }
};

// Initialize the database when this module is imported
try {
  initializeDatabase();
} catch (error) {
  console.error('Error initializing database:', error);
  console.log('Continuing without database initialization...');
}
