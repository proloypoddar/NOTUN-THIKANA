/**
 * User Service
 *
 * This file provides services for user-related operations.
 */

import {
  findDocument,
  findDocuments,
  insertDocument,
  updateDocument,
  deleteDocument,
  documentExists
} from '../operations';
import {
  User,
  UserRole,
  USERS_COLLECTION,
  createUserObject,
  validateUserEmail,
  validateUserPassword,
  validateUserName
} from '../models/user.model';

/**
 * Find a user by email
 * @param email The email of the user to find
 * @returns The user with the specified email, or null if no user is found
 */
export const findUserByEmail = (email: string): User | null => {
  return findDocument<User>(USERS_COLLECTION, { email });
};

/**
 * Find a user by ID
 * @param id The ID of the user to find
 * @returns The user with the specified ID, or null if no user is found
 */
export const findUserById = (id: string): User | null => {
  if (!id) return null;
  return findDocument<User>(USERS_COLLECTION, { id });
};

/**
 * Get user data safe for client
 * @param id The ID of the user
 * @returns User data without sensitive information
 */
export const getUserSafeData = (id: string): Partial<User> | null => {
  const user = findUserById(id);
  if (!user) return null;

  // Return user data without sensitive information
  // Use type assertion to handle password removal
  const { password, ...safeUser } = user as any;
  return safeUser;
};

/**
 * Find users by role
 * @param role The role of the users to find
 * @returns An array of users with the specified role
 */
export const findUsersByRole = (role: UserRole): User[] => {
  return findDocuments<User>(USERS_COLLECTION, { role });
};

/**
 * Create a new user
 * @param name The name of the user
 * @param email The email of the user
 * @param password The password of the user
 * @param role The role of the user
 * @returns The created user
 * @throws Error if validation fails or user already exists
 */
export const createUser = (
  name: string,
  email: string,
  password: string,
  role: UserRole = UserRole.USER
): User => {
  // Validate user data
  if (!validateUserName(name)) {
    throw new Error('Invalid name. Name must be at least 2 characters.');
  }

  if (!validateUserEmail(email)) {
    throw new Error('Invalid email format.');
  }

  if (!validateUserPassword(password)) {
    throw new Error('Invalid password. Password must be at least 6 characters.');
  }

  // Check if user already exists
  if (findUserByEmail(email)) {
    throw new Error('User with this email already exists.');
  }

  // Create and insert the user
  const userObject = createUserObject(name, email, password, role);
  return insertDocument<Omit<User, keyof BaseDocument>>(USERS_COLLECTION, userObject);
};

/**
 * Update a user
 * @param id The ID of the user to update
 * @param update The fields to update
 * @returns The updated user, or null if no user is found
 */
export const updateUser = (
  id: string,
  update: Partial<Omit<User, 'id' | 'createdAt' | 'updatedAt'>>
): User | null => {
  // Validate email if provided
  if (update.email && !validateUserEmail(update.email)) {
    throw new Error('Invalid email format.');
  }

  // Validate password if provided
  if (update.password && !validateUserPassword(update.password)) {
    throw new Error('Invalid password. Password must be at least 6 characters.');
  }

  // Validate name if provided
  if (update.name && !validateUserName(update.name)) {
    throw new Error('Invalid name. Name must be at least 2 characters.');
  }

  return updateDocument<User>(USERS_COLLECTION, id, update);
};

/**
 * Delete a user
 * @param id The ID of the user to delete
 * @returns True if the user was deleted, false otherwise
 */
export const deleteUser = (id: string): boolean => {
  return deleteDocument<User>(USERS_COLLECTION, id);
};

/**
 * Authenticate a user
 * @param email The email of the user
 * @param password The password of the user
 * @returns The authenticated user, or null if authentication fails
 */
export const authenticateUser = (email: string, password: string): User | null => {
  const user = findUserByEmail(email);

  if (!user) {
    return null;
  }

  // In a real app, you would use bcrypt.compare
  if (user.password !== password) {
    return null;
  }

  return user;
};

/**
 * Check if a user exists
 * @param email The email of the user
 * @returns True if the user exists, false otherwise
 */
export const userExists = (email: string): boolean => {
  return documentExists<User>(USERS_COLLECTION, { email });
};

// Import BaseDocument type
import { BaseDocument } from '../operations';
