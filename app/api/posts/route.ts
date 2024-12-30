import { NextResponse } from 'next/server';
import { getAllPosts, createPost } from '@/lib/posts';

export async function GET() {
  try {
    const posts = await getAllPosts();
    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error in GET /api/posts:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const post = await request.json();
    const result = await createPost(post);
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/posts:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 