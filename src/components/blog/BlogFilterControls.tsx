'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';
import { Search, X, SlidersHorizontal } from 'lucide-react';
import { Select } from '@/components/ui/HeadlessSelect';
import { MultiSelect } from '@/components/ui/HeadlessMultiSelect';
import { useTranslations } from 'next-intl';
import { Prisma } from '@prisma/client';

type Category = Prisma.CategoryGetPayload<{
  include: { _count: { select: { posts: true } } }
}>;

type Tag = Prisma.TagGetPayload<{
  include: { _count: { select: { posts: true } } }
}>;

type SortOption = 'newest' | 'oldest' | 'most-viewed' | 'reading-time';

interface BlogFilterControlsProps {
  searchQuery: string;
  selectedCategory: string | null;
  selectedTags: string[];
  sortBy: SortOption;
  onSearchChange: (query: string) => void;
  onCategoryChange: (categoryId: string | null) => void;
  onTagsChange: (tagIds: string[]) => void;
  onSortChange: (sort: SortOption) => void;
  onClearAll: () => void;
  categories: Category[];
  tags: Tag[];
  totalPosts: number;
  filteredCount: number;
}

// FilterChip Component
interface FilterChipProps {
  label: string;
  onRemove: () => void;
  color: 'blue' | 'purple' | 'green';
}

