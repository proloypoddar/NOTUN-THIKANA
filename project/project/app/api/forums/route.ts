import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import dbConnect from '@/lib/db/connect';
import { Post } from '@/lib/db/models/Post';
import { User } from '@/lib/db/models/User';

// Get all forum posts with optional filtering
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const sortBy = searchParams.get('sortBy') || 'latest';

    await dbConnect();

    // Build query
    let query: any = {};

    // Filter by category if provided
    if (category && category !== 'all') {
      query.category = category;
    }

    // Search by title, content, or tags if provided
    if (search) {
      const searchLower = search.toLowerCase();
      query.$or = [
        { title: { $regex: searchLower, $options: 'i' } },
        { content: { $regex: searchLower, $options: 'i' } },
        { tags: { $in: [searchLower] } }
      ];
    }

    // Determine sort order
    let sort: any = {};
    if (sortBy === 'latest') {
      sort = { createdAt: -1 };
    } else if (sortBy === 'popular') {
      sort = { 'likes.length': -1 };
    } else if (sortBy === 'most_replies') {
      sort = { 'comments.length': -1 };
    }

    // Execute query
    const posts = await Post.find(query)
      .sort(sort)
      .populate({
        path: 'author',
        select: 'name image',
      })
      .lean();

    // Format posts for client
    const formattedPosts = posts.map(post => ({
      id: post._id.toString(),
      title: post.title,
      content: post.content,
      author: post.isAnonymous ? 'Anonymous' : post.author?.name || 'Unknown',
      authorImage: post.isAnonymous ? null : post.author?.image || null,
      date: post.createdAt.toISOString().split('T')[0],
      category: post.category,
      replies: post.comments?.length || 0,
      views: post.views || 0,
      likes: post.likes?.length || 0,
      isAnonymous: post.isAnonymous || false,
      tags: post.tags || [],
      isBoosted: post.isBoosted || false,
    }));

    return NextResponse.json(formattedPosts);
  } catch (error) {
    console.error('Error fetching forum posts:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Create a new forum post
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { title, content, category, tags, isAnonymous } = await request.json();

    // Validate required fields
    if (!title || !content || !category) {
      return NextResponse.json(
        { message: 'Missing required fields' },
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

    // Create the post
    const post = await Post.create({
      title,
      content,
      author: user._id,
      category,
      tags: tags || [],
      isAnonymous: isAnonymous || false,
      views: 0,
      likes: [],
      comments: [],
    });

    return NextResponse.json({
      id: post._id.toString(),
      title: post.title,
      content: post.content,
      author: isAnonymous ? 'Anonymous' : user.name,
      date: post.createdAt.toISOString().split('T')[0],
      category: post.category,
      tags: post.tags,
      isAnonymous: post.isAnonymous,
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating forum post:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
