import { getPostBySlug } from '@/lib/posts';
import Link from 'next/link';
import { marked } from 'marked';

// 禁用页面缓存
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function PostPage({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">文章未找到</h1>
        <Link href="/" className="text-blue-600 hover:text-blue-800">
          返回首页
        </Link>
      </div>
    );
  }

  const htmlContent = marked(post.content);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <Link 
        href="/" 
        className="text-gray-600 hover:text-gray-900 mb-8 inline-block"
      >
        ← 返回首页
      </Link>
      
      <article className="bg-white rounded-lg shadow-md p-8 md:p-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
          <div className="text-gray-600 mb-8">
            {new Date(post.date).toLocaleDateString('zh-CN', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </div>
          <div 
            className="article-content"
            dangerouslySetInnerHTML={{ __html: htmlContent }} 
          />
        </div>
      </article>
    </div>
  );
} 