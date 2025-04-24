import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import {
  findPosts,
  findPostById,
  createPost,
  updatePost,
  deletePost,
  togglePostLike,
  incrementPostView,
  PostCategory,
  PostVisibility,
  getUserSafeData
} from '@/database';

// GET /api/posts - Get all posts or a specific post
export async function GET(request: Request) {
  try {
    // Get the query parameters
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const category = url.searchParams.get('category') as PostCategory | undefined;

    if (id) {
      // If ID is provided, get a specific post
      const post = findPostById(id);

      if (!post) {
        return NextResponse.json(
          { message: 'Post not found' },
          { status: 404 }
        );
      }

      // Increment view count
      incrementPostView(id);

      return NextResponse.json({ post });
    } else {
      // Otherwise, get all posts with pagination
      const posts = findPosts(page, limit, category);
      return NextResponse.json({ posts, page, limit });
    }
  } catch (error) {
    console.error('Error getting posts:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/posts - Create a new post
export async function POST(request: Request) {
  try {
    // Get the current user from the session
    const session = await getServerSession(authOptions);

    // Get the request body
    const {
      title,
      content,
      category = PostCategory.GENERAL,
      visibility = PostVisibility.PUBLIC,
      isAnonymous = false,
      authorId, // Allow client to provide author ID
      authorName // Allow client to provide author name
    } = await request.json();

    // Validate input
    if (!title || !content) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Use session data if available, otherwise use provided data or defaults
    const userId = session?.user?.id || authorId || 'guest-user';
    const userName = session?.user?.name || authorName || 'Guest User';
    const userImage = session?.user?.image || undefined;

    // Create the post
    const post = createPost(
      title,
      content,
      userId,
      userName,
      userImage,
      category as PostCategory,
      visibility as PostVisibility,
      isAnonymous
    );

    return NextResponse.json(
      { message: 'Post created successfully', data: post },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/posts - Update a post
export async function PUT(request: Request) {
  try {
    // Get the current user from the session
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get the request body
    const { id, title, content, category, visibility } = await request.json();

    // Validate input
    if (!id) {
      return NextResponse.json(
        { message: 'Post ID is required' },
        { status: 400 }
      );
    }

    // Create the update object
    const update: any = {};
    if (title) update.title = title;
    if (content) update.content = content;
    if (category) update.category = category;
    if (visibility) update.visibility = visibility;

    // Update the post
    const updatedPost = updatePost(id, update, session.user.id);

    if (!updatedPost) {
      return NextResponse.json(
        { message: 'Post not found or you do not have permission to update it' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Post updated successfully', data: updatedPost });
  } catch (error) {
    console.error('Error updating post:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/posts - Delete a post
export async function DELETE(request: Request) {
  try {
    // Get the current user from the session
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get the query parameters
    const url = new URL(request.url);
    const id = url.searchParams.get('id');

    // Validate input
    if (!id) {
      return NextResponse.json(
        { message: 'Post ID is required' },
        { status: 400 }
      );
    }

    // Delete the post
    const success = deletePost(id, session.user.id);

    if (!success) {
      return NextResponse.json(
        { message: 'Post not found or you do not have permission to delete it' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
