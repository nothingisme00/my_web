'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Clock, Eye } from 'lucide-react';
import { formatViewCount } from '@/lib/utils';
import type { Prisma } from '@prisma/client';
import { StaggerContainer, StaggerItem, ScaleOnHover } from '@/components/animations';

type PostWithRelations = Prisma.PostGetPayload<{
  include: {
    category: true;
    tags: true;
  }
}>;

interface RelatedArticlesProps {
  posts: PostWithRelations[];
}

export function RelatedArticles({ posts }: RelatedArticlesProps) {
  return (
    <div className="mt-16 pt-12 border-t border-gray-200/60 dark:border-gray-700/60">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
        Continue Reading
      </h2>

      {posts && posts.length > 0 ? (
        <StaggerContainer className="grid md:grid-cols-3 gap-6" staggerDelay={0.15}>
          {posts.map((post) => (
            <StaggerItem key={post.id}>
              <Link href={`/blog/${post.slug}`} className="group block h-full">
                <ScaleOnHover scale={1.02}>
                  <article className="flex flex-col h-full bg-white/60 dark:bg-gray-900/40 backdrop-blur-sm border border-gray-200/60 dark:border-gray-700/60 rounded-xl overflow-hidden hover:border-gray-300 dark:hover:border-gray-600 transition-all">
                    {/* Image */}
                    {post.image && (
                      <div className="relative aspect-[16/10] overflow-hidden bg-gray-100 dark:bg-gray-800">
                        <Image
                          src={post.image}
                          alt={post.title}
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 400px"
                        />
                      </div>
                    )}

                    {/* Content */}
                    <div className="p-5 flex flex-col flex-grow">
                      {/* Category Badge */}
                      {post.category && (
                        <span className="inline-flex items-center w-fit rounded-md bg-gray-100/80 dark:bg-gray-800/80 px-2.5 py-1 text-xs font-medium text-gray-700 dark:text-gray-300 mb-3">
                          {post.category.name}
                        </span>
                      )}

                      {/* Title */}
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-2 leading-tight line-clamp-2">
                        {post.title}
                      </h3>

                      {/* Excerpt */}
                      {post.excerpt && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 flex-grow mb-4">
                          {post.excerpt}
                        </p>
                      )}

                      {/* Meta Info */}
                      <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mt-auto pt-3 border-t border-gray-200/50 dark:border-gray-700/50">
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
                    </div>
                  </article>
                </ScaleOnHover>
              </Link>
            </StaggerItem>
          ))}
        </StaggerContainer>
      ) : (
        <p className="text-center text-gray-500 dark:text-gray-400 py-8">
          No related articles found. <Link href="/blog" className="text-blue-600 dark:text-blue-400 hover:underline">Browse all articles</Link>
        </p>
      )}
    </div>
  );
}
