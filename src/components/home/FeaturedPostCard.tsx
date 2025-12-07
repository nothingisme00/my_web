'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Clock, Eye } from 'lucide-react';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { formatDate, formatViewCount } from '@/lib/utils';

interface FeaturedPostProps {
  post: {
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
  };
}

export function FeaturedPostCard({ post }: FeaturedPostProps) {
  return (
    <ScrollReveal>
      <Link href={`/blog/${post.slug}`} className="group">
        <article className="grid lg:grid-cols-2 gap-8 lg:gap-12 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md border border-gray-200/60 dark:border-gray-700/60 rounded-2xl p-8 lg:p-10 hover:border-blue-400 dark:hover:border-blue-600 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
          {/* Image */}
          {post.image && (
            <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800">
              <Image
                src={post.image}
                alt={post.title}
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-103"
                fill
                unoptimized
              />
            </div>
          )}

          {/* Content */}
          <div className="flex flex-col justify-center space-y-4">
            {post.category && (
              <span className="inline-flex items-center w-fit rounded-full bg-blue-50 dark:bg-blue-900/30 px-3 py-1 text-xs font-medium text-blue-700 dark:text-blue-400 ring-1 ring-inset ring-blue-700/10 dark:ring-blue-400/20">
                {post.category.name}
              </span>
            )}

            <h3 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-tight">
              {post.title}
            </h3>

            <p className="text-lg text-gray-600 dark:text-gray-300 line-clamp-3">
              {post.excerpt || ""}
            </p>

            <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 pt-2">
              <time dateTime={post.publishedAt?.toISOString() || post.createdAt.toISOString()}>
                {formatDate(post.publishedAt || post.createdAt, 'id-ID')}
              </time>
              <span>·</span>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{post.readingTime} min read</span>
              </div>
              {post.views > 0 && (
                <>
                  <span>·</span>
                  <div className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    <span>{formatViewCount(post.views)} views</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </article>
      </Link>
    </ScrollReveal>
  );
}
