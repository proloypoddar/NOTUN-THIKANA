/**
 * User Model
 * 
 * This file defines the User model for the database.
 */

import { BaseDocument } from '../operations';
import { DB_CONFIG } from '../config';

// User roles
export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  LANDLORD = 'landlord',
  AGENT = 'agent',
}

// User status
export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  PENDING = 'pending',
}

// User interface
export interface User extends BaseDocument {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  status: UserStatus;
  image?: string;
  phone?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
  bio?: string;
  lastLogin?: string;
  emailVerified?: boolean;
  phoneVerified?: boolean;
}

// Collection name for users
export const USERS_COLLECTION = DB_CONFIG.COLLECTIONS.USERS;

// Validation functions
export const validateUserEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateUserPassword = (password: string): boolean => {
  // Password must be at least 6 characters
  return password.length >= 6;
};

export const validateUserName = (name: string): boolean => {
  // Name must be at least 2 characters
  return name.length >= 2;
};

// Create a new user object with default values
export const createUserObject = (
  name: string,
  email: string,
  password: string,
  role: UserRole = UserRole.USER
): Omit<User, keyof BaseDocument> => {
  return {
    name,
    email,
    password, // In a real app, this would be hashed
    role,
    status: UserStatus.ACTIVE,
    image: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`,
    emailVerified: false,
    phoneVerified: false,
  };
};
