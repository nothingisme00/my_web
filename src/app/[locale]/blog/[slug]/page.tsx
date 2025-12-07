import Link from "next/link";
import { ArrowLeft, Eye, Clock, Calendar } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { incrementPostViews, getRelatedPosts } from "@/lib/actions";
import { formatDate, formatViewCount } from "@/lib/utils";
import { ShareButtons } from "@/components/blog/ShareButtons";
import { Metadata } from "next";
import Image from "next/image";
import DOMPurify from "isomorphic-dompurify";
import { Prisma } from "@prisma/client";
import { ReadingProgress } from "@/components/blog/ReadingProgress";
import { BlogContent } from "@/components/blog/BlogContent";
import { ReactionButtons } from "@/components/blog/ReactionButtons";
import { RelatedArticles } from "@/components/blog/RelatedArticles";
import { getTranslations } from "next-intl/server";

// Force dynamic rendering - no build-time database queries
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

type PostWithRelations = Prisma.PostGetPayload<{
  include: {
    category: true;
  };
}>;

// Helper to get localized content
function getLocalizedField(
  id: string | null | undefined,
  en: string | null | undefined,
  locale: string
): string | null {
  if (locale === "en") {
    return en || id || null;
  }
  return id || null;
}

// Static metadata - actual metadata will be set in the page component
export const metadata: Metadata = {
  title: "Blog Post",
  description: "Read this blog post",
};

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug, locale } = await params;

  let post;
  try {
    post = await prisma.post.findUnique({
      where: { slug },
      include: {
        category: true,
      },
    });
  } catch (error) {
    console.error("Database error:", error);
    notFound();
  }

  if (!post) {
    notFound();
  }

  const t = await getTranslations("blog");

  // Increment view count
  await incrementPostViews(slug);

  // Get related posts (by category and/or tags)
  const relatedPosts = (await getRelatedPosts(
    post.id,
    post.categoryId,
    post.tags,
    3
  )) as PostWithRelations[];

  // Get localized content
  const localizedTitle =
    getLocalizedField(post.title, post.titleEn, locale) || post.title;
  const localizedExcerpt = getLocalizedField(
    post.excerpt,
    post.excerptEn,
    locale
  );
  const localizedContent =
    getLocalizedField(post.content, post.contentEn, locale) || post.content;

  // Sanitize HTML content (optimized for SSR)
  const sanitizedContent = DOMPurify.sanitize(localizedContent);

  const postUrl = `${
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  }/blog/${post.slug}`;

  const dateLocale = locale === "id" ? "id-ID" : "en-US";

  return (
    <>
      <ReadingProgress />
      <div className="min-h-screen">
        {/* Header */}
        <div className="relative -mt-24 pt-24 border-b border-gray-200/50 dark:border-gray-800/50 backdrop-blur-sm">
          <div className="mx-auto max-w-4xl px-6 py-8 lg:px-8">
            {/* Breadcrumb and Category */}
            <div className="flex items-center justify-between mb-6">
              <Link
                href="/blog"
                className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                <ArrowLeft className="h-4 w-4 mr-2" />
                {t("backToBlog")}
              </Link>

              {/* Category */}
              {post.category && (
                <Link
                  href={`/blog/category/${post.category.slug}`}
                  className="inline-flex items-center rounded-full bg-blue-50 dark:bg-blue-900/30 px-3 py-1 text-xs font-medium text-blue-700 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-all duration-200 ease-out">
                  {post.category.name}
                </Link>
              )}
            </div>

            {/* Title */}
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              {localizedTitle}
            </h1>

            {/* Excerpt */}
            {localizedExcerpt && (
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                {localizedExcerpt}
              </p>
            )}

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <time
                  dateTime={
                    post.publishedAt?.toISOString() ||
                    post.createdAt.toISOString()
                  }>
                  {formatDate(post.publishedAt || post.createdAt, dateLocale)}
                </time>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>
                  {post.readingTime}{" "}
                  {locale === "id" ? "menit baca" : "min read"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                <span>
                  {formatViewCount(post.views + 1)}{" "}
                  {locale === "id" ? "dilihat" : "views"}
                </span>
              </div>
              {post.author && (
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900 dark:text-white">
                    {locale === "id" ? "oleh" : "by"} {post.author}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Featured Image */}
        {post.image && (
          <div className="mx-auto max-w-5xl px-6 py-12 lg:px-8">
            <div className="relative w-full aspect-[21/9] rounded-2xl overflow-hidden">
              <Image
                src={post.image}
                alt={localizedTitle}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1400px"
                priority
              />
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="mx-auto max-w-4xl px-6 lg:px-8 py-12 backdrop-blur-[3px]">
          <div className="grid lg:grid-cols-12 gap-12">
            {/* Sidebar - Social Sharing */}
            <aside className="lg:col-span-2 order-2 lg:order-1">
              <ShareButtons title={localizedTitle} url={postUrl} />
            </aside>

            {/* Article Content */}
            <article className="lg:col-span-10 order-1 lg:order-2">
              <BlogContent content={sanitizedContent} />

              {/* Reaction Buttons */}
              <div className="flex justify-center my-12 py-8 border-y border-gray-200 dark:border-gray-800">
                <ReactionButtons
                  slug={post.slug}
                  initialReactions={{
                    love: post.reactionsLove,
                    like: post.reactionsLike,
                    wow: post.reactionsWow,
                    fire: post.reactionsFire,
                  }}
                />
              </div>

              {/* Tags */}
              {post.tags && (
                <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4 uppercase tracking-wider">
                    Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.split(",").map((tag, index) => (
                      <Link
                        key={index}
                        href={`/${locale}/blog/tag/${encodeURIComponent(
                          tag.trim()
                        )}`}
                        className="inline-flex items-center rounded-full bg-gray-100 dark:bg-gray-800 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors">
                        #{tag.trim()}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </article>
          </div>

          {/* Related Articles */}
          <RelatedArticles posts={relatedPosts} />
        </div>
      </div>
    </>
  );
}
