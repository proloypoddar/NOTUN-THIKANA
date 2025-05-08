import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/dbConnect';
import Post from '@/models/Post';
import User from '@/models/User';
import Notification from '@/models/Notification';

// Enum for post categories
export enum PostCategory {
  GENERAL = 'general',
  ANNOUNCEMENT = 'announcement',
  QUESTION = 'question',
  EVENT = 'event',
  HOUSING = 'housing',
  SERVICE = 'service',
}

// Enum for post visibility
export enum PostVisibility {
  PUBLIC = 'public',
  FRIENDS = 'friends',
  PRIVATE = 'private',
}

// GET /api/posts - Get all posts or a specific post
export async function GET(request: NextRequest) {
  try {
    // Get the session
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Connect to the database
    await dbConnect();

    // Get the query parameters
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const category = url.searchParams.get('category') as PostCategory | undefined;
    const skip = (page - 1) * limit;

    if (id) {
      // If ID is provided, get a specific post
      const post = await Post.findById(id)
        .populate('author', 'name image')
        .populate('comments.author', 'name image')
        .populate('likes', 'name image');

      if (!post) {
        return NextResponse.json(
          { message: 'Post not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({ post });
    } else {
      // Otherwise, get all posts with pagination
      const query = category ? { category } : {};

      const posts = await Post.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('author', 'name image')
        .populate('comments.author', 'name image')
        .populate('likes', 'name image');

      const total = await Post.countDocuments(query);

      return NextResponse.json({
        posts,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit),
        }
      });
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
    const {
      title,
      content,
      images = [],
      category = PostCategory.GENERAL,
      visibility = PostVisibility.PUBLIC,
    } = await request.json();

    // Validate input
    if (!title || !content) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Find the user in the database
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Create the post
    const post = await Post.create({
      author: user._id,
      title,
      content,
      images,
      category,
      visibility,
    });

    // Populate the author field for the response
    await post.populate('author', 'name image');

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
export async function PUT(request: NextRequest) {
  try {
    // Get the current user from the session
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Connect to the database
    await dbConnect();

    // Get the request body
    const { id, title, content, images, category, visibility } = await request.json();

    // Validate input
    if (!id) {
      return NextResponse.json(
        { message: 'Post ID is required' },
        { status: 400 }
      );
    }

    // Find the user in the database
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Find the post
    const post = await Post.findById(id);
    if (!post) {
      return NextResponse.json(
        { message: 'Post not found' },
        { status: 404 }
      );
    }

    // Check if the user is the author of the post
    if (post.author.toString() !== user._id.toString()) {
      return NextResponse.json(
        { message: 'You do not have permission to update this post' },
        { status: 403 }
      );
    }

    // Create the update object
    const update: any = {};
    if (title) update.title = title;
    if (content) update.content = content;
    if (images) update.images = images;
    if (category) update.category = category;
    if (visibility) update.visibility = visibility;

    // Update the post
    const updatedPost = await Post.findByIdAndUpdate(
      id,
      update,
      { new: true }
    ).populate('author', 'name image');

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
    const id = url.searchParams.get('id');

    // Validate input
    if (!id) {
      return NextResponse.json(
        { message: 'Post ID is required' },
        { status: 400 }
      );
    }

    // Find the user in the database
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Find the post
    const post = await Post.findById(id);
    if (!post) {
      return NextResponse.json(
        { message: 'Post not found' },
        { status: 404 }
      );
    }

    // Check if the user is the author of the post
    if (post.author.toString() !== user._id.toString()) {
      return NextResponse.json(
        { message: 'You do not have permission to delete this post' },
        { status: 403 }
      );
    }

    // Delete the post
    await Post.findByIdAndDelete(id);

    return NextResponse.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/posts/like - Like or unlike a post
export async function PATCH(request: NextRequest) {
  try {
    // Get the current user from the session
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Connect to the database
    await dbConnect();

    // Get the request body
    const { id, action } = await request.json();

    // Validate input
    if (!id) {
      return NextResponse.json(
        { message: 'Post ID is required' },
        { status: 400 }
      );
    }

    if (!['like', 'unlike'].includes(action)) {
      return NextResponse.json(
        { message: 'Invalid action. Must be "like" or "unlike"' },
        { status: 400 }
      );
    }

    // Find the user in the database
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Find the post
    const post = await Post.findById(id);
    if (!post) {
      return NextResponse.json(
        { message: 'Post not found' },
        { status: 404 }
      );
    }

    // Like or unlike the post
    if (action === 'like') {
      // Check if the user already liked the post
      if (!post.likes.includes(user._id)) {
        post.likes.push(user._id);
        await post.save();

        // Create a notification for the post author if it's not the current user
        if (post.author.toString() !== user._id.toString()) {
          await Notification.create({
            recipient: post.author,
            sender: user._id,
            type: 'post_like',
            content: `${user.name} liked your post`,
            link: `/posts/${post._id}`,
            relatedId: post._id,
          });
        }
      }
    } else {
      // Unlike the post
      post.likes = post.likes.filter(
        (userId) => userId.toString() !== user._id.toString()
      );
      await post.save();
    }

    // Populate the post with user data
    await post.populate('author', 'name image');
    await post.populate('likes', 'name image');

    return NextResponse.json({ message: `Post ${action}d successfully`, data: post });
  } catch (error) {
    console.error(`Error ${action}ing post:`, error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
