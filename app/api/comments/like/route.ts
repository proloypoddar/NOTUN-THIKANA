import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { toggleCommentLike } from '@/database';

// PUT /api/comments/like - Like or unlike a comment
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
    const { id } = await request.json();
    
    // Validate input
    if (!id) {
      return NextResponse.json(
        { message: 'Comment ID is required' },
        { status: 400 }
      );
    }
    
    // Toggle like
    const updatedComment = toggleCommentLike(id, session.user.id);
    
    if (!updatedComment) {
      return NextResponse.json(
        { message: 'Comment not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      message: 'Comment like toggled successfully', 
      data: updatedComment,
      liked: updatedComment.likes.includes(session.user.id)
    });
  } catch (error) {
    console.error('Error toggling comment like:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
