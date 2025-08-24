import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { CreatePostInput, Post } from '@/types/post';

export async function GET() {
  try {
    const db = await getDatabase();
    const posts = await db
      .collection<Post>('posts')
      .find({})
      .sort({ createdAt: -1 })
      .toArray();
    
    // Convert ObjectId to string for JSON serialization
    const serializedPosts = posts.map(post => ({
      ...post,
      _id: post._id?.toString()
    }));
    
    return NextResponse.json(serializedPosts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: CreatePostInput = await request.json();
    
    if (!body.title || !body.content || !body.author) {
      return NextResponse.json(
        { error: 'Title, content, and author are required' },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const newPost: Post = {
      ...body,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection<Post>('posts').insertOne(newPost);
    
    return NextResponse.json(
      { ...newPost, _id: result.insertedId.toString() },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    );
  }
}