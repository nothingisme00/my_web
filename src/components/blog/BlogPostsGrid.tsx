'use client';

import Link from 'next/link';
import { Clock, Eye } from 'lucide-react';
import { StaggerContainer, StaggerItem, ScrollReveal } from '@/components/transitions/ScrollReveal';
import { formatDate, formatViewCount } from '@/lib/utils';

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  image: string | null;
  readingTime: number;
  views: number;
  publishedAt: Date | null;
  createdAt: Date;
  category: {
    name: string;
  } | null;
}

interface BlogPostsGridProps {
  featuredPost?: Post;
  posts: Post[];
}

export function BlogPostsGrid({ featuredPost, posts }: BlogPostsGridProps) {
  return (
    <>
      {/* Featured Post */}
      {featuredPost && (
        <ScrollReveal className="mb-16">
          <Link href={`/blog/${featuredPost.slug}`} className="group block">
            <article className="grid lg:grid-cols-2 gap-8 p-6 rounded-2xl bg-gray-50 dark:bg-gray-800/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ease-out">
              {/* Image */}
              {featuredPost.image && (
                <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800">
                  <img
                    src={featuredPost.image}
                    alt={featuredPost.title}
                    className="w-full h-full object-cover img-zoom"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-full bg-blue-600 text-white text-xs font-medium">
                      Featured
                    </span>
                  </div>
                </div>
              )}

              {/* Content */}
              <div className="flex flex-col justify-center">
                {featuredPost.category && (
                  <span className="inline-flex items-center w-fit rounded-md bg-blue-50 dark:bg-blue-900/30 px-2.5 py-0.5 text-xs font-medium text-blue-700 dark:text-blue-400 mb-4">
                    {featuredPost.category.name}
                  </span>
                )}

                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-4 leading-tight">
                  {featuredPost.title}
                </h2>

                {featuredPost.excerpt && (
                  <p className="text-gray-600 dark:text-gray-300 line-clamp-3 mb-6 text-lg">
                    {featuredPost.excerpt}
                  </p>
                )}

                <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                  <time dateTime={featuredPost.publishedAt?.toISOString() || featuredPost.createdAt.toISOString()}>
                    {formatDate(featuredPost.publishedAt || featuredPost.createdAt, 'id-ID')}
                  </time>
                  <span>·</span>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{featuredPost.readingTime} min</span>
                  </div>
                  {featuredPost.views > 0 && (
                    <>
                      <span>·</span>
                      <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        <span>{formatViewCount(featuredPost.views)}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </article>
          </Link>
        </ScrollReveal>
      )}

      {/* Other Posts Grid */}
      {posts.length > 0 && (
        <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-8" staggerDelay={0.08}>
          {posts.map((post) => (
            <StaggerItem key={post.id}>
              <Link href={`/blog/${post.slug}`} className="group block h-full">
                <article className="flex flex-col h-full rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden">
                  {/* Image */}
                  {post.image && (
                    <div className="relative aspect-[16/10] overflow-hidden bg-gray-100 dark:bg-gray-800">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover img-zoom"
                      />
                    </div>
                  )}

                  {/* Content */}
                  <div className="p-6 flex flex-col flex-grow">
                    {post.category && (
                      <span className="inline-flex items-center w-fit rounded-md bg-gray-100 dark:bg-gray-800 px-2 py-1 text-xs font-medium text-gray-700 dark:text-gray-300 mb-3">
                        {post.category.name}
                      </span>
                    )}

                    <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-2 leading-tight">
                      {post.title}
                    </h3>

                    {post.excerpt && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-4 flex-grow">
                        {post.excerpt}
                      </p>
                    )}

                    <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mt-auto">
                      <time dateTime={post.publishedAt?.toISOString() || post.createdAt.toISOString()}>
                        {formatDate(post.publishedAt || post.createdAt, 'id-ID')}
                      </time>
                      <span>·</span>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{post.readingTime} min</span>
                      </div>
                    </div>
                  </div>
                </article>
              </Link>
            </StaggerItem>
          ))}
        </StaggerContainer>
      )}
    </>
  );
}
