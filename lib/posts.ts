import { Post } from '@/types/post';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const postsDirectory = path.join(process.cwd(), 'content/posts');

export async function getAllPosts(): Promise<Post[]> {
  try {
    // 确保目录存在
    if (!fs.existsSync(postsDirectory)) {
      fs.mkdirSync(postsDirectory, { recursive: true });
      return [];
    }

    const fileNames = fs.readdirSync(postsDirectory);
    const posts = fileNames
      .filter(fileName => fileName.endsWith('.md'))
      .map(fileName => {
        const fullPath = path.join(postsDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const { data, content } = matter(fileContents);
        const slug = fileName.replace(/\.md$/, '');
        
        return {
          id: slug,
          slug,
          title: data.title,
          date: data.date,
          content: content,
          excerpt: data.excerpt || '',
          coverImage: data.coverImage || ''
        };
      })
      .sort((a, b) => (a.date > b.date ? -1 : 1));

    return posts;
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    const fullPath = path.join(postsDirectory, `${slug}.md`);
    if (!fs.existsSync(fullPath)) {
      return null;
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    return {
      id: slug,
      slug,
      title: data.title,
      date: data.date,
      content: content,
      excerpt: data.excerpt || '',
      coverImage: data.coverImage || ''
    };
  } catch (error) {
    console.error(`Error fetching post ${slug}:`, error);
    return null;
  }
}

export async function createPost(post: Omit<Post, 'id' | 'slug'>): Promise<{ id: string; slug: string }> {
  try {
    const date = new Date();
    const slug = date.toISOString().split('T')[0] + '-' + post.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const id = slug;

    const content = `---
title: ${post.title}
date: ${post.date || date.toISOString()}
excerpt: ${post.excerpt || ''}
coverImage: ${post.coverImage || ''}
---

${post.content}`;

    const fullPath = path.join(postsDirectory, `${slug}.md`);
    fs.writeFileSync(fullPath, content);

    return { id, slug };
  } catch (error) {
    console.error('Error creating post:', error);
    throw error;
  }
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