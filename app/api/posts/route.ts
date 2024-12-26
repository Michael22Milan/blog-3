import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { Post } from '@/types/post';

const postsDirectory = path.join(process.cwd(), 'content/posts');

export async function GET() {
  try {
    const fileNames = fs.readdirSync(postsDirectory);
    const allPostsData = fileNames.map((fileName) => {
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

    return NextResponse.json(sortedPosts);
  } catch (error) {
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

    return NextResponse.json({ id, slug });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
} 