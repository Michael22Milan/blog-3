import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { Post } from '@/types/post';

const postsDirectory = path.join(process.cwd(), 'content/posts');

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const fullPath = path.join(postsDirectory, `${params.slug}.md`);
    
    // 检查文件是否存在
    if (!fs.existsSync(fullPath)) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    // 读取文件内容
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const matterResult = matter(fileContents);

    const post: Post = {
      id: params.slug,
      slug: params.slug,
      content: matterResult.content,
      ...(matterResult.data as { title: string; date: string; excerpt: string; coverImage: string })
    };

    // 设置响应头以禁用缓存
    const response = NextResponse.json(post);
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');

    return response;
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch post' }, { status: 500 });
  }
} 