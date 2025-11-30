'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Clock, Eye } from 'lucide-react';
import { StaggerContainer, StaggerItem } from '@/components/ui/StaggerContainer';
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

interface RecentPostsGridProps {
  posts: Post[];
}

export function RecentPostsGrid({ posts }: RecentPostsGridProps) {
  return (
    <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-8" staggerDelay={0.1}>
      {posts.map((post) => (
        <StaggerItem key={post.id}>
          <Link href={`/blog/${post.slug}`} className="group block h-full">
            <article className="flex flex-col h-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-xl p-4 border border-gray-200/60 dark:border-gray-700/60 hover:border-blue-400 dark:hover:border-blue-600 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              {/* Image */}
              {post.image && (
                <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800 mb-4">
                  <Image
                    src={post.image}
                    alt={post.title}
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-103"
                    fill
                    unoptimized
                  />
                </div>
              )}

              {/* Category */}
              {post.category && (
                <span className="inline-flex items-center w-fit rounded-md bg-blue-50 dark:bg-blue-900/30 px-2 py-1 text-xs font-medium text-blue-700 dark:text-blue-400 mb-3 ring-1 ring-inset ring-blue-700/10 dark:ring-blue-400/20">
                  {post.category.name}
                </span>
              )}

              {/* Title */}
              <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-2 leading-tight">
                {post.title}
              </h3>

              {/* Excerpt */}
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-4 flex-grow">
                {post.excerpt || ""}
              </p>

              {/* Meta */}
              <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                <time dateTime={post.publishedAt?.toISOString() || post.createdAt.toISOString()}>
                  {formatDate(post.publishedAt || post.createdAt, 'id-ID')}
                </time>
                <span>·</span>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{post.readingTime} min</span>
                </div>
                {post.views > 0 && (
                  <>
                    <span>·</span>
                    <div className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      <span>{formatViewCount(post.views)}</span>
                    </div>
                  </>
                )}
              </div>
            </article>
          </Link>
        </StaggerItem>
      ))}
    </StaggerContainer>
  );
}
