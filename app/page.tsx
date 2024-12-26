import Link from 'next/link';
import Image from 'next/image';
import { getAllPosts } from '@/lib/posts';

export default async function Home() {
  // 获取所有博客文章并等待结果
  const blogPosts = await getAllPosts();

  return (
    <div className="relative">
      {/* 顶部导航 */}
      <nav className="flex justify-between items-center mb-8 px-4">
        <h1 className="text-2xl font-bold">
          Skywalker79
        </h1>
        <div className="space-x-6">
          <Link href="/posts" className="header-link">
            42
          </Link>
          <Link href="/contact" className="header-link">
            contact
          </Link>
        </div>
      </nav>

      {/* 分割线和标语 */}
      <div className="divider" />
      <div className="slogan-container">
        <p className="slogan-primary">Don't Panic</p>
        <p className="slogan-secondary">May the force be with you</p>
      </div>
      <div className="divider" />

      {/* 博客文章网格 */}
      <div className="gallery-grid">
        {blogPosts.map((post) => (
          <Link href={`/posts/${post.slug}`} key={post.id} className="block">
            <article className="blog-card group">
              <div className="blog-card-image">
                <Image
                  src={post.coverImage}
                  alt={post.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
                  className="object-cover transform group-hover:scale-110 transition-transform duration-500"
                  priority={post.id === blogPosts[0]?.id}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
              <div className="blog-card-content">
                <h2 className="blog-card-title">{post.title}</h2>
                <p className="blog-card-excerpt">{post.excerpt}</p>
                <div className="blog-card-link">
                  阅读更多 →
                </div>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </div>
  );
}
