"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Calendar,
  Clock,
  Eye,
  ChevronsRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { formatDate, formatViewCount } from "@/lib/utils";
import type { Prisma } from "@prisma/client";
import { FadeIn } from "@/components/animations";

type PostWithRelations = Prisma.PostGetPayload<{
  include: {
    category: true;
  };
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
        onMouseLeave={() => setIsPaused(false)}>
        <div className="max-w-6xl mx-auto relative group">
          {/* Featured Label - Modern with gradient accent */}
          <div className="mb-4 flex items-center gap-3">
            <div className="h-1 w-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"></div>
            <h2 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-widest">
              Featured
            </h2>
          </div>

          {/* Carousel Container - Modern glassmorphism */}
          <div className="relative overflow-hidden rounded-3xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 shadow-2xl shadow-gray-200/50 dark:shadow-black/30">
            {/* Posts */}
            {posts.map((post, index) => (
              <div
                key={post.id}
                className={`transition-all duration-700 ease-out ${
                  index === currentIndex
                    ? "opacity-100 scale-100 relative"
                    : "opacity-0 scale-95 pointer-events-none absolute inset-0"
                }`}>
                <div className="grid md:grid-cols-2 gap-0 min-h-[350px] md:min-h-[320px] lg:min-h-[360px] xl:min-h-[420px]">
                  {/* Image Side - Enhanced with overlay effects */}
                  <div className="relative h-56 md:h-full overflow-hidden">
                    {post.image ? (
                      <>
                        <Image
                          src={post.image}
                          alt={post.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                          unoptimized
                          priority={index === 0}
                        />
                        {/* Modern gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent md:bg-gradient-to-r md:from-transparent md:via-black/10 md:to-black/30" />

                        {/* Decorative elements */}
                        <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-white/10 to-transparent md:hidden" />
                      </>
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600" />
                    )}

                    {/* Category badge - Modern floating style */}
                    {post.category && (
                      <div className="absolute top-5 left-5">
                        <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-md text-sm font-semibold text-gray-900 dark:text-white shadow-lg border border-white/20 dark:border-gray-700/50">
                          <span className="w-2 h-2 rounded-full bg-blue-500 mr-2 animate-pulse"></span>
                          {post.category.name}
                        </span>
                      </div>
                    )}

                    {/* Reading time badge on image (mobile) */}
                    <div className="absolute bottom-5 left-5 md:hidden">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-sm text-white text-sm font-medium">
                        <Clock className="w-3.5 h-3.5" />
                        {post.readingTime} min
                      </span>
                    </div>
                  </div>

                  {/* Content Side - Modern typography and spacing */}
                  <div className="p-6 md:p-8 lg:p-10 xl:p-12 flex flex-col justify-center relative">
                    {/* Decorative gradient blob */}
                    <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl pointer-events-none" />

                    {/* Title with modern styling */}
                    <h2 className="text-xl sm:text-2xl md:text-2xl lg:text-3xl xl:text-4xl font-extrabold text-gray-900 dark:text-white mb-3 lg:mb-4 leading-tight tracking-tight line-clamp-3">
                      {post.title}
                    </h2>

                    {/* Excerpt with better typography */}
                    <p className="text-sm md:text-base lg:text-lg text-gray-600 dark:text-gray-400 mb-4 lg:mb-6 line-clamp-2 lg:line-clamp-3 leading-relaxed">
                      {post.excerpt || post.content.substring(0, 150) + "..."}
                    </p>

                    {/* Meta Info - Modern pill style */}
                    <div className="flex flex-wrap items-center gap-2 lg:gap-3 mb-5 lg:mb-8">
                      <div className="inline-flex items-center gap-1.5 px-2.5 lg:px-3 py-1 lg:py-1.5 rounded-full bg-gray-100 dark:bg-gray-800 text-xs lg:text-sm text-gray-600 dark:text-gray-400">
                        <Calendar className="w-3 lg:w-3.5 h-3 lg:h-3.5" />
                        <span>
                          {formatDate(post.publishedAt || post.createdAt)}
                        </span>
                      </div>

                      <div className="hidden md:inline-flex items-center gap-1.5 px-2.5 lg:px-3 py-1 lg:py-1.5 rounded-full bg-gray-100 dark:bg-gray-800 text-xs lg:text-sm text-gray-600 dark:text-gray-400">
                        <Clock className="w-3 lg:w-3.5 h-3 lg:h-3.5" />
                        <span>{post.readingTime} min read</span>
                      </div>

                      {post.views > 0 && (
                        <div className="inline-flex items-center gap-1.5 px-2.5 lg:px-3 py-1 lg:py-1.5 rounded-full bg-gray-100 dark:bg-gray-800 text-xs lg:text-sm text-gray-600 dark:text-gray-400">
                          <Eye className="w-3 lg:w-3.5 h-3 lg:h-3.5" />
                          <span>{formatViewCount(post.views)}</span>
                        </div>
                      )}
                    </div>

                    {/* Creative CTA Button */}
                    <Link
                      href={`/blog/${post.slug}`}
                      className="inline-flex w-fit items-center gap-2 px-4 lg:px-6 py-2.5 lg:py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full text-sm lg:text-base font-semibold border-2 border-gray-900 dark:border-white hover:bg-white dark:hover:bg-gray-900 hover:text-gray-900 dark:hover:text-white transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95">
                      Read Article
                      <ChevronsRight className="w-4 lg:w-5 h-4 lg:h-5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Arrows - Modern glassmorphism style */}
          {posts.length > 1 && (
            <>
              {/* Previous Button */}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  handlePrev();
                }}
                className="absolute -left-3 md:-left-14 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border border-gray-200/50 dark:border-gray-700/50 shadow-xl opacity-0 group-hover:opacity-100 hover:bg-gray-900 dark:hover:bg-white hover:border-gray-900 dark:hover:border-white transition-all duration-300 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-white dark:hover:text-gray-900 hover:scale-110 active:scale-95"
                aria-label="Previous slide">
                <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
              </button>

              {/* Next Button */}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  handleNext();
                }}
                className="absolute -right-3 md:-right-14 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border border-gray-200/50 dark:border-gray-700/50 shadow-xl opacity-0 group-hover:opacity-100 hover:bg-gray-900 dark:hover:bg-white hover:border-gray-900 dark:hover:border-white transition-all duration-300 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-white dark:hover:text-gray-900 hover:scale-110 active:scale-95"
                aria-label="Next slide">
                <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
              </button>
            </>
          )}

          {/* Dots Indicator - Modern pill style */}
          {posts.length > 1 && (
            <div className="flex justify-center gap-2.5 mt-8">
              {posts.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`h-2.5 rounded-full transition-all duration-500 ${
                    index === currentIndex
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 w-10 shadow-md shadow-blue-500/30"
                      : "bg-gray-300 dark:bg-gray-700 w-2.5 hover:bg-gray-400 dark:hover:bg-gray-600 hover:scale-110"
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
