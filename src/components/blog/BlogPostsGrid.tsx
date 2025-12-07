"use client";

import Link from "next/link";
import Image from "next/image";
import { Clock, Eye } from "lucide-react";
import {
  StaggerContainer,
  StaggerItem,
} from "@/components/ui/StaggerContainer";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { StripeHoverWrapper } from "@/components/animations/StripeCard";
import { formatDate, formatViewCount } from "@/lib/utils";
import { useLocale } from "next-intl";

interface Post {
  id: string;
  title: string;
  titleEn?: string | null;
  slug: string;
  excerpt: string | null;
  excerptEn?: string | null;
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

// Helper to get localized content
function getLocalizedField(
  id: string | null | undefined,
  en: string | null | undefined,
  locale: string
): string | null {
  // Indonesian is primary, English is translation
  if (locale === "en") {
    return en || id || null;
  }
  return id || null;
}

export function BlogPostsGrid({ featuredPost, posts }: BlogPostsGridProps) {
  const locale = useLocale();

  return (
    <>
      {/* Featured Post */}
      {featuredPost && (
        <ScrollReveal className="mb-16">
          <StripeHoverWrapper>
            <Link href={`/blog/${featuredPost.slug}`} className="group block">
              <article className="grid lg:grid-cols-2 gap-8 p-6 rounded-2xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-md border border-gray-200/60 dark:border-gray-700/60 shadow-lg transition-shadow duration-300">
                {/* Image */}
                {featuredPost.image && (
                  <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800">
                    <Image
                      src={featuredPost.image}
                      alt={
                        getLocalizedField(
                          featuredPost.title,
                          featuredPost.titleEn,
                          locale
                        ) || featuredPost.title
                      }
                      className="object-cover img-zoom"
                      fill
                      unoptimized
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 rounded-full bg-blue-600 text-white text-xs font-medium shadow-md">
                        Featured
                      </span>
                    </div>
                  </div>
                )}

                {/* Content */}
                <div className="flex flex-col justify-center">
                  {featuredPost.category && (
                    <span className="inline-flex items-center w-fit rounded-md bg-blue-50 dark:bg-blue-900/30 px-2.5 py-0.5 text-xs font-medium text-blue-700 dark:text-blue-400 mb-4 ring-1 ring-inset ring-blue-700/10 dark:ring-blue-400/20">
                      {featuredPost.category.name}
                    </span>
                  )}

                  <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-4 leading-tight">
                    {getLocalizedField(
                      featuredPost.title,
                      featuredPost.titleEn,
                      locale
                    ) || featuredPost.title}
                  </h2>

                  {(featuredPost.excerpt || featuredPost.excerptEn) && (
                    <p className="text-gray-600 dark:text-gray-300 line-clamp-3 mb-6 text-lg">
                      {getLocalizedField(
                        featuredPost.excerpt,
                        featuredPost.excerptEn,
                        locale
                      )}
                    </p>
                  )}

                  <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                    <time
                      dateTime={
                        featuredPost.publishedAt?.toISOString() ||
                        featuredPost.createdAt.toISOString()
                      }>
                      {formatDate(
                        featuredPost.publishedAt || featuredPost.createdAt,
                        locale === "id" ? "id-ID" : "en-US"
                      )}
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
          </StripeHoverWrapper>
        </ScrollReveal>
      )}

      {/* Other Posts Grid */}
      {posts.length > 0 && (
        <StaggerContainer
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          staggerDelay={0.08}>
          {posts.map((post) => (
            <StaggerItem key={post.id}>
              <StripeHoverWrapper className="h-full">
                <Link
                  href={`/blog/${post.slug}`}
                  className="group block h-full">
                  <article className="flex flex-col h-full rounded-xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-md border border-gray-200/60 dark:border-gray-700/60 shadow-md transition-shadow duration-300 overflow-hidden">
                    {/* Image */}
                    {post.image && (
                      <div className="relative aspect-[16/10] overflow-hidden bg-gray-100 dark:bg-gray-800">
                        <Image
                          src={post.image}
                          alt={
                            getLocalizedField(
                              post.title,
                              post.titleEn,
                              locale
                            ) || post.title
                          }
                          className="object-cover img-zoom"
                          fill
                          unoptimized
                        />
                      </div>
                    )}

                    {/* Content */}
                    <div className="p-6 flex flex-col flex-grow">
                      {post.category && (
                        <span className="inline-flex items-center w-fit rounded-md bg-blue-50 dark:bg-blue-900/30 px-2 py-1 text-xs font-medium text-blue-700 dark:text-blue-400 mb-3 ring-1 ring-inset ring-blue-700/10 dark:ring-blue-400/20">
                          {post.category.name}
                        </span>
                      )}

                      <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-2 leading-tight">
                        {getLocalizedField(post.title, post.titleEn, locale) ||
                          post.title}
                      </h3>

                      {(post.excerpt || post.excerptEn) && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-4 grow">
                          {getLocalizedField(
                            post.excerpt,
                            post.excerptEn,
                            locale
                          )}
                        </p>
                      )}

                      <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mt-auto">
                        <time
                          dateTime={
                            post.publishedAt?.toISOString() ||
                            post.createdAt.toISOString()
                          }>
                          {formatDate(
                            post.publishedAt || post.createdAt,
                            locale === "id" ? "id-ID" : "en-US"
                          )}
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
                    </div>
                  </article>
                </Link>
              </StripeHoverWrapper>
            </StaggerItem>
          ))}
        </StaggerContainer>
      )}
    </>
  );
}
