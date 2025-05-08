import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import {
  findCommentsByPost,
  findRepliesByComment,
  createComment,
  deleteComment,
  toggleCommentLike
} from '@/database';

// GET /api/comments - Get comments for a post or replies for a comment
export async function GET(request: Request) {
  try {
    // Get the query parameters
    const url = new URL(request.url);
    const postId = url.searchParams.get('postId');
    const commentId = url.searchParams.get('commentId');
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');

    if (!postId && !commentId) {
      return NextResponse.json(
        { message: 'Either postId or commentId is required' },
        { status: 400 }
      );
    }

    if (commentId) {
      // If commentId is provided, get replies for that comment
      const replies = findRepliesByComment(commentId, page, limit);
      return NextResponse.json({ replies, page, limit });
    } else {
      // Otherwise, get comments for the post
      const comments = findCommentsByPost(postId!, page, limit);
      return NextResponse.json({ comments, page, limit });
    }
  } catch (error) {
    console.error('Error getting comments:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/comments - Create a new comment
export async function POST(request: Request) {
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
    const {
      postId,
      content,
      isAnonymous = false,
      parentId
    } = await request.json();

    // Validate input
    if (!postId || !content) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create the comment
    try {
      const comment = createComment(
        postId,
        content,
        session.user.id,
        session.user.name || 'Anonymous',
        session.user.image || undefined,
        isAnonymous,
        parentId
      );

      return NextResponse.json(
        { message: 'Comment created successfully', data: comment },
        { status: 201 }
      );
    } catch (error) {
      return NextResponse.json(
        { message: error instanceof Error ? error.message : 'Failed to create comment' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error creating comment:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/comments - Delete a comment
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
        { message: 'Comment ID is required' },
        { status: 400 }
      );
    }

    // Delete the comment
    const success = deleteComment(id, session.user.id);

    if (!success) {
      return NextResponse.json(
        { message: 'Comment not found or you do not have permission to delete it' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Error deleting comment:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}


