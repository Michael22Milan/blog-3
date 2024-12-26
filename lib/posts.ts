import { Post } from '@/types/post';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

export async function getAllPosts(): Promise<Post[]> {
  const response = await fetch(`${BASE_URL}/api/posts`, {
    next: { revalidate: 10 }
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch posts');
  }
  return response.json();
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const posts = await getAllPosts();
  return posts.find(post => post.slug === slug) || null;
}

export async function createPost(post: Omit<Post, 'id' | 'slug'>): Promise<{ id: string; slug: string }> {
  const response = await fetch(`${BASE_URL}/api/posts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(post),
  });

  if (!response.ok) {
    throw new Error('Failed to create post');
  }

  return response.json();
}

export function updatePost(id: string, post: Partial<Post>): Post | null {
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
  } catch {
    return null;
  }
}

export function deletePost(id: string): boolean {
  try {
    const fullPath = path.join(postsDirectory, `${id}.md`);
    fs.unlinkSync(fullPath);
    return true;
  } catch {
    return false;
  }
} 