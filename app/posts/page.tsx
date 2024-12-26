import Link from 'next/link';
import { getAllPosts } from '@/lib/posts';
import Image from 'next/image';

export default async function Posts() {
  // 获取所有博客文章
  const posts = await getAllPosts();

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <Link 
          href="/" 
          className="text-lg hover:text-gray-600 flex items-center"
        >
          <span className="mr-2">←</span>
          <span>返回首页</span>
        </Link>
        <h1 className="text-3xl font-bold">所有文章</h1>
      </div>
      
      <div className="space-y-12">
        {posts.map((post) => (
          <article key={post.id} className="flex flex-col md:flex-row bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative w-full md:w-64 h-48">
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1 p-6">
              <div className="mb-2 text-gray-500 text-sm">
                {new Date(post.date).toLocaleDateString('zh-CN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
              <h2 className="text-2xl font-semibold mb-3 hover:text-blue-600 transition-colors">
                {post.title}
              </h2>
              <p className="text-gray-600 mb-4 line-clamp-2">
                {post.excerpt}
              </p>
              <Link 
                href={`/posts/${post.slug}`}
                className="text-blue-600 hover:text-blue-800 inline-flex items-center"
              >
                阅读全文
                <span className="ml-1">→</span>
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
} 