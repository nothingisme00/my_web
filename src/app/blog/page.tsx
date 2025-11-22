import Link from "next/link";
import { getPublishedPosts } from "@/lib/actions";
import { formatDate, formatViewCount } from "@/lib/utils";
import { Clock, Eye, Search, BookOpen } from "lucide-react";
import { Prisma } from "@prisma/client";
import { BlogPostsGrid } from "@/components/blog/BlogPostsGrid";

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
            <BlogPostsGrid featuredPost={featuredPost} posts={otherPosts} />
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
