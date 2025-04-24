import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

// Define the database directory
const DB_DIR = path.join(process.cwd(), 'local-db');

// Ensure the database directory exists
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

// Define collection types
export type Collection = 'users' | 'posts' | 'messages' | 'profiles';

// Get the path to a collection file
const getCollectionPath = (collection: Collection): string => {
  return path.join(DB_DIR, `${collection}.json`);
};

// Initialize a collection if it doesn't exist
const initializeCollection = (collection: Collection): any[] => {
  const filePath = getCollectionPath(collection);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify([]));
    return [];
  }
  
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading ${collection} collection:`, error);
    // If there's an error reading the file, create a new empty collection
    fs.writeFileSync(filePath, JSON.stringify([]));
    return [];
  }
};

// Save data to a collection
const saveCollection = (collection: Collection, data: any[]): void => {
  const filePath = getCollectionPath(collection);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

// Find documents in a collection
export const findDocuments = <T>(
  collection: Collection,
  query: Partial<T> = {}
): T[] => {
  const data = initializeCollection(collection) as T[];
  
  // If no query is provided, return all documents
  if (Object.keys(query).length === 0) {
    return data;
  }
  
  // Filter documents based on the query
  return data.filter(item => {
    return Object.entries(query).every(([key, value]) => {
      return item[key as keyof T] === value;
    });
  });
};

// Find a single document in a collection
export const findDocument = <T>(
  collection: Collection,
  query: Partial<T> = {}
): T | null => {
  const results = findDocuments<T>(collection, query);
  return results.length > 0 ? results[0] : null;
};

// Find a document by ID
export const findDocumentById = <T>(
  collection: Collection,
  id: string
): T | null => {
  const data = initializeCollection(collection) as Array<T & { id: string }>;
  return data.find(item => item.id === id) as T || null;
};

// Insert a document into a collection
export const insertDocument = <T>(
  collection: Collection,
  document: Omit<T, 'id'>
): T => {
  const data = initializeCollection(collection);
  
  // Generate a unique ID for the document
  const newDocument = {
    id: uuidv4(),
    ...document,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  } as T;
  
  data.push(newDocument);
  saveCollection(collection, data);
  
  return newDocument;
};

// Update a document in a collection
export const updateDocument = <T>(
  collection: Collection,
  id: string,
  update: Partial<T>
): T | null => {
  const data = initializeCollection(collection) as Array<T & { id: string, updatedAt: string }>;
  
  const index = data.findIndex(item => item.id === id);
  if (index === -1) return null;
  
  // Update the document
  data[index] = {
    ...data[index],
    ...update,
    updatedAt: new Date().toISOString(),
  };
  
  saveCollection(collection, data);
  
  return data[index] as T;
};

// Delete a document from a collection
export const deleteDocument = <T>(
  collection: Collection,
  id: string
): boolean => {
  const data = initializeCollection(collection) as Array<T & { id: string }>;
  
  const index = data.findIndex(item => item.id === id);
  if (index === -1) return false;
  
  data.splice(index, 1);
  saveCollection(collection, data);
  
  return true;
};

// Initialize the database with default data
export const initializeDatabase = (): void => {
  // Initialize users collection with default admin user
  const users = initializeCollection('users');
  if (users.length === 0) {
    insertDocument('users', {
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'admin123', // In a real app, this would be hashed
      role: 'admin',
      image: 'https://randomuser.me/api/portraits/men/1.jpg',
    });
    
    insertDocument('users', {
      name: 'Regular User',
      email: 'user@example.com',
      password: 'user123',
      role: 'user',
      image: 'https://randomuser.me/api/portraits/women/1.jpg',
    });
    
    insertDocument('users', {
      name: 'Landlord User',
      email: 'landlord@example.com',
      password: 'landlord123',
      role: 'landlord',
      image: 'https://randomuser.me/api/portraits/men/2.jpg',
    });
    
    console.log('Database initialized with default users');
  }
};

// Initialize the database when this module is imported
initializeDatabase();
