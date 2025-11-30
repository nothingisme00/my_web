import { getPublishedPosts, getCategories, getTags } from "@/lib/actions";
import { BookOpen } from "lucide-react";
import { Prisma } from "@prisma/client";
import { BlogClientWrapper } from "@/components/blog/BlogClientWrapper";

type PostWithRelations = Prisma.PostGetPayload<{
  include: {
    category: true;
    tags: true;
  }
}>;

export default async function BlogPage() {
  // Fetch all data on server
  const [posts, categories, tags] = await Promise.all([
    getPublishedPosts(),
    getCategories(),
    getTags()
  ]);

  return (
    <div className="min-h-screen">
      {posts.length > 0 ? (
        <BlogClientWrapper
          initialPosts={posts as PostWithRelations[]}
          categories={categories}
          tags={tags}
          totalPosts={posts.length}
        />
      ) : (
        <>
          {/* Hero Section */}
          <section className="relative -mt-24 pt-24 border-b border-gray-200/50 dark:border-gray-800/50 backdrop-blur-sm">
            <div className="mx-auto max-w-7xl px-6 lg:px-8 py-16 lg:py-24">
              <div className="text-center max-w-3xl mx-auto">
                <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                  Blog
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                  Artikel dan tulisan tentang web development, programming, dan teknologi
                </p>

                {/* Stats */}
                <div className="flex items-center justify-center gap-6 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    <span>0 artikel</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <div className="mx-auto max-w-7xl px-6 lg:px-8 py-12 lg:py-16">
            <div className="text-center py-20">
              <p className="text-gray-500 dark:text-gray-400">Belum ada artikel yang dipublikasikan.</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
