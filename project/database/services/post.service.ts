/**
 * Post Service
 * 
 * This file provides services for post-related operations.
 */

import { 
  findDocument, 
  findDocuments, 
  insertDocument, 
  updateDocument, 
  deleteDocument,
  documentExists,
  BaseDocument
} from '../operations';
import { 
  Post, 
  PostStatus, 
  PostVisibility,
  PostCategory,
  Comment,
  POSTS_COLLECTION,
  COMMENTS_COLLECTION,
  createPostObject,
  createCommentObject
} from '../models/post.model';

/**
 * Find a post by ID
 * @param id The ID of the post to find
 * @returns The post with the specified ID, or null if no post is found
 */
export const findPostById = (id: string): Post | null => {
  return findDocument<Post>(POSTS_COLLECTION, { id, isDeleted: false });
};

/**
 * Find posts with pagination
 * @param page The page number (1-based)
 * @param limit The number of posts per page
 * @param category Optional category filter
 * @param visibility Optional visibility filter
 * @returns An array of posts
 */
export const findPosts = (
  page: number = 1,
  limit: number = 10,
  category?: PostCategory,
  visibility: PostVisibility = PostVisibility.PUBLIC
): Post[] => {
  const query: Partial<Post> = { 
    isDeleted: false,
    status: PostStatus.PUBLISHED,
    visibility,
  };
  
  if (category) {
    query.category = category;
  }
  
  return findDocuments<Post>(POSTS_COLLECTION, query)
    .sort((a, b) => {
      // Sort by pinned first, then by creation date (most recent first)
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    })
    .slice((page - 1) * limit, page * limit);
};

/**
 * Find posts by author
 * @param authorId The ID of the author
 * @param page The page number (1-based)
 * @param limit The number of posts per page
 * @returns An array of posts by the author
 */
export const findPostsByAuthor = (
  authorId: string,
  page: number = 1,
  limit: number = 10
): Post[] => {
  return findDocuments<Post>(POSTS_COLLECTION, { authorId, isDeleted: false })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice((page - 1) * limit, page * limit);
};

/**
 * Find featured posts
 * @param limit The number of posts to return
 * @returns An array of featured posts
 */
export const findFeaturedPosts = (limit: number = 5): Post[] => {
  return findDocuments<Post>(POSTS_COLLECTION, { 
    isDeleted: false,
    status: PostStatus.PUBLISHED,
    visibility: PostVisibility.PUBLIC,
    isFeatured: true,
  })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit);
};

/**
 * Search posts
 * @param query The search query
 * @param page The page number (1-based)
 * @param limit The number of posts per page
 * @returns An array of posts that match the search query
 */
