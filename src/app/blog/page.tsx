import Link from "next/link";
import { getPublishedPosts, getCategories, getTags } from "@/lib/actions";
import { formatDate, formatViewCount } from "@/lib/utils";
import { Clock, Eye } from "lucide-react";
import { Prisma } from "@prisma/client";

type PostWithRelations = Prisma.PostGetPayload<{
  include: {
    category: true;
    tags: true;
  }
}>;

export default async function BlogPage() {
  const posts = await getPublishedPosts() as PostWithRelations[];
  const categories = await getCategories();
  const tags = await getTags();

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 pb-8 border-b border-gray-200 dark:border-gray-800">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Blog
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl">
            Artikel dan tulisan tentang web development, programming, dan teknologi
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {posts.length > 0 ? (
              <div className="space-y-8">
                {posts.map((post) => (
                  <Link key={post.id} href={`/blog/${post.slug}`} className="group block">
                    <article className="grid md:grid-cols-3 gap-6 pb-8 border-b border-gray-100 dark:border-gray-800 hover:border-blue-100 dark:hover:border-blue-900/30 transition-colors">
                      {/* Image */}
                      {post.image && (
                        <div className="md:col-span-1">
                          <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
                            <img
                              src={post.image}
                              alt={post.title}
                              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                          </div>
                        </div>
                      )}

                      {/* Content */}
                      <div className={`flex flex-col ${post.image ? 'md:col-span-2' : 'md:col-span-3'}`}>
                        {/* Category */}
                        {post.category && (
                          <Link
                            href={`/blog/category/${post.category.slug}`}
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center w-fit rounded-md bg-blue-50 dark:bg-blue-900/30 px-2.5 py-0.5 text-xs font-medium text-blue-700 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors mb-3"
                          >
                            {post.category.name}
                          </Link>
                        )}

                        {/* Title */}
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-3 leading-tight">
                          {post.title}
                        </h2>

                        {/* Excerpt */}
                        <p className="text-gray-600 dark:text-gray-400 line-clamp-2 mb-4 flex-grow">
                          {post.excerpt || ""}
                        </p>

                        {/* Meta Info */}
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                          <time dateTime={post.publishedAt?.toISOString() || post.createdAt.toISOString()}>
                            {formatDate(post.publishedAt || post.createdAt, 'id-ID')}
                          </time>
                          <span>·</span>
                          <div className="flex items-center gap-1.5">
                            <Clock className="h-4 w-4" />
                            <span>{post.readingTime} min read</span>
                          </div>
                          {post.views > 0 && (
                            <>
                              <span>·</span>
                              <div className="flex items-center gap-1.5">
                                <Eye className="h-4 w-4" />
                                <span>{formatViewCount(post.views)} views</span>
                              </div>
                            </>
                          )}
                        </div>

                        {/* Tags */}
                        {post.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-4">
                            {post.tags.slice(0, 4).map((tag) => (
                              <Link
                                key={tag.id}
                                href={`/blog/tag/${tag.slug}`}
                                onClick={(e) => e.stopPropagation()}
                                className="text-xs text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                              >
                                #{tag.name}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="text-gray-500 dark:text-gray-400">Belum ada artikel yang dipublikasikan.</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="space-y-8 lg:sticky lg:top-24">
              {/* Categories */}
              {categories.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4 uppercase tracking-wider">
                    Categories
                  </h3>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <Link
                        key={category.id}
                        href={`/blog/category/${category.slug}`}
                        className="flex items-center justify-between py-2 px-3 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400 transition-all group"
                      >
                        <span className="font-medium">{category.name}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                          {category._count?.posts || 0}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Popular Tags */}
              {tags.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4 uppercase tracking-wider">
                    Popular Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {tags.slice(0, 15).map((tag) => (
                      <Link
                        key={tag.id}
                        href={`/blog/tag/${tag.slug}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      >
                        #{tag.name}
                        <span className="text-gray-500 dark:text-gray-400">
                          {tag._count?.posts || 0}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
