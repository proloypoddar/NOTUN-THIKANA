/**
 * Database Configuration
 * 
 * This file contains the configuration for the local JSON database.
 * It defines the database directory, collection types, and other settings.
 */

import path from 'path';
import fs from 'fs';

// Database directory configuration
export const DB_CONFIG = {
  // Main database directory
  DB_DIR: path.join(process.cwd(), 'database', 'data'),
  
  // Collection names
  COLLECTIONS: {
    USERS: 'users',
    POSTS: 'posts',
    MESSAGES: 'messages',
    PROFILES: 'profiles',
    PROPERTIES: 'properties',
    BOOKINGS: 'bookings',
    REVIEWS: 'reviews',
    NOTIFICATIONS: 'notifications',
    SETTINGS: 'settings',
  },
  
  // File extension for database files
  FILE_EXTENSION: '.json',
  
  // Default options for JSON stringify
  STRINGIFY_OPTIONS: {
    spaces: 2,
    replacer: null,
  },
};

// Define collection types
export type CollectionName = keyof typeof DB_CONFIG.COLLECTIONS;

// Ensure the database directory exists
export const initializeDatabaseDirectory = (): void => {
  if (!fs.existsSync(DB_CONFIG.DB_DIR)) {
    fs.mkdirSync(DB_CONFIG.DB_DIR, { recursive: true });
    console.log(`Created database directory: ${DB_CONFIG.DB_DIR}`);
  }
};

// Get the path to a collection file
export const getCollectionPath = (collection: string): string => {
  return path.join(DB_CONFIG.DB_DIR, `${collection}${DB_CONFIG.FILE_EXTENSION}`);
};

// Initialize the database directory when this module is imported
initializeDatabaseDirectory();
