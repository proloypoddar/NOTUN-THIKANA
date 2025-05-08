/**
 * Post Model
 * 
 * This file defines the Post model for the database.
 */

import { BaseDocument } from '../operations';
import { DB_CONFIG } from '../config';

// Post status
export enum PostStatus {
  PUBLISHED = 'published',
  DRAFT = 'draft',
  ARCHIVED = 'archived',
  PENDING_REVIEW = 'pending_review',
  REJECTED = 'rejected',
}

// Post visibility
export enum PostVisibility {
  PUBLIC = 'public',
  PRIVATE = 'private',
  FRIENDS = 'friends',
  ANONYMOUS = 'anonymous',
}

// Post category
export enum PostCategory {
  GENERAL = 'general',
  ANNOUNCEMENT = 'announcement',
  QUESTION = 'question',
  DISCUSSION = 'discussion',
  EVENT = 'event',
  NEWS = 'news',
  PROPERTY = 'property',
  REVIEW = 'review',
}

// Post interface
export interface Post extends BaseDocument {
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  authorImage?: string;
  status: PostStatus;
  visibility: PostVisibility;
  category: PostCategory;
  tags: string[];
  likes: string[];
  views: number;
  commentCount: number;
  images?: {
    url: string;
    caption?: string;
  }[];
  location?: {
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  isDeleted: boolean;
  isAnonymous: boolean;
  isPinned: boolean;
  isFeatured: boolean;
  metadata?: Record<string, any>;
}

// Comment interface
export interface Comment extends BaseDocument {
  postId: string;
  content: string;
  authorId: string;
  authorName: string;
  authorImage?: string;
  likes: string[];
  isDeleted: boolean;
  isAnonymous: boolean;
  parentId?: string;
  replyCount?: number;
}

// Collection names for posts
export const POSTS_COLLECTION = DB_CONFIG.COLLECTIONS.POSTS;
export const COMMENTS_COLLECTION = 'comments';

// Create a new post object with default values
export const createPostObject = (
  title: string,
  content: string,
  authorId: string,
  authorName: string,
  authorImage?: string,
  category: PostCategory = PostCategory.GENERAL,
  visibility: PostVisibility = PostVisibility.PUBLIC,
  isAnonymous: boolean = false
): Omit<Post, keyof BaseDocument> => {
  return {
    title,
    content,
    authorId,
    authorName,
    authorImage,
    status: PostStatus.PUBLISHED,
    visibility,
    category,
    tags: [],
    likes: [],
    views: 0,
    commentCount: 0,
    isDeleted: false,
    isAnonymous,
    isPinned: false,
    isFeatured: false,
  };
};

// Create a new comment object with default values
export const createCommentObject = (
  postId: string,
  content: string,
  authorId: string,
  authorName: string,
  authorImage?: string,
  isAnonymous: boolean = false,
  parentId?: string
): Omit<Comment, keyof BaseDocument> => {
  return {
    postId,
    content,
    authorId,
    authorName,
    authorImage,
    likes: [],
    isDeleted: false,
    isAnonymous,
    parentId,
    replyCount: 0,
  };
};
