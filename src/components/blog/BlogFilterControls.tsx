'use client';

import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { Search, X, ChevronDown } from 'lucide-react';
import { Select } from '@/components/ui/Select';
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

// TagsMultiSelect Component
interface TagsMultiSelectProps {
  selectedTags: string[];
  tags: Tag[];
  onChange: (tagIds: string[]) => void;
  label: string;
}

function TagsMultiSelect({ selectedTags, tags, onChange, label }: TagsMultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const handleToggle = (tagId: string) => {
    if (selectedTags.includes(tagId)) {
      onChange(selectedTags.filter(id => id !== tagId));
    } else {
      onChange([...selectedTags, tagId]);
    }
  };

  const selectedTagNames = tags
    .filter(tag => selectedTags.includes(tag.id))
    .map(tag => tag.name)
    .join(', ');

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2.5 pr-10 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-left text-gray-900 dark:text-white flex items-center justify-between hover:border-gray-400 dark:hover:border-gray-600 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        <span className="truncate text-sm">
          {selectedTags.length > 0 ? selectedTagNames : label}
        </span>
        <ChevronDown className={`h-5 w-5 text-gray-400 dark:text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-20 mt-2 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {tags.length > 0 ? (
            tags.map(tag => (
              <button
                key={tag.id}
                type="button"
                onClick={() => handleToggle(tag.id)}
                className="w-full px-4 py-2.5 text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3 transition-colors"
              >
                <input
                  type="checkbox"
                  checked={selectedTags.includes(tag.id)}
                  onChange={() => {}}
                  className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
                />
                <span className="flex-1 text-gray-900 dark:text-white">{tag.name}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  ({tag._count?.posts || 0})
                </span>
              </button>
            ))
          ) : (
            <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 text-center">
              Tidak ada tag
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// FilterChip Component
interface FilterChipProps {
  label: string;
  onRemove: () => void;
  color: 'blue' | 'purple' | 'green';
}

function FilterChip({ label, onRemove, color }: FilterChipProps) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    purple: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
    green: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${colorClasses[color]} animate-in fade-in slide-in-from-top-2 duration-200`}>
      {label}
      <button
        onClick={onRemove}
        className="hover:bg-black/10 dark:hover:bg-white/10 rounded-full p-0.5 transition-colors"
        aria-label={`Remove ${label} filter`}
      >
        <X className="h-3.5 w-3.5" />
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
    <div className="flex flex-wrap gap-2">
      {/* Search chip */}
      {searchQuery.trim() && (
        <FilterChip
          label={`Search: "${searchQuery}"`}
          onRemove={onRemoveSearch}
          color="blue"
        />
      )}

      {/* Category chip */}
      {selectedCategory && (
        <FilterChip
          label={categories.find(c => c.id === selectedCategory)?.name || ''}
          onRemove={onRemoveCategory}
          color="purple"
        />
      )}

      {/* Tag chips */}
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
    <div className="space-y-4">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
        <input
          type="text"
          value={localSearch}
          onChange={handleSearchChange}
          placeholder={tSearch('placeholder')}
          className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        />
      </div>

      {/* Filter Controls Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Category Select */}
        <Select
          value={selectedCategory || ''}
          onChange={(e) => onCategoryChange(e.target.value || null)}
          options={categoryOptions}
        />

        {/* Tags Multi-Select */}
        <TagsMultiSelect
          selectedTags={selectedTags}
          tags={tags}
          onChange={onTagsChange}
          label={t('tags.select')}
        />

        {/* Sort Select */}
        <Select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value as SortOption)}
          options={sortOptions}
        />

        {/* Clear All Button */}
        <button
          onClick={onClearAll}
          disabled={!hasActiveFilters}
          className="px-4 py-2.5 border-2 border-gray-300 dark:border-gray-700 hover:border-blue-600 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-gray-900 dark:text-white rounded-lg font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-gray-300 dark:disabled:hover:border-gray-700 disabled:hover:bg-transparent flex items-center justify-center gap-2"
        >
          <X className="h-4 w-4" />
          {t('clearAll')}
        </button>
      </div>

      {/* Active Filters */}
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

      {/* Results Count */}
      <div className="text-sm text-gray-600 dark:text-gray-400 text-center">
        {filteredCount === totalPosts ? (
          <span>{totalPosts} artikel</span>
        ) : (
          <span>Menampilkan {filteredCount} dari {totalPosts} artikel</span>
        )}
      </div>
    </div>
  );
}
