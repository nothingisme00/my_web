import Link from "next/link";
import { getPublishedPosts } from "@/lib/actions";
import { formatDate, formatViewCount } from "@/lib/utils";
import { Clock, Eye, Search, BookOpen } from "lucide-react";
import { Prisma } from "@prisma/client";

type PostWithRelations = Prisma.PostGetPayload<{
  include: {
    category: true;
    tags: true;
  }
}>;

export default async function BlogPage() {
  const posts = await getPublishedPosts() as PostWithRelations[];
  const featuredPost = posts[0];
  const otherPosts = posts.slice(1);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section with Search */}
      <section className="bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 py-16 lg:py-24">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Blog
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
              Artikel dan tulisan tentang web development, programming, dan teknologi
            </p>

            {/* Search Bar */}
            <div className="relative max-w-xl mx-auto mb-8">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Cari artikel..."
                className="w-full pl-12 pr-4 py-3 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Stats */}
            <div className="flex items-center justify-center gap-6 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                <span>{posts.length} artikel</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-12 lg:py-16">
        {posts.length > 0 ? (
          <>
            {/* Featured Post */}
            {featuredPost && (
              <section className="mb-16">
                <Link href={`/blog/${featuredPost.slug}`} className="group block">
                  <article className="grid lg:grid-cols-2 gap-8 p-6 rounded-2xl bg-gray-50 dark:bg-gray-800/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ease-out">
                    {/* Image */}
                    {featuredPost.image && (
                      <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800">
                        <img
                          src={featuredPost.image}
                          alt={featuredPost.title}
                          className="w-full h-full object-cover img-zoom"
                        />
                        <div className="absolute top-4 left-4">
                          <span className="px-3 py-1 rounded-full bg-blue-600 text-white text-xs font-medium">
                            Featured
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Content */}
                    <div className="flex flex-col justify-center">
                      {featuredPost.category && (
                        <span className="inline-flex items-center w-fit rounded-md bg-blue-50 dark:bg-blue-900/30 px-2.5 py-0.5 text-xs font-medium text-blue-700 dark:text-blue-400 mb-4">
                          {featuredPost.category.name}
                        </span>
                      )}

                      <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200 mb-4 leading-tight">
                        {featuredPost.title}
                      </h2>

                      <p className="text-gray-600 dark:text-gray-400 line-clamp-3 mb-6 text-lg">
                        {featuredPost.excerpt || ""}
                      </p>

                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                        <time dateTime={featuredPost.publishedAt?.toISOString() || featuredPost.createdAt.toISOString()}>
                          {formatDate(featuredPost.publishedAt || featuredPost.createdAt, 'id-ID')}
                        </time>
                        <span>·</span>
                        <div className="flex items-center gap-1.5">
                          <Clock className="h-4 w-4" />
                          <span>{featuredPost.readingTime} min read</span>
                        </div>
                        {featuredPost.views > 0 && (
                          <>
                            <span>·</span>
                            <div className="flex items-center gap-1.5">
                              <Eye className="h-4 w-4" />
                              <span>{formatViewCount(featuredPost.views)} views</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </article>
                </Link>
              </section>
            )}

            {/* Other Posts Grid */}
            {otherPosts.length > 0 && (
              <section>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-8">
                  Artikel Lainnya
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {otherPosts.map((post) => (
                    <Link key={post.id} href={`/blog/${post.slug}`} className="group block">
                      <article className="flex flex-col h-full rounded-xl overflow-hidden bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ease-out">
                        {/* Image */}
                        {post.image && (
                          <div className="relative aspect-[16/10] overflow-hidden bg-gray-100 dark:bg-gray-800">
                            <img
                              src={post.image}
                              alt={post.title}
                              className="w-full h-full object-cover img-zoom"
                            />
                          </div>
                        )}

                        {/* Content */}
                        <div className="flex flex-col flex-grow p-5">
                          {post.category && (
                            <span className="inline-flex items-center w-fit rounded-md bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 text-xs font-medium text-blue-700 dark:text-blue-400 mb-3">
                              {post.category.name}
                            </span>
                          )}

                          <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200 mb-2 leading-tight line-clamp-2">
                            {post.title}
                          </h3>

                          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-4 flex-grow">
                            {post.excerpt || ""}
                          </p>

                          <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 pt-4 border-t border-gray-100 dark:border-gray-700">
                            <time dateTime={post.publishedAt?.toISOString() || post.createdAt.toISOString()}>
                              {formatDate(post.publishedAt || post.createdAt, 'id-ID')}
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
                  ))}
                </div>
              </section>
            )}
          </>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-500 dark:text-gray-400">Belum ada artikel yang dipublikasikan.</p>
          </div>
        )}
      </div>
    </div>
  );
}
