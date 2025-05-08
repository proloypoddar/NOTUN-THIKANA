import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { togglePostLike } from '@/database';

// PUT /api/posts/like - Like or unlike a post
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
        { message: 'Post ID is required' },
        { status: 400 }
      );
    }
    
    // Toggle like
    const updatedPost = togglePostLike(id, session.user.id);
    
    if (!updatedPost) {
      return NextResponse.json(
        { message: 'Post not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      message: 'Post like toggled successfully', 
      data: updatedPost,
      liked: updatedPost.likes.includes(session.user.id)
    });
  } catch (error) {
    console.error('Error toggling post like:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
