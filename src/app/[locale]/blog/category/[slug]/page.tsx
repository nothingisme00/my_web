import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Clock, Eye, ArrowLeft } from "lucide-react";
import { getPostsByCategory, getCategoryBySlug } from "@/lib/actions";
import { formatDate, formatViewCount } from "@/lib/utils";
import { Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";

type PostWithRelations = Prisma.PostGetPayload<{
  include: {
    category: true;
  };
}>;

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug, locale } = await params;

  let category;
  let posts: PostWithRelations[] = [];

  try {
    category = await getCategoryBySlug(slug);
    if (category) {
      posts = (await getPostsByCategory(slug)) as PostWithRelations[];
    }
  } catch (error) {
    console.error("Database error:", error);
    notFound();
  }

  if (!category) {
    notFound();
  }

  const dateLocale = locale === "id" ? "id-ID" : "en-US";

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Breadcrumb */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 pt-16 lg:pt-20">
        <Link
          href={`/${locale}/blog`}
          className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
          <ArrowLeft className="h-4 w-4 mr-2" />
          {locale === "id" ? "Kembali ke Blog" : "Back to Blog"}
        </Link>
      </div>

      {/* Category Header - Full Width */}
      <section className="relative -mt-16 pt-24 border-b border-gray-200/50 dark:border-gray-800/50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 py-16 lg:py-24">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {category.name}
          </h1>
          {category.description && (
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl">
              {category.description}
            </p>
          )}
          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            {posts.length}{" "}
            {posts.length === 1 ? "article" : "articles"}
          </p>
        </div>
      </section>

      {/* Posts Grid */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-16 lg:py-20">
        {posts.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <article key={post.id} className="flex flex-col h-full group">
                {/* Image - Clickable */}
                <Link href={`/${locale}/blog/${post.slug}`}>
                  {post.image && (
                    <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800 mb-4">
                      <Image
                        src={post.image}
                        alt={post.title}
                        className="object-cover img-zoom"
                        fill
                        unoptimized
                      />
                    </div>
                  )}
                </Link>

                {/* Title - Clickable */}
                <Link href={`/${locale}/blog/${post.slug}`}>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors mb-2 leading-tight">
                    {post.title}
                  </h3>
                </Link>

                {/* Excerpt */}
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-4 flex-grow">
                  {post.excerpt || ""}
                </p>

                {/* Meta */}
                <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                  <time
                    dateTime={
                      post.publishedAt?.toISOString() ||
                      post.createdAt.toISOString()
                    }>
                    {formatDate(post.publishedAt || post.createdAt, dateLocale)}
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

                {/* Tags - Clickable */}
                {post.tags && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {post.tags
                      .split(",")
                      .slice(0, 3)
                      .map((tag, i) => (
                        <Link
                          key={i}
                          href={`/${locale}/blog/tag/${encodeURIComponent(
                            tag.trim()
                          )}`}
                          className="inline-flex items-center text-xs text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                          #{tag.trim()}
                        </Link>
                      ))}
                  </div>
                )}
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              Belum ada artikel dalam kategori ini.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
