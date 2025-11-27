'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Clock, Eye, ChevronRight } from 'lucide-react';
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
    id: string;
    name: string;
    slug: string;
  } | null;
}

interface HeroCarouselProps {
  posts: Post[];
}

export function HeroCarousel({ posts }: HeroCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (isHovered || posts.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % posts.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isHovered, posts.length]);

  if (posts.length === 0) return null;

  const currentPost = posts[currentIndex];

  return (
    <div
      className="relative h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Carousel Content */}
      <Link href={`/blog/${currentPost.slug}`} className="group block h-full">
        <div className="relative h-full rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800/50 overflow-hidden hover:border-blue-200 dark:hover:border-blue-900/50 hover:shadow-xl transition-all duration-300 ease-out hover-lift">
          {/* Image */}
          {currentPost.image && (
            <div className="relative h-48 overflow-hidden bg-gray-100 dark:bg-gray-800">
              <Image
                src={currentPost.image}
                alt={currentPost.title}
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-103"
                fill
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
          )}

          {/* Content */}
          <div className="p-6 space-y-3">
            {/* Category Badge */}
            {currentPost.category && (
              <span className="inline-flex items-center rounded-full bg-blue-50 dark:bg-blue-900/30 px-3 py-1 text-xs font-medium text-blue-700 dark:text-blue-400 ring-1 ring-inset ring-blue-700/10 dark:ring-blue-400/20">
                {currentPost.category.name}
              </span>
            )}

            {/* Title */}
            <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200 ease-out line-clamp-2 leading-tight">
              {currentPost.title}
            </h3>

            {/* Excerpt */}
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
              {currentPost.excerpt || ''}
            </p>

            {/* Meta */}
            <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 pt-2">
              <time dateTime={currentPost.publishedAt?.toISOString() || currentPost.createdAt.toISOString()}>
                {formatDate(currentPost.publishedAt || currentPost.createdAt, 'id-ID')}
              </time>
              <span>·</span>
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{currentPost.readingTime} min</span>
              </div>
              {currentPost.views > 0 && (
                <>
                  <span>·</span>
                  <div className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    <span>{formatViewCount(currentPost.views)}</span>
                  </div>
                </>
              )}
            </div>

            {/* Read More Link */}
            <div className="pt-2">
              <span className="inline-flex items-center text-sm font-medium text-blue-600 dark:text-blue-400 group-hover:gap-2 transition-all duration-200 ease-out">
                Read article
                <ChevronRight className="h-4 w-4 ml-1 transition-transform duration-200 ease-out group-hover:translate-x-1" />
              </span>
            </div>
          </div>
        </div>
      </Link>

      {/* Dots Indicator */}
      {posts.length > 1 && (
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2">
          {posts.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`transition-all duration-300 ease-out ${
                index === currentIndex
                  ? 'w-8 h-2 bg-blue-600 dark:bg-blue-400'
                  : 'w-2 h-2 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
              } rounded-full`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
