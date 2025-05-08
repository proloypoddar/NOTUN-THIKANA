import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';
import dbConnect from '@/lib/db/connect';
import { Post } from '@/lib/db/models/Post';
import { User } from '@/lib/db/models/User';
import mongoose from 'mongoose';

// Get a specific forum post by ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: 'Invalid post ID' },
        { status: 400 }
      );
    }

    await dbConnect();

    // Find the post and increment view count
    const post = await Post.findByIdAndUpdate(
      id,
      { $inc: { views: 1 } },
      { new: true }
    ).populate({
      path: 'author',
      select: 'name image',
    }).populate({
      path: 'comments.author',
      select: 'name image',
    });

    if (!post) {
      return NextResponse.json(
        { message: 'Forum post not found' },
        { status: 404 }
      );
    }

    // Format post for client
    const formattedPost = {
      id: post._id.toString(),
      title: post.title,
      content: post.content,
      author: post.isAnonymous ? 'Anonymous' : post.author?.name || 'Unknown',
      authorImage: post.isAnonymous ? null : post.author?.image || null,
      date: post.createdAt.toISOString().split('T')[0],
      category: post.category,
      views: post.views || 0,
      likes: post.likes?.length || 0,
      isAnonymous: post.isAnonymous || false,
      tags: post.tags || [],
      isBoosted: post.isBoosted || false,
      comments: post.comments?.map((comment: any) => ({
        id: comment._id.toString(),
        content: comment.content,
        author: comment.isAnonymous ? 'Anonymous' : comment.author?.name || 'Unknown',
        authorImage: comment.isAnonymous ? null : comment.author?.image || null,
        date: comment.createdAt.toISOString().split('T')[0],
        likes: comment.likes?.length || 0,
        isAnonymous: comment.isAnonymous || false,
      })) || [],
    };

    return NextResponse.json(formattedPost);
  } catch (error) {
    console.error('Error fetching forum post details:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Add a comment to a post
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = params;
    const { content, isAnonymous } = await request.json();

    if (!content) {
      return NextResponse.json(
        { message: 'Comment content is required' },
        { status: 400 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: 'Invalid post ID' },
        { status: 400 }
      );
    }

    await dbConnect();

    // Get the current user
    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    // Find the post
    const post = await Post.findById(id);

    if (!post) {
      return NextResponse.json(
        { message: 'Forum post not found' },
        { status: 404 }
      );
    }

    // Add the comment
    const comment = {
      author: user._id,
      content,
      isAnonymous: isAnonymous || false,
      likes: [],
      createdAt: new Date(),
    };

    post.comments.push(comment);
    await post.save();

    // Get the newly added comment (last one in the array)
    const newComment = post.comments[post.comments.length - 1];

    return NextResponse.json({
      id: newComment._id.toString(),
      content: newComment.content,
      author: isAnonymous ? 'Anonymous' : user.name,
      authorImage: isAnonymous ? null : user.image || null,
      date: newComment.createdAt.toISOString().split('T')[0],
      likes: 0,
      isAnonymous: newComment.isAnonymous,
    }, { status: 201 });
  } catch (error) {
    console.error('Error adding comment:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Like or unlike a post
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: 'Invalid post ID' },
        { status: 400 }
      );
    }

    await dbConnect();

    // Get the current user
    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    // Find the post
    const post = await Post.findById(id);

    if (!post) {
      return NextResponse.json(
        { message: 'Forum post not found' },
        { status: 404 }
      );
    }

    // Check if user has already liked the post
    const userIdStr = user._id.toString();
    const likeIndex = post.likes.findIndex((id: any) => id.toString() === userIdStr);

    if (likeIndex === -1) {
      // User hasn't liked the post yet, add like
      post.likes.push(user._id);
    } else {
      // User already liked the post, remove like
      post.likes.splice(likeIndex, 1);
    }

    await post.save();

    return NextResponse.json({
      likes: post.likes.length,
      liked: likeIndex === -1, // true if like was added, false if removed
    });
  } catch (error) {
    console.error('Error liking/unliking post:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
