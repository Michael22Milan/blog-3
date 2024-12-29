import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import type { Post } from '@/types/post';

const postsDirectory = path.join(process.cwd(), 'content/posts');

// 禁用响应缓存
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    // 检查目录是否存在
    if (!fs.existsSync(postsDirectory)) {
      console.error('Posts directory not found:', postsDirectory);
      return NextResponse.json({ error: 'Posts directory not found' }, { status: 404 });
    }

    const fileNames = fs.readdirSync(postsDirectory);
    
    // 检查是否有文件
    if (fileNames.length === 0) {
      console.warn('No posts found in directory');
      return NextResponse.json([]);
    }

    const allPostsData = fileNames
      .filter(fileName => fileName.endsWith('.md'))
      .map((fileName) => {
        const id = fileName.replace(/\.md$/, '');
        const fullPath = path.join(postsDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const matterResult = matter(fileContents);

        return {
          id,
          slug: id,
          content: matterResult.content,
          ...(matterResult.data as { title: string; date: string; excerpt: string; coverImage: string })
        };
      });

    // 按日期排序
    const sortedPosts = allPostsData.sort((a, b) => {
      if (a.date < b.date) {
        return 1;
      } else {
        return -1;
      }
    });

    // 设置响应头以禁用缓存
    const response = NextResponse.json(sortedPosts);
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');

    return response;
  } catch (err) {
    console.error('Error in GET /api/posts:', err);
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { title, content, excerpt, coverImage } = data;
    
    const slug = title
      .toLowerCase()
      .replace(/[^a-zA-Z0-9\s]/g, '')
      .replace(/\s+/g, '-');
    
    const id = `${Date.now()}-${slug}`;
    const fileName = `${id}.md`;
    const fullPath = path.join(postsDirectory, fileName);

    const fileContent = `---
title: ${title}
date: ${new Date().toISOString().split('T')[0]}
excerpt: ${excerpt}
coverImage: ${coverImage}
---

${content}`;

    fs.writeFileSync(fullPath, fileContent);

    // 设置响应头以禁用缓存
    const response = NextResponse.json({ id, slug });
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');

    return response;
  } catch (err) {
    console.error('Error in POST /api/posts:', err);
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
} 