export const searchPosts = (
  query: string,
  page: number = 1,
  limit: number = 10
): Post[] => {
  const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 0);
  
  return findDocuments<Post>(POSTS_COLLECTION, { 
    isDeleted: false,
    status: PostStatus.PUBLISHED,
    visibility: PostVisibility.PUBLIC,
  })
    .filter(post => {
      const titleLower = post.title.toLowerCase();
      const contentLower = post.content.toLowerCase();
      const tagsLower = post.tags.map(tag => tag.toLowerCase());
      
      return searchTerms.some(term => 
        titleLower.includes(term) || 
        contentLower.includes(term) || 
        tagsLower.some(tag => tag.includes(term))
      );
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice((page - 1) * limit, page * limit);
};

/**
 * Create a new post
 * @param title The title of the post
 * @param content The content of the post
 * @param authorId The ID of the author
 * @param authorName The name of the author
 * @param category The category of the post
 * @param visibility The visibility of the post
 * @param isAnonymous Whether the post is anonymous
 * @returns The created post
 */
export const createPost = (
  title: string,
  content: string,
  authorId: string,
  authorName: string,
  authorImage?: string,
  category: PostCategory = PostCategory.GENERAL,
  visibility: PostVisibility = PostVisibility.PUBLIC,
  isAnonymous: boolean = false
): Post => {
  // Validate post data
  if (!title || title.trim().length === 0) {
    throw new Error('Post title is required');
  }
  
  if (!content || content.trim().length === 0) {
    throw new Error('Post content is required');
  }
  
  // Create the post
  const postObject = createPostObject(
    title,
    content,
    authorId,
    isAnonymous ? 'Anonymous' : authorName,
    isAnonymous ? undefined : authorImage,
    category,
    visibility,
    isAnonymous
  );
  
  return insertDocument<Omit<Post, keyof BaseDocument>>(POSTS_COLLECTION, postObject);
};

/**
 * Update a post
 * @param id The ID of the post to update
 * @param update The fields to update
 * @param userId The ID of the user making the update
 * @returns The updated post, or null if no post is found or the user is not the author
 */
export const updatePost = (
  id: string,
  update: Partial<Omit<Post, 'id' | 'authorId' | 'createdAt' | 'updatedAt'>>,
  userId: string
): Post | null => {
  const post = findPostById(id);
  
  if (!post) {
    return null;
  }
  
  // Check if the user is the author
  if (post.authorId !== userId) {
    return null;
  }
  
  return updateDocument<Post>(POSTS_COLLECTION, id, update);
};

/**
 * Delete a post (soft delete)
 * @param id The ID of the post to delete
 * @param userId The ID of the user making the deletion
 * @returns True if the post was deleted, false otherwise
 */
export const deletePost = (
  id: string,
  userId: string
): boolean => {
  const post = findPostById(id);
  
  if (!post) {
    return false;
  }
  
  // Check if the user is the author
  if (post.authorId !== userId) {
    return false;
  }
  
  return updateDocument<Post>(POSTS_COLLECTION, id, { isDeleted: true }) !== null;
};

/**
 * Like or unlike a post
 * @param id The ID of the post
 * @param userId The ID of the user liking or unliking the post
 * @returns The updated post, or null if no post is found
 */
export const togglePostLike = (
  id: string,
  userId: string
): Post | null => {
  const post = findPostById(id);
  
  if (!post) {
    return null;
  }
  
  const likes = [...post.likes];
  const userLikeIndex = likes.indexOf(userId);
  
  if (userLikeIndex === -1) {
    // User hasn't liked the post yet, so add the like
    likes.push(userId);
  } else {
    // User already liked the post, so remove the like
    likes.splice(userLikeIndex, 1);
  }
  
  return updateDocument<Post>(POSTS_COLLECTION, id, { likes });
};

/**
 * Increment the view count of a post
 * @param id The ID of the post
 * @returns The updated post, or null if no post is found
 */
export const incrementPostView = (
  id: string
): Post | null => {
  const post = findPostById(id);
  
  if (!post) {
    return null;
  }
  
  return updateDocument<Post>(POSTS_COLLECTION, id, { views: post.views + 1 });
};

/**
 * Find comments for a post
 * @param postId The ID of the post
 * @param page The page number (1-based)
 * @param limit The number of comments per page
 * @returns An array of comments for the post
 */
export const findCommentsByPost = (
  postId: string,
  page: number = 1,
  limit: number = 10
): Comment[] => {
  return findDocuments<Comment>(COMMENTS_COLLECTION, { postId, isDeleted: false, parentId: undefined })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice((page - 1) * limit, page * limit);
};

/**
 * Find replies to a comment
 * @param commentId The ID of the parent comment
 * @param page The page number (1-based)
 * @param limit The number of replies per page
 * @returns An array of replies to the comment
 */
export const findRepliesByComment = (
  commentId: string,
  page: number = 1,
  limit: number = 10
): Comment[] => {
  return findDocuments<Comment>(COMMENTS_COLLECTION, { parentId: commentId, isDeleted: false })
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    .slice((page - 1) * limit, page * limit);
};

/**
 * Create a new comment
 * @param postId The ID of the post
 * @param content The content of the comment
 * @param authorId The ID of the author
 * @param authorName The name of the author
 * @param isAnonymous Whether the comment is anonymous
 * @param parentId The ID of the parent comment (for replies)
 * @returns The created comment
 */
export const createComment = (
  postId: string,
  content: string,
  authorId: string,
  authorName: string,
  authorImage?: string,
  isAnonymous: boolean = false,
  parentId?: string
): Comment => {
  // Validate comment data
  if (!content || content.trim().length === 0) {
    throw new Error('Comment content is required');
  }
  
  const post = findPostById(postId);
  if (!post) {
    throw new Error('Post not found');
  }
  
  // If this is a reply, check if the parent comment exists
  if (parentId) {
    const parentComment = findDocument<Comment>(COMMENTS_COLLECTION, { id: parentId, isDeleted: false });
    if (!parentComment) {
      throw new Error('Parent comment not found');
    }
    
    // Increment the reply count of the parent comment
    updateDocument<Comment>(COMMENTS_COLLECTION, parentId, {
      replyCount: (parentComment.replyCount || 0) + 1,
    });
  }
  
  // Create the comment
  const commentObject = createCommentObject(
    postId,
    content,
    authorId,
    isAnonymous ? 'Anonymous' : authorName,
    isAnonymous ? undefined : authorImage,
    isAnonymous,
    parentId
  );
  
  const comment = insertDocument<Omit<Comment, keyof BaseDocument>>(COMMENTS_COLLECTION, commentObject);
  
  // Increment the comment count of the post
  updateDocument<Post>(POSTS_COLLECTION, postId, {
    commentCount: post.commentCount + 1,
  });
  
  return comment;
};

/**
 * Delete a comment (soft delete)
 * @param id The ID of the comment to delete
 * @param userId The ID of the user making the deletion
 * @returns True if the comment was deleted, false otherwise
 */
export const deleteComment = (
  id: string,
  userId: string
): boolean => {
  const comment = findDocument<Comment>(COMMENTS_COLLECTION, { id, isDeleted: false });
  
  if (!comment) {
    return false;
  }
  
  // Check if the user is the author
  if (comment.authorId !== userId) {
    return false;
  }
  
  // Soft delete the comment
  const updated = updateDocument<Comment>(COMMENTS_COLLECTION, id, { isDeleted: true });
  
  if (updated) {
    // Decrement the comment count of the post
    const post = findPostById(comment.postId);
    if (post) {
      updateDocument<Post>(POSTS_COLLECTION, comment.postId, {
        commentCount: Math.max(0, post.commentCount - 1),
      });
    }
    
    // If this is a reply, decrement the reply count of the parent comment
    if (comment.parentId) {
      const parentComment = findDocument<Comment>(COMMENTS_COLLECTION, { id: comment.parentId });
      if (parentComment) {
        updateDocument<Comment>(COMMENTS_COLLECTION, comment.parentId, {
          replyCount: Math.max(0, (parentComment.replyCount || 0) - 1),
        });
      }
    }
    
    return true;
  }
  
  return false;
};

/**
 * Like or unlike a comment
 * @param id The ID of the comment
 * @param userId The ID of the user liking or unliking the comment
 * @returns The updated comment, or null if no comment is found
 */
export const toggleCommentLike = (
  id: string,
  userId: string
): Comment | null => {
  const comment = findDocument<Comment>(COMMENTS_COLLECTION, { id, isDeleted: false });
  
  if (!comment) {
    return null;
  }
  
  const likes = [...comment.likes];
  const userLikeIndex = likes.indexOf(userId);
  
  if (userLikeIndex === -1) {
    // User hasn't liked the comment yet, so add the like
    likes.push(userId);
  } else {
    // User already liked the comment, so remove the like
    likes.splice(userLikeIndex, 1);
  }
  
  return updateDocument<Comment>(COMMENTS_COLLECTION, id, { likes });
};
