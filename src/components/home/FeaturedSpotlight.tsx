import Link from "next/link";
import Image from "next/image";
import { Calendar, Clock, Eye, ArrowRight } from "lucide-react";
import { formatDate, formatViewCount } from "@/lib/utils";
import type { Prisma } from "@prisma/client";

type PostWithRelations = Prisma.PostGetPayload<{
  include: {
    category: true;
  };
}>;

interface FeaturedSpotlightProps {
  post: PostWithRelations;
}

export function FeaturedSpotlight({ post }: FeaturedSpotlightProps) {
  if (!post) return null;

  return (
    <section className="py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Featured badge */}
        <div className="flex items-center gap-2 mb-4">
          <div className="h-1 w-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full" />
          <span className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">
            Featured Article
          </span>
        </div>

        <Link href={`/blog/${post.slug}`} className="group block">
          <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-2xl transition-all duration-300">
            <div className="grid md:grid-cols-2 gap-0">
              {/* Image Side */}
              <div className="relative h-64 md:h-full overflow-hidden bg-gray-100 dark:bg-gray-900">
                {post.image ? (
                  <>
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      unoptimized
                    />
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent md:bg-gradient-to-r" />
                  </>
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-700" />
                )}

                {/* Category badge on image */}
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
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 line-clamp-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {post.title}
                </h2>

                <p className="text-lg text-gray-600 dark:text-gray-400 mb-6 line-clamp-3">
                  {post.excerpt || post.content.substring(0, 150) + "..."}
                </p>

                {/* Meta Info */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-500 mb-6">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {formatDate(post.publishedAt || post.createdAt)}
                    </span>
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

                {/* CTA Button */}
                <div className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold group-hover:gap-3 transition-all">
                  <span>Read Article</span>
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
}
