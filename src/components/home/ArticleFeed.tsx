import Link from "next/link";
import Image from "next/image";
import { Calendar, Clock, Eye } from "lucide-react";
import { formatDate, formatViewCount } from "@/lib/utils";
import type { Prisma } from "@prisma/client";
import {
  StaggerContainer,
  StaggerItem,
  ScaleOnHover,
} from "@/components/animations";

type PostWithRelations = Prisma.PostGetPayload<{
  include: {
    category: true;
  };
}>;

interface ArticleFeedProps {
  posts: PostWithRelations[];
}

export function ArticleFeed({ posts }: ArticleFeedProps) {
  if (!posts || posts.length === 0) {
    return (
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-gray-600 dark:text-gray-400">No articles found.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
          Recent Articles
        </h2>

        <StaggerContainer className="space-y-6" staggerDelay={0.1}>
          {posts.map((post) => (
            <StaggerItem key={post.id}>
              <Link href={`/blog/${post.slug}`} className="group block">
                <ScaleOnHover scale={1.01}>
                  <article className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-200">
                    <div className="grid md:grid-cols-[200px_1fr] gap-6">
                      {/* Thumbnail */}
                      {post.image && (
                        <div className="relative h-32 md:h-full w-full md:w-[200px] rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-900">
                          <Image
                            src={post.image}
                            alt={post.title}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                            unoptimized
                          />
                        </div>
                      )}

                      {/* Content */}
                      <div className="flex flex-col justify-center">
                        {/* Category */}
                        {post.category && (
                          <span className="inline-block w-fit px-2.5 py-1 mb-3 rounded-md bg-blue-100 dark:bg-blue-900/30 text-xs font-medium text-blue-700 dark:text-blue-400">
                            {post.category.name}
                          </span>
                        )}

                        {/* Title */}
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {post.title}
                        </h3>

                        {/* Excerpt */}
                        <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2 text-sm leading-relaxed">
                          {post.excerpt ||
                            post.content.substring(0, 120) + "..."}
                        </p>

                        {/* Meta Info */}
                        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-500">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>
                              {formatDate(post.publishedAt || post.createdAt)}
                            </span>
                          </div>

                          <span>·</span>

                          <div className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{post.readingTime} min</span>
                          </div>

                          {post.views > 0 && (
                            <>
                              <span>·</span>
                              <div className="flex items-center gap-1">
                                <Eye className="w-3.5 h-3.5" />
                                <span>{formatViewCount(post.views)}</span>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </article>
                </ScaleOnHover>
              </Link>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Load More button (for future pagination) */}
        {posts.length >= 9 && (
          <div className="mt-12 text-center">
            <button className="px-6 py-3 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-medium transition-colors">
              Load More Articles
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
