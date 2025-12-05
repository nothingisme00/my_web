import Link from "next/link";
import Image from "next/image";
import { Clock, Eye, ArrowLeft, Tag } from "lucide-react";
import { getPostsByTag } from "@/lib/actions";
import { formatDate, formatViewCount } from "@/lib/utils";
import { Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";

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

export default async function TagPage({
  params,
}: {
  params: Promise<{ tag: string; locale: string }>;
}) {
  const { tag, locale } = await params;
  const decodedTag = decodeURIComponent(tag);

  let posts: PostWithRelations[] = [];
  try {
    posts = (await getPostsByTag(decodedTag)) as PostWithRelations[];
  } catch (error) {
    console.error("Database error:", error);
  }

  const dateLocale = locale === "id" ? "id-ID" : "en-US";

  return (
    <div className="min-h-screen">
      {/* Breadcrumb */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 pt-8 lg:pt-10">
        <Link
          href={`/${locale}/blog`}
          className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
          <ArrowLeft className="h-4 w-4 mr-2" />
          {locale === "id" ? "Kembali ke Blog" : "Back to Blog"}
        </Link>
      </div>

      {/* Tag Header - Compact */}
      <section className="relative pt-4 pb-6">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 rounded-lg bg-indigo-100 dark:bg-indigo-900/30">
              <Tag className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            </div>
            <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
              Tag
            </span>
            <span className="text-xs text-gray-400 dark:text-gray-500">•</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {posts.length} {locale === "id" ? "artikel" : "articles"}
            </span>
          </div>
          <h1 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">
            #{decodedTag}
          </h1>
          {/* Subtle gradient line */}
          <div className="mt-4 h-px bg-gradient-to-r from-indigo-500/50 via-purple-500/50 to-transparent max-w-xs" />
        </div>
      </section>

      {/* Posts Grid */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-8 lg:py-12">
        {posts.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => {
              const localizedTitle =
                getLocalizedField(post.title, post.titleEn, locale) ||
                post.title;
              const localizedExcerpt = getLocalizedField(
                post.excerpt,
                post.excerptEn,
                locale
              );

              return (
                <Link
                  key={post.id}
                  href={`/${locale}/blog/${post.slug}`}
                  className="group">
                  <article className="flex flex-col h-full">
                    {/* Image */}
                    {post.image && (
                      <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800 mb-4">
                        <Image
                          src={post.image}
                          alt={localizedTitle}
                          className="object-cover img-zoom"
                          fill
                          unoptimized
                        />
                      </div>
                    )}

                    {/* Category Badge */}
                    {post.category && (
                      <span className="inline-flex self-start items-center rounded-full bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1 text-xs font-medium text-indigo-700 dark:text-indigo-300 mb-3">
                        {post.category.name}
                      </span>
                    )}

                    {/* Title */}
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors mb-2 leading-tight">
                      {localizedTitle}
                    </h3>

                    {/* Excerpt */}
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-4 flex-grow">
                      {localizedExcerpt || ""}
                    </p>

                    {/* Meta */}
                    <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                      <time
                        dateTime={
                          post.publishedAt?.toISOString() ||
                          post.createdAt.toISOString()
                        }>
                        {formatDate(
                          post.publishedAt || post.createdAt,
                          dateLocale
                        )}
                      </time>
                      <span>·</span>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>
                          {post.readingTime} {locale === "id" ? "menit" : "min"}
                        </span>
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

                    {/* Tags */}
                    {post.tags && (
                      <div className="flex flex-wrap gap-2 mt-4">
                        {post.tags
                          .split(",")
                          .slice(0, 3)
                          .map((t, i) => (
                            <span
                              key={i}
                              className={`inline-flex items-center text-xs ${
                                t.trim().toLowerCase() ===
                                decodedTag.toLowerCase()
                                  ? "text-indigo-600 dark:text-indigo-400 font-medium"
                                  : "text-gray-600 dark:text-gray-400"
                              }`}>
                              #{t.trim()}
                            </span>
                          ))}
                      </div>
                    )}
                  </article>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              {locale === "id"
                ? "Belum ada artikel dengan tag ini."
                : "No articles found with this tag."}
            </p>
            <Link
              href={`/${locale}/blog`}
              className="inline-flex items-center gap-2 mt-4 text-indigo-600 dark:text-indigo-400 hover:underline">
              <ArrowLeft className="h-4 w-4" />
              {locale === "id" ? "Lihat semua artikel" : "View all articles"}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