function FilterChip({ label, onRemove, color }: FilterChipProps) {
  const colorClasses = {
    blue: 'bg-blue-50/80 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-300 dark:hover:bg-blue-900/30',
    purple: 'bg-purple-50/80 text-purple-700 hover:bg-purple-100 dark:bg-purple-900/20 dark:text-purple-300 dark:hover:bg-purple-900/30',
    green: 'bg-green-50/80 text-green-700 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-300 dark:hover:bg-green-900/30'
  };

  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium ${colorClasses[color]} transition-colors`}>
      {label}
      <button
        onClick={onRemove}
        className="hover:opacity-70 transition-opacity"
        aria-label={`Remove ${label} filter`}
      >
        <X className="h-3 w-3" />
      </button>
    </span>
  );
}

// ActiveFilters Component
interface ActiveFiltersProps {
  searchQuery: string;
  selectedCategory: string | null;
  selectedTags: string[];
  categories: Category[];
  tags: Tag[];
  onRemoveSearch: () => void;
  onRemoveCategory: () => void;
  onRemoveTag: (tagId: string) => void;
}

function ActiveFilters({
  searchQuery,
  selectedCategory,
  selectedTags,
  categories,
  tags,
  onRemoveSearch,
  onRemoveCategory,
  onRemoveTag
}: ActiveFiltersProps) {
  const hasFilters = searchQuery.trim() || selectedCategory || selectedTags.length > 0;

  if (!hasFilters) return null;

  return (
    <div className="flex flex-wrap gap-1.5">
      {searchQuery.trim() && (
        <FilterChip
          label={`"${searchQuery}"`}
          onRemove={onRemoveSearch}
          color="blue"
        />
      )}

      {selectedCategory && (
        <FilterChip
          label={categories.find(c => c.id === selectedCategory)?.name || ''}
          onRemove={onRemoveCategory}
          color="purple"
        />
      )}

      {selectedTags.map(tagId => {
        const tag = tags.find(t => t.id === tagId);
        return tag ? (
          <FilterChip
            key={tagId}
            label={tag.name}
            onRemove={() => onRemoveTag(tagId)}
            color="green"
          />
        ) : null;
      })}
    </div>
  );
}

// Main BlogFilterControls Component
export function BlogFilterControls({
  searchQuery,
  selectedCategory,
  selectedTags,
  sortBy,
  onSearchChange,
  onCategoryChange,
  onTagsChange,
  onSortChange,
  onClearAll,
  categories,
  tags,
  totalPosts,
  filteredCount
}: BlogFilterControlsProps) {
  const t = useTranslations('blog.filters');
  const tSearch = useTranslations('blog.search');

  const [localSearch, setLocalSearch] = useState(searchQuery);
  const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(null);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  // Debounced search
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalSearch(value);

    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }

    const timeout = setTimeout(() => {
      onSearchChange(value);
    }, 300);

    setDebounceTimeout(timeout);
  }, [debounceTimeout, onSearchChange]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeout) {
        clearTimeout(debounceTimeout);
      }
    };
  }, [debounceTimeout]);

  // Category options
  const categoryOptions = useMemo(() => [
    { value: '', label: t('category.all') },
    ...categories.map(cat => ({
      value: cat.id,
      label: `${cat.name} (${cat._count?.posts || 0})`
    }))
  ], [categories, t]);

  // Tags options
  const tagsOptions = useMemo(() =>
    tags.map(tag => ({
      value: tag.id,
      label: tag.name,
      count: tag._count?.posts || 0
    }))
  , [tags]);

  // Sort options
  const sortOptions = useMemo(() => [
    { value: 'newest', label: t('sort.newest') },
    { value: 'oldest', label: t('sort.oldest') },
    { value: 'most-viewed', label: t('sort.mostViewed') },
    { value: 'reading-time', label: t('sort.readingTime') }
  ], [t]);

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    selectedCategory !== null ||
    selectedTags.length > 0 ||
    sortBy !== 'newest';

  return (
    <div className="space-y-3">
      {/* Minimalist Search & Filters */}
      <div className="space-y-2.5">
        {/* Search Bar - Clean & Simple */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
          <input
            type="text"
            value={localSearch}
            onChange={handleSearchChange}
            placeholder={tSearch('placeholder')}
            className="w-full pl-10 pr-11 py-2.5 bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm border border-gray-200/80 dark:border-gray-700/80 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-gray-300 dark:focus:border-gray-600 focus:bg-white dark:focus:bg-gray-900 transition-all"
          />
          
          {/* Minimal Filter Toggle */}
          <button
            onClick={() => setIsFiltersOpen(!isFiltersOpen)}
            className={`absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg transition-all ${
              isFiltersOpen 
                ? 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300' 
                : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 dark:text-gray-500'
            }`}
            aria-label="Toggle filters"
            title={isFiltersOpen ? 'Hide filters' : 'Show filters'}
          >
            <SlidersHorizontal className="h-3.5 w-3.5 transition-colors" />
          </button>
        </div>

        {/* Collapsible Filters */}
        <div 
          className={`grid transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${
            isFiltersOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
          }`}
        >
          <div className="overflow-hidden">
            <div className="space-y-2">
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="flex-1">
                  <Select
                    value={selectedCategory || ''}
                    onChange={(value) => onCategoryChange(value || null)}
                    options={categoryOptions}
                    placeholder={t('category.all')}
                  />
                </div>

                <div className="flex-1">
                  <MultiSelect
                    value={selectedTags}
                    onChange={onTagsChange}
                    options={tagsOptions}
                    placeholder={t('tags.select')}
                  />
                </div>

                <div className="flex-1">
                  <Select
                    value={sortBy}
                    onChange={(value) => onSortChange(value as SortOption)}
                    options={sortOptions}
                    placeholder={t('sort.label')}
                  />
                </div>
              </div>

              {/* Subtle Clear Button */}
              {hasActiveFilters && (
                <button
                  onClick={onClearAll}
                  className="w-full px-3 py-1.5 text-xs font-medium text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                >
                  <X className="h-3 w-3" />
                  {t('clearAll')}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Active Filters Row */}
        {(searchQuery.trim() || selectedCategory || selectedTags.length > 0) && (
          <ActiveFilters
            searchQuery={searchQuery}
            selectedCategory={selectedCategory}
            selectedTags={selectedTags}
            categories={categories}
            tags={tags}
            onRemoveSearch={() => onSearchChange('')}
            onRemoveCategory={() => onCategoryChange(null)}
            onRemoveTag={(tagId) => onTagsChange(selectedTags.filter(id => id !== tagId))}
          />
        )}
      </div>

      {/* Minimal Results Count */}
      <div className="flex items-center justify-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-50/80 dark:bg-gray-800/50 text-gray-600 dark:text-gray-400 rounded-lg text-xs font-medium">
          <SlidersHorizontal className="h-3 w-3" />
          {filteredCount === totalPosts ? (
            <span>{totalPosts} artikel</span>
          ) : (
            <span>{filteredCount} dari {totalPosts} artikel</span>
          )}
        </div>
      </div>
    </div>
  );
}
