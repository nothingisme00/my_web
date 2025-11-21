import Link from "next/link";
import { ArrowRight, Clock, Eye, Sparkles, BookOpen } from "lucide-react";
import { getFeaturedPosts, getCategories } from "@/lib/actions";
import { formatDate, formatViewCount } from "@/lib/utils";
import { Prisma } from "@prisma/client";
import { HeroCarousel } from "@/components/home/HeroCarousel";
import { TypewriterText } from "@/components/home/TypewriterText";

type PostWithRelations = Prisma.PostGetPayload<{
  include: {
    category: true;
    tags: true;
  }
}>;

export default async function Home() {
  const allPosts = await getFeaturedPosts(9) as PostWithRelations[];
  const categories = await getCategories();

  // Separate featured (first post) and recent posts
  const featuredPost = allPosts[0];
  const recentPosts = allPosts.slice(1, 7);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Hero Section - Full Width Centered */}
      <section className="relative overflow-hidden border-b border-gray-200 dark:border-gray-800">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
          <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] dark:opacity-[0.05]" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-24">
          <div className="max-w-2xl space-y-8 animate-fade-in">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 dark:bg-blue-900/30 px-4 py-2 text-sm font-medium text-blue-700 dark:text-blue-400 ring-1 ring-inset ring-blue-700/10 dark:ring-blue-400/20 animate-slide-down">
              <Sparkles className="h-4 w-4" />
              Welcome to my blog
            </div>

            {/* Main Heading with Gradient */}
            <div className="space-y-4">
              <h1 className="text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
                <span className="block text-gray-900 dark:text-white animate-slide-up">
                  It's me, Fattah
                </span>
                <span className="block mt-2 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                  <TypewriterText
                    words={['Learning', 'Creative', 'Tech', 'Art']}
                    className="text-blue-600 dark:text-blue-400"
                  />
                </span>
                <span className="block mt-1 bg-gradient-to-r from-gray-700 to-gray-900 dark:from-gray-200 dark:to-white bg-clip-text text-transparent animate-slide-up" style={{ animationDelay: '0.15s' }}>
                  Enthusiast
                </span>
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed animate-slide-up" style={{ animationDelay: '0.2s' }}>
                Sharing experiences and interesting things I want you to know
              </p>
            </div>

            {/* Tech Stack Pills */}
            <div className="flex flex-wrap gap-2 animate-slide-up" style={{ animationDelay: '0.3s' }}>
              {['Next.js', 'React', 'TypeScript', 'Tailwind CSS'].map((tech, index) => (
                <span
                  key={tech}
                  className="inline-flex items-center rounded-md bg-white dark:bg-gray-800 px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 shadow-sm"
                  style={{ animationDelay: `${0.4 + index * 0.05}s` }}
                >
                  {tech}
                </span>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 animate-slide-up" style={{ animationDelay: '0.5s' }}>
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 dark:bg-blue-500 px-6 py-3 text-sm font-semibold text-white shadow-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-all duration-200 hover-lift"
              >
                <BookOpen className="h-4 w-4" />
                Browse Articles
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 rounded-lg bg-white dark:bg-gray-800 px-6 py-3 text-sm font-semibold text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 shadow-sm transition-all duration-200 hover-lift"
              >
                About Me
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Post + Recent Posts Grid */}
      <section id="articles" className="py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">

          {featuredPost && (
            <div className="mb-16">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Featured</h2>
              </div>

              {/* Large Featured Post */}
              <Link href={`/blog/${featuredPost.slug}`} className="group">
                <article className="grid lg:grid-cols-2 gap-8 lg:gap-12 border border-gray-200 dark:border-gray-800 rounded-2xl p-8 lg:p-10 hover:border-blue-200 dark:hover:border-blue-900/50 hover:shadow-lg transition-all duration-200">

                  {/* Image */}
                  {featuredPost.image && (
                    <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800">
                      <img
                        src={featuredPost.image}
                        alt={featuredPost.title}
                        className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-103"
                      />
                    </div>
                  )}

                  {/* Content */}
                  <div className="flex flex-col justify-center space-y-4">
                    {featuredPost.category && (
                      <span className="inline-flex items-center w-fit rounded-full bg-blue-50 dark:bg-blue-900/30 px-3 py-1 text-xs font-medium text-blue-700 dark:text-blue-400 ring-1 ring-inset ring-blue-700/10 dark:ring-blue-400/20">
                        {featuredPost.category.name}
                      </span>
                    )}

                    <h3 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-tight">
                      {featuredPost.title}
                    </h3>

                    <p className="text-lg text-gray-600 dark:text-gray-300 line-clamp-3">
                      {featuredPost.excerpt || ""}
                    </p>

                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 pt-2">
                      <time dateTime={featuredPost.publishedAt?.toISOString() || featuredPost.createdAt.toISOString()}>
                        {formatDate(featuredPost.publishedAt || featuredPost.createdAt, 'id-ID')}
                      </time>
                      <span>·</span>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{featuredPost.readingTime} min read</span>
                      </div>
                      {featuredPost.views > 0 && (
                        <>
                          <span>·</span>
                          <div className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            <span>{formatViewCount(featuredPost.views)} views</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </article>
              </Link>
            </div>
          )}

          {/* Recent Posts List */}
          {recentPosts.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Recent Articles</h2>
                <Link
                  href="/blog"
                  className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                >
                  View all
                </Link>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {recentPosts.map((post) => (
                  <Link key={post.id} href={`/blog/${post.slug}`} className="group">
                    <article className="flex flex-col h-full">
                      {/* Image */}
                      {post.image && (
                        <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800 mb-4">
                          <img
                            src={post.image}
                            alt={post.title}
                            className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-103"
                          />
                        </div>
                      )}

                      {/* Category */}
                      {post.category && (
                        <span className="inline-flex items-center w-fit rounded-md bg-gray-100 dark:bg-gray-800 px-2 py-1 text-xs font-medium text-gray-700 dark:text-gray-300 mb-3">
                          {post.category.name}
                        </span>
                      )}

                      {/* Title */}
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-2 leading-tight">
                        {post.title}
                      </h3>

                      {/* Excerpt */}
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-4 flex-grow">
                        {post.excerpt || ""}
                      </p>

                      {/* Meta */}
                      <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                        <time dateTime={post.publishedAt?.toISOString() || post.createdAt.toISOString()}>
                          {formatDate(post.publishedAt || post.createdAt, 'id-ID')}
                        </time>
                        <span>·</span>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{post.readingTime} min</span>
                        </div>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {allPosts.length === 0 && (
            <div className="text-center py-20">
              <p className="text-gray-500 dark:text-gray-400 mb-4">Belum ada artikel tersedia.</p>
              <Link
                href="/admin/posts/new"
                className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium"
              >
                Buat artikel pertama
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Categories Section */}
      {categories.length > 0 && (
        <section className="py-16 lg:py-20 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-800">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Browse by Category</h2>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Temukan artikel berdasarkan topik yang Anda minati
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-3">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/blog/category/${category.slug}`}
                  className="inline-flex items-center gap-2 rounded-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:border-blue-500 dark:hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200"
                >
                  {category.name}
                  <span className="inline-flex items-center justify-center w-5 h-5 text-xs rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                    {category._count?.posts || 0}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Subtle About CTA */}
      <section className="py-16 border-t border-gray-100 dark:border-gray-800">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            Ingin tahu lebih banyak tentang saya?{' '}
            <Link
              href="/about"
              className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
            >
              Lihat profil dan portfolio saya →
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}
