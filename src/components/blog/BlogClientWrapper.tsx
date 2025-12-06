"use client";

import { useState, useMemo } from "react";
import { Prisma } from "@prisma/client";
import { BlogFilterControls } from "./BlogFilterControls";
import { BlogPostsGrid } from "./BlogPostsGrid";
import { Search, FileText } from "lucide-react";
import { useTranslations } from "next-intl";

type PostWithRelations = Prisma.PostGetPayload<{
  include: { category: true };
}>;

type Category = Prisma.CategoryGetPayload<{
  include: { _count: { select: { Post: true } } };
}>;

type SortOption = "newest" | "oldest" | "most-viewed" | "reading-time";

interface BlogClientWrapperProps {
  initialPosts: PostWithRelations[];
  categories: Category[];
  totalPosts: number;
}

function EmptyState({
  hasFilters,
  onClearFilters,
}: {
  hasFilters: boolean;
  onClearFilters: () => void;
}) {
  const t = useTranslations("blog.results");

  return (
    <div className="text-center py-20">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
        <Search className="h-8 w-8 text-gray-400" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        {t("noResults")}
      </h3>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        {t("noResultsDescription")}
      </p>
      {hasFilters && (
        <button
          onClick={onClearFilters}
          className="inline-flex items-center gap-2 px-5 py-2.5 border-2 border-gray-300 dark:border-gray-600 hover:border-blue-600 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-gray-900 dark:text-white rounded-lg font-medium transition-all duration-300">
          {t("clearAll", { default: "Clear All Filters" })}
        </button>
      )}
    </div>
  );
}

export function BlogClientWrapper({
  initialPosts,
  categories,
  totalPosts,
}: BlogClientWrapperProps) {
  // Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>("newest");

  // Filtering logic with useMemo
  const filteredPosts = useMemo(() => {
    let filtered = [...initialPosts];

    // 1. Search filter (title + excerpt, case-insensitive)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(query) ||
          (post.excerpt?.toLowerCase().includes(query) ?? false)
      );
    }

    // 2. Category filter (single-select)
    if (selectedCategory) {
      filtered = filtered.filter(
        (post) => post.category?.id === selectedCategory
      );
    }

    // 3. Sort
    const sorted = [...filtered];
    switch (sortBy) {
      case "newest":
        sorted.sort(
          (a, b) =>
            new Date(b.publishedAt || b.createdAt).getTime() -
            new Date(a.publishedAt || a.createdAt).getTime()
        );
        break;
      case "oldest":
        sorted.sort(
          (a, b) =>
            new Date(a.publishedAt || a.createdAt).getTime() -
            new Date(b.publishedAt || b.createdAt).getTime()
        );
        break;
      case "most-viewed":
        sorted.sort((a, b) => b.views - a.views);
        break;
      case "reading-time":
        sorted.sort((a, b) => a.readingTime - b.readingTime);
        break;
    }

    return sorted;
  }, [initialPosts, searchQuery, selectedCategory, sortBy]);

  // Clear all filters handler
  const handleClearAll = () => {
    setSearchQuery("");
    setSelectedCategory(null);
    setSortBy("newest");
  };

  // Check if any filters are active
  const hasActiveFilters =
    searchQuery.trim() !== "" ||
    selectedCategory !== null ||
    sortBy !== "newest";

  return (
    <>
      {/* Compact Minimal Hero */}
      <section className="relative -mt-24 pt-32 pb-4">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-violet-100 dark:bg-violet-900/30">
              <FileText className="h-4 w-4 text-violet-600 dark:text-violet-400" />
            </div>
            <span className="text-sm font-medium text-violet-600 dark:text-violet-400">
              Blog
            </span>
            <span className="text-xs text-gray-400 dark:text-gray-500">•</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {totalPosts} artikel
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Blog
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-lg">
            Artikel dan tulisan tentang web development, programming, dan
            teknologi
          </p>
          {/* Subtle gradient line */}
          <div className="mt-6 h-px bg-gradient-to-r from-violet-500/50 via-purple-500/50 to-transparent max-w-xs" />
        </div>
      </section>

      {/* Full Width Filter Section */}
      <section>
        <div className="mx-auto max-w-7xl px-6 lg:px-8 py-4">
          <div className="mx-auto max-w-5xl">
            <BlogFilterControls
              searchQuery={searchQuery}
              selectedCategory={selectedCategory}
              sortBy={sortBy}
              onSearchChange={setSearchQuery}
              onCategoryChange={setSelectedCategory}
              onSortChange={setSortBy}
              onClearAll={handleClearAll}
              categories={categories}
              totalPosts={initialPosts.length}
              filteredCount={filteredPosts.length}
            />
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-8 lg:py-12">
        <div className="mx-auto max-w-5xl">
          {filteredPosts.length > 0 ? (
            <BlogPostsGrid
              featuredPost={filteredPosts[0]}
              posts={filteredPosts.slice(1)}
            />
          ) : (
            <EmptyState
              hasFilters={hasActiveFilters}
              onClearFilters={handleClearAll}
            />
          )}
        </div>
      </div>
    </>
  );
}
