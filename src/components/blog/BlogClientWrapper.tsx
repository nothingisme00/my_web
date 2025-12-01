'use client';

import { useState, useMemo } from 'react';
import { Prisma } from '@prisma/client';
import { BlogFilterControls } from './BlogFilterControls';
import { BlogPostsGrid } from './BlogPostsGrid';
import { Search, BookOpen } from 'lucide-react';
import { useTranslations } from 'next-intl';

type PostWithRelations = Prisma.PostGetPayload<{
  include: { category: true; tags: true; }
}>;

type Category = Prisma.CategoryGetPayload<{
  include: { _count: { select: { posts: true } } }
}>;

type Tag = Prisma.TagGetPayload<{
  include: { _count: { select: { posts: true } } }
}>;

type SortOption = 'newest' | 'oldest' | 'most-viewed' | 'reading-time';

interface BlogClientWrapperProps {
  initialPosts: PostWithRelations[];
  categories: Category[];
  tags: Tag[];
  totalPosts: number;
}

function EmptyState({ hasFilters, onClearFilters }: { hasFilters: boolean; onClearFilters: () => void }) {
  const t = useTranslations('blog.results');

  return (
    <div className="text-center py-20">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
        <Search className="h-8 w-8 text-gray-400" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        {t('noResults')}
      </h3>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        {t('noResultsDescription')}
      </p>
      {hasFilters && (
        <button
          onClick={onClearFilters}
          className="inline-flex items-center gap-2 px-5 py-2.5 border-2 border-gray-300 dark:border-gray-600 hover:border-blue-600 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-gray-900 dark:text-white rounded-lg font-medium transition-all duration-300"
        >
          {t('clearAll', { default: 'Clear All Filters' })}
        </button>
      )}
    </div>
  );
}

export function BlogClientWrapper({
  initialPosts,
  categories,
  tags,
  totalPosts
}: BlogClientWrapperProps) {
  // Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>('newest');

  // Filtering logic with useMemo
  const filteredPosts = useMemo(() => {
    let filtered = [...initialPosts];

    // 1. Search filter (title + excerpt, case-insensitive)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(query) ||
        (post.excerpt?.toLowerCase().includes(query) ?? false)
      );
    }

    // 2. Category filter (single-select)
    if (selectedCategory) {
      filtered = filtered.filter(post => post.category?.id === selectedCategory);
    }

    // 3. Tags filter (multi-select - post must have ALL selected tags)
    if (selectedTags.length > 0) {
      filtered = filtered.filter(post => {
        const postTagIds = post.tags.map(tag => tag.id);
        return selectedTags.every(tagId => postTagIds.includes(tagId));
      });
    }

    // 4. Sort
    const sorted = [...filtered];
    switch (sortBy) {
      case 'newest':
        sorted.sort((a, b) =>
          new Date(b.publishedAt || b.createdAt).getTime() -
          new Date(a.publishedAt || a.createdAt).getTime()
        );
        break;
      case 'oldest':
        sorted.sort((a, b) =>
          new Date(a.publishedAt || a.createdAt).getTime() -
          new Date(b.publishedAt || b.createdAt).getTime()
        );
        break;
      case 'most-viewed':
        sorted.sort((a, b) => b.views - a.views);
        break;
      case 'reading-time':
        sorted.sort((a, b) => a.readingTime - b.readingTime);
        break;
    }

    return sorted;
  }, [initialPosts, searchQuery, selectedCategory, selectedTags, sortBy]);

  // Clear all filters handler
  const handleClearAll = () => {
    setSearchQuery('');
    setSelectedCategory(null);
    setSelectedTags([]);
    setSortBy('newest');
  };

  // Check if any filters are active
  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    selectedCategory !== null ||
    selectedTags.length > 0 ||
    sortBy !== 'newest';

  return (
    <>
      {/* Hero Section with Filters */}
      <section className="relative -mt-24 pt-24 border-b border-gray-200/50 dark:border-gray-800/50 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 py-6 lg:py-8">
          <div className="text-center max-w-3xl mx-auto mb-4">
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Blog
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Artikel dan tulisan tentang web development, programming, dan teknologi
            </p>

            {/* Stats */}
            <div className="flex items-center justify-center gap-6 text-sm text-gray-500 dark:text-gray-400 mb-4">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                <span>{totalPosts} artikel</span>
              </div>
            </div>
          </div>

          {/* Filter Controls */}
          <div className="max-w-5xl mx-auto">
            <BlogFilterControls
              searchQuery={searchQuery}
              selectedCategory={selectedCategory}
              selectedTags={selectedTags}
              sortBy={sortBy}
              onSearchChange={setSearchQuery}
              onCategoryChange={setSelectedCategory}
              onTagsChange={setSelectedTags}
              onSortChange={setSortBy}
              onClearAll={handleClearAll}
              categories={categories}
              tags={tags}
              totalPosts={initialPosts.length}
              filteredCount={filteredPosts.length}
            />
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-12 lg:py-16">
        {filteredPosts.length > 0 ? (
          <BlogPostsGrid
            featuredPost={filteredPosts[0]}
            posts={filteredPosts.slice(1)}
          />
        ) : (
          <EmptyState hasFilters={hasActiveFilters} onClearFilters={handleClearAll} />
        )}
      </div>
    </>
  );
}
