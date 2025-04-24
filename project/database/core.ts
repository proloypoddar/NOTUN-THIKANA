/**
 * Database Core Functionality
 * 
 * This file contains the core functionality for the local JSON database.
 * It provides methods for reading and writing data to the database files.
 */

import fs from 'fs';
import { DB_CONFIG, getCollectionPath, CollectionName } from './config';

/**
 * Read data from a collection file
 * @param collection The name of the collection
 * @returns The data from the collection file
 */
export const readCollection = <T>(collection: string): T[] => {
  const filePath = getCollectionPath(collection);
  
  // Create the file if it doesn't exist
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify([], null, DB_CONFIG.STRINGIFY_OPTIONS.spaces));
    return [];
  }
  
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data) as T[];
  } catch (error) {
    console.error(`Error reading collection ${collection}:`, error);
    // If there's an error reading the file, create a new empty collection
    fs.writeFileSync(filePath, JSON.stringify([], null, DB_CONFIG.STRINGIFY_OPTIONS.spaces));
    return [];
  }
};

/**
 * Write data to a collection file
 * @param collection The name of the collection
 * @param data The data to write to the collection file
 */
export const writeCollection = <T>(collection: string, data: T[]): void => {
  const filePath = getCollectionPath(collection);
  
  try {
    fs.writeFileSync(
      filePath, 
      JSON.stringify(data, DB_CONFIG.STRINGIFY_OPTIONS.replacer, DB_CONFIG.STRINGIFY_OPTIONS.spaces)
    );
  } catch (error) {
    console.error(`Error writing to collection ${collection}:`, error);
    throw new Error(`Failed to write to collection ${collection}`);
  }
};

/**
 * Get all collections in the database
 * @returns An array of collection names
 */
export const getAllCollections = (): string[] => {
  if (!fs.existsSync(DB_CONFIG.DB_DIR)) {
    return [];
  }
  
  try {
    return fs.readdirSync(DB_CONFIG.DB_DIR)
      .filter(file => file.endsWith(DB_CONFIG.FILE_EXTENSION))
      .map(file => file.replace(DB_CONFIG.FILE_EXTENSION, ''));
  } catch (error) {
    console.error('Error getting collections:', error);
    return [];
  }
};

/**
 * Clear all data in a collection
 * @param collection The name of the collection to clear
 */
export const clearCollection = (collection: string): void => {
  writeCollection(collection, []);
};

/**
 * Delete a collection file
 * @param collection The name of the collection to delete
 */
export const deleteCollection = (collection: string): void => {
  const filePath = getCollectionPath(collection);
  
  if (fs.existsSync(filePath)) {
    try {
      fs.unlinkSync(filePath);
    } catch (error) {
      console.error(`Error deleting collection ${collection}:`, error);
      throw new Error(`Failed to delete collection ${collection}`);
    }
  }
};

/**
 * Backup a collection to a JSON file
 * @param collection The name of the collection to backup
 * @param backupDir The directory to store the backup
 */
export const backupCollection = (collection: string, backupDir: string = path.join(DB_CONFIG.DB_DIR, 'backups')): void => {
  // Ensure the backup directory exists
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }
  
  const data = readCollection(collection);
  const timestamp = new Date().toISOString().replace(/:/g, '-');
  const backupPath = path.join(backupDir, `${collection}_${timestamp}${DB_CONFIG.FILE_EXTENSION}`);
  
  try {
    fs.writeFileSync(
      backupPath, 
      JSON.stringify(data, DB_CONFIG.STRINGIFY_OPTIONS.replacer, DB_CONFIG.STRINGIFY_OPTIONS.spaces)
    );
    console.log(`Backed up collection ${collection} to ${backupPath}`);
  } catch (error) {
    console.error(`Error backing up collection ${collection}:`, error);
    throw new Error(`Failed to backup collection ${collection}`);
  }
};

// Import path for backup functionality
import path from 'path';
