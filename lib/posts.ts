import { Post } from '@/types/post';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const postsDirectory = path.join(process.cwd(), 'content/posts');

// 获取完整的API URL
function getBaseUrl() {
  if (typeof window !== 'undefined') {
    return ''; // 在客户端使用相对路径
  }
  // 在服务器端使用完整URL
  return process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
}

export async function getAllPosts(): Promise<Post[]> {
  try {
    const baseUrl = getBaseUrl();
    const response = await fetch(`${baseUrl}/api/posts`, {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch posts: ${response.statusText}`);
    }
    
    return response.json();
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw error;
  }
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    const baseUrl = getBaseUrl();
    const response = await fetch(`${baseUrl}/api/posts/${slug}`, {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    });

    if (!response.ok) {
      console.error(`Failed to fetch post ${slug}:`, response.statusText);
      return null;
    }

    return response.json();
  } catch (error) {
    console.error(`Error fetching post ${slug}:`, error);
    return null;
  }
}

export async function createPost(post: Omit<Post, 'id' | 'slug'>): Promise<{ id: string; slug: string }> {
  const baseUrl = getBaseUrl();
  const response = await fetch(`${baseUrl}/api/posts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache'
    },
    body: JSON.stringify(post),
  });

  if (!response.ok) {
    throw new Error('Failed to create post');
  }

  return response.json();
}

export async function updatePost(id: string, post: Partial<Post>): Promise<Post | null> {
  try {
    const fullPath = path.join(postsDirectory, `${id}.md`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    const updatedData = {
      ...data,
      ...post,
    };

    const updatedContent = `---
title: ${updatedData.title}
date: ${updatedData.date}
excerpt: ${updatedData.excerpt}
coverImage: ${updatedData.coverImage}
---

${post.content || content}`;

    fs.writeFileSync(fullPath, updatedContent);

    return {
      id,
      slug: id,
      content: post.content || content,
      ...(updatedData as { title: string; date: string; excerpt: string; coverImage: string })
    };
  } catch (error) {
    console.error(`Error updating post ${id}:`, error);
    return null;
  }
}

export async function deletePost(id: string): Promise<boolean> {
  try {
    const fullPath = path.join(postsDirectory, `${id}.md`);
    fs.unlinkSync(fullPath);
    return true;
  } catch (error) {
    console.error(`Error deleting post ${id}:`, error);
    return false;
  }
} 