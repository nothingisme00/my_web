'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Clock, Eye, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { formatDate, formatViewCount } from '@/lib/utils';
import type { Prisma } from '@prisma/client';
import { FadeIn } from '@/components/animations';

type PostWithRelations = Prisma.PostGetPayload<{
  include: {
    category: true;
    tags: true;
  }
}>;

interface FeaturedPostsCarouselProps {
  posts: PostWithRelations[];
}

export function FeaturedPostsCarousel({ posts }: FeaturedPostsCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Navigation handlers
  const handleNext = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev + 1) % posts.length);
    setTimeout(() => setIsAnimating(false), 700);
  };

  const handlePrev = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev - 1 + posts.length) % posts.length);
    setTimeout(() => setIsAnimating(false), 700);
  };

  const goToSlide = (index: number) => {
    if (isAnimating || index === currentIndex) return;
    setIsAnimating(true);
    setCurrentIndex(index);
    setTimeout(() => setIsAnimating(false), 700);
  };

  // Auto-rotate logic (3 seconds)
  useEffect(() => {
    if (isPaused || isAnimating || posts.length <= 1) return;

    const interval = setInterval(() => {
      handleNext();
    }, 3000);

    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, isPaused, isAnimating, posts.length]);

  if (!posts || posts.length === 0) return null;

  return (
    <FadeIn duration={0.6}>
      <section
        className="py-8 px-4 md:px-8"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div className="max-w-6xl mx-auto relative group">
          {/* Featured Label - Minimalist */}
          <div className="mb-3 flex items-center gap-2">
            <div className="h-0.5 w-8 bg-blue-600 dark:bg-blue-500"></div>
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">
              Featured
            </h2>
          </div>

          {/* Carousel Container */}
          <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg">
            {/* Posts */}
            {posts.map((post, index) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className={`block transition-all duration-700 ease-in-out ${
                  index === currentIndex
                    ? 'opacity-100 scale-100 relative'
                    : 'opacity-0 scale-95 pointer-events-none absolute inset-0'
                }`}
              >
                <div className="grid md:grid-cols-2 gap-0">
                  {/* Image Side */}
                  <div className="relative h-64 md:h-full overflow-hidden bg-gray-100 dark:bg-gray-900">
                    {post.image ? (
                      <>
                        <Image
                          src={post.image}
                          alt={post.title}
                          fill
                          className="object-cover"
                          unoptimized
                          priority={index === 0}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent md:bg-gradient-to-r" />
                      </>
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-700" />
                    )}

                    {/* Category badge */}
                    {post.category && (
                      <div className="absolute top-4 left-4">
                        <span className="inline-block px-3 py-1 rounded-full bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm text-sm font-medium text-blue-600 dark:text-blue-400 shadow-md">
                          {post.category.name}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Content Side */}
                  <div className="p-8 md:p-10 flex flex-col justify-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 line-clamp-3">
                      {post.title}
                    </h2>

                    <p className="text-lg text-gray-600 dark:text-gray-400 mb-6 line-clamp-3">
                      {post.excerpt || post.content.substring(0, 150) + '...'}
                    </p>

                    {/* Meta Info */}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-500 mb-6">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(post.publishedAt || post.createdAt)}</span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4" />
                        <span>{post.readingTime} min read</span>
                      </div>

                      {post.views > 0 && (
                        <div className="flex items-center gap-1.5">
                          <Eye className="w-4 h-4" />
                          <span>{formatViewCount(post.views)} views</span>
                        </div>
                      )}
                    </div>

                    {/* CTA */}
                    <div className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold">
                      <span>Read Article</span>
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Navigation Arrows - Subtle & Outside Card */}
          {posts.length > 1 && (
            <>
              {/* Previous Button */}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  handlePrev();
                }}
                className="absolute -left-4 md:-left-12 top-1/2 -translate-y-1/2 z-10 w-9 h-9 md:w-10 md:h-10 rounded-full bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 shadow-md opacity-0 group-hover:opacity-100 hover:bg-white/90 dark:hover:bg-gray-800/90 hover:shadow-lg transition-all duration-300 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {/* Next Button */}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  handleNext();
                }}
                className="absolute -right-4 md:-right-12 top-1/2 -translate-y-1/2 z-10 w-9 h-9 md:w-10 md:h-10 rounded-full bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 shadow-md opacity-0 group-hover:opacity-100 hover:bg-white/90 dark:hover:bg-gray-800/90 hover:shadow-lg transition-all duration-300 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                aria-label="Next slide"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          {/* Dots Indicator */}
          {posts.length > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              {posts.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`h-2 rounded-full transition-all duration-500 ${
                    index === currentIndex
                      ? 'bg-blue-600 dark:bg-blue-500 w-8'
                      : 'bg-gray-300 dark:bg-gray-600 w-2 hover:bg-gray-400 dark:hover:bg-gray-500'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </FadeIn>
  );
}
