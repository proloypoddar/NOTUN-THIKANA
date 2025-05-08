/**
 * Database Operations
 *
 * This file contains the CRUD operations for the local JSON database.
 * It provides methods for finding, inserting, updating, and deleting documents.
 */

import { v4 as uuidv4 } from 'uuid';
import { readCollection, writeCollection } from './core';
import { DB_CONFIG } from './config';

/**
 * Base document interface
 * All documents in the database should extend this interface
 */
export interface BaseDocument {
  id: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Find documents in a collection
 * @param collection The name of the collection
 * @param query The query to filter documents
 * @returns An array of documents that match the query
 */
export const findDocuments = <T extends BaseDocument>(
  collection: string,
  query: Partial<T> = {}
): T[] => {
  try {
    const data = readCollection<T>(collection);

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
  } catch (error) {
    console.error(`Error finding documents in ${collection}:`, error);
    return [];
  }
};

/**
 * Find a single document in a collection
 * @param collection The name of the collection
 * @param query The query to filter documents
 * @returns The first document that matches the query, or null if no document is found
 */
export const findDocument = <T extends BaseDocument>(
  collection: string,
  query: Partial<T> = {}
): T | null => {
  try {
    const results = findDocuments<T>(collection, query);
    return results.length > 0 ? results[0] : null;
  } catch (error) {
    console.error(`Error finding document in ${collection}:`, error);
    return null;
  }
};

/**
 * Find a document by ID
 * @param collection The name of the collection
 * @param id The ID of the document to find
 * @returns The document with the specified ID, or null if no document is found
 */
export const findDocumentById = <T extends BaseDocument>(
  collection: string,
  id: string
): T | null => {
  if (!id) return null;

  try {
    const data = readCollection<T>(collection);
    return data.find(item => item.id === id) || null;
  } catch (error) {
    console.error(`Error finding document by ID in ${collection}:`, error);
    return null;
  }
};

/**
 * Insert a document into a collection
 * @param collection The name of the collection
 * @param document The document to insert
 * @returns The inserted document with ID and timestamps
 */
export const insertDocument = <T extends Omit<BaseDocument, 'id' | 'createdAt' | 'updatedAt'>>(
  collection: string,
  document: T
): T & BaseDocument => {
  const data = readCollection<T & BaseDocument>(collection);

  // Generate a unique ID and timestamps for the document
  const now = new Date().toISOString();
  const newDocument = {
    id: uuidv4(),
    ...document,
    createdAt: now,
    updatedAt: now,
  } as T & BaseDocument;

  data.push(newDocument);
  writeCollection(collection, data);

  return newDocument;
};

/**
 * Update a document in a collection
 * @param collection The name of the collection
 * @param id The ID of the document to update
 * @param update The fields to update
 * @returns The updated document, or null if no document is found
 */
export const updateDocument = <T extends BaseDocument>(
  collection: string,
  id: string,
  update: Partial<Omit<T, 'id' | 'createdAt' | 'updatedAt'>>
): T | null => {
  const data = readCollection<T>(collection);

  const index = data.findIndex(item => item.id === id);
  if (index === -1) return null;

  // Update the document
  data[index] = {
    ...data[index],
    ...update,
    updatedAt: new Date().toISOString(),
  };

  writeCollection(collection, data);

  return data[index];
};

/**
 * Delete a document from a collection
 * @param collection The name of the collection
 * @param id The ID of the document to delete
 * @returns True if the document was deleted, false otherwise
 */
export const deleteDocument = <T extends BaseDocument>(
  collection: string,
  id: string
): boolean => {
  const data = readCollection<T>(collection);

  const index = data.findIndex(item => item.id === id);
  if (index === -1) return false;

  data.splice(index, 1);
  writeCollection(collection, data);

  return true;
};

/**
 * Count documents in a collection
 * @param collection The name of the collection
 * @param query The query to filter documents
 * @returns The number of documents that match the query
 */
export const countDocuments = <T extends BaseDocument>(
  collection: string,
  query: Partial<T> = {}
): number => {
  return findDocuments<T>(collection, query).length;
};

/**
 * Check if a document exists in a collection
 * @param collection The name of the collection
 * @param query The query to filter documents
 * @returns True if a document exists, false otherwise
 */
export const documentExists = <T extends BaseDocument>(
  collection: string,
  query: Partial<T>
): boolean => {
  return findDocument<T>(collection, query) !== null;
};
