"use client";

import Link from "next/link";
import Image from "next/image";
import { Clock, Eye, ChevronsRight } from "lucide-react";
import { formatViewCount } from "@/lib/utils";
import type { Prisma } from "@prisma/client";
import { StaggerContainer, StaggerItem } from "@/components/animations";

type PostWithRelations = Prisma.PostGetPayload<{
  include: {
    category: true;
  };
}>;

interface RelatedArticlesProps {
  posts: PostWithRelations[];
}

export function RelatedArticles({ posts }: RelatedArticlesProps) {
  return (
    <div className="mt-16 pt-12 border-t border-gray-200/60 dark:border-gray-700/60">
      {/* Modern Section Header */}
      <div className="flex items-center gap-3 mb-10">
        <div className="h-1 w-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"></div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
          Continue Reading
        </h2>
      </div>

      {posts && posts.length > 0 ? (
        <StaggerContainer
          className="grid md:grid-cols-3 gap-6"
          staggerDelay={0.15}>
          {posts.map((post) => (
            <StaggerItem key={post.id}>
              <article className="group relative flex flex-col h-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-gray-200/50 dark:hover:shadow-black/30 transition-all duration-500 hover:-translate-y-1">
                {/* Image with overlay */}
                {post.image && (
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={post.image}
                      alt={post.title}
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 400px"
                    />
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    {/* Category badge */}
                    {post.category && (
                      <div className="absolute top-4 left-4 z-10">
                        <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-md text-xs font-semibold text-gray-900 dark:text-white shadow-lg border border-white/20 dark:border-gray-700/50">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-2"></span>
                          {post.category.name}
                        </span>
                      </div>
                    )}

                    {/* Quick read badge on hover */}
                    <div className="absolute bottom-4 left-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
                      <div className="flex items-center gap-3">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-sm text-white text-xs font-medium">
                          <Clock className="w-3 h-3" />
                          {post.readingTime} min
                        </span>
                        {post.views > 0 && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-sm text-white text-xs font-medium">
                            <Eye className="w-3 h-3" />
                            {formatViewCount(post.views)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Content */}
                <div className="p-6 flex flex-col flex-grow">
                  {/* Title */}
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 leading-snug line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                    {post.title}
                  </h3>

                  {/* Excerpt */}
                  {post.excerpt && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 flex-grow mb-5 leading-relaxed">
                      {post.excerpt}
                    </p>
                  )}

                  {/* Creative Read Button */}
                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex w-fit items-center gap-2 px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full text-sm font-semibold border-2 border-gray-900 dark:border-white hover:bg-white dark:hover:bg-gray-900 hover:text-gray-900 dark:hover:text-white transition-all duration-300 group/btn">
                    Read More
                    <ChevronsRight className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
                  </Link>
                </div>

                {/* Decorative gradient corner */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-blue-500/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              </article>
            </StaggerItem>
          ))}
        </StaggerContainer>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            No related articles found.
          </p>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full text-sm font-semibold border-2 border-gray-900 dark:border-white hover:bg-white dark:hover:bg-gray-900 hover:text-gray-900 dark:hover:text-white transition-all duration-300">
            Browse All Articles
            <ChevronsRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </div>
  );
}
