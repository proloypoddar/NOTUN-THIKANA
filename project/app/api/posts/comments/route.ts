import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/dbConnect';
import Post from '@/models/Post';
import User from '@/models/User';
import Notification from '@/models/Notification';

// POST /api/posts/comments - Add a comment to a post
export async function POST(request: NextRequest) {
  try {
    // Get the current user from the session
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Connect to the database
    await dbConnect();

    // Get the request body
    const { postId, content } = await request.json();

    // Validate input
    if (!postId || !content) {
      return NextResponse.json(
        { message: 'Post ID and comment content are required' },
        { status: 400 }
      );
    }

    // Find the user in the database
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Find the post
    const post = await Post.findById(postId);
    if (!post) {
      return NextResponse.json(
        { message: 'Post not found' },
        { status: 404 }
      );
    }

    // Create the comment
    const comment = {
      author: user._id,
      content,
      createdAt: new Date(),
    };

    // Add the comment to the post
    post.comments.push(comment);
    await post.save();

    // Populate the comment author
    await post.populate('comments.author', 'name image');

    // Create a notification for the post author if it's not the current user
    if (post.author.toString() !== user._id.toString()) {
      await Notification.create({
        recipient: post.author,
        sender: user._id,
        type: 'post_comment',
        content: `${user.name} commented on your post`,
        link: `/posts/${post._id}`,
        relatedId: post._id,
      });
    }

    return NextResponse.json(
      { message: 'Comment added successfully', data: post.comments[post.comments.length - 1] },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error adding comment:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/posts/comments - Delete a comment from a post
export async function DELETE(request: NextRequest) {
  try {
    // Get the current user from the session
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Connect to the database
    await dbConnect();

    // Get the query parameters
    const url = new URL(request.url);
    const postId = url.searchParams.get('postId');
    const commentId = url.searchParams.get('commentId');

    // Validate input
    if (!postId || !commentId) {
      return NextResponse.json(
        { message: 'Post ID and comment ID are required' },
        { status: 400 }
      );
    }

    // Find the user in the database
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Find the post
    const post = await Post.findById(postId);
    if (!post) {
      return NextResponse.json(
        { message: 'Post not found' },
        { status: 404 }
      );
    }

    // Find the comment
    const comment = post.comments.id(commentId);
    if (!comment) {
      return NextResponse.json(
        { message: 'Comment not found' },
        { status: 404 }
      );
    }

    // Check if the user is the author of the comment or the post
    if (comment.author.toString() !== user._id.toString() && 
        post.author.toString() !== user._id.toString()) {
      return NextResponse.json(
        { message: 'You do not have permission to delete this comment' },
        { status: 403 }
      );
    }

    // Remove the comment
    comment.remove();
    await post.save();

    return NextResponse.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Error deleting comment:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
