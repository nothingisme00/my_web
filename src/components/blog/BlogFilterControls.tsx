"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { Search, X, SlidersHorizontal } from "lucide-react";
import { Select } from "@/components/ui/HeadlessSelect";
import { useTranslations } from "next-intl";
import { Prisma } from "@prisma/client";

type Category = Prisma.CategoryGetPayload<{
  include: { _count: { select: { Post: true } } };
}>;

type SortOption = "newest" | "oldest" | "most-viewed" | "reading-time";

interface BlogFilterControlsProps {
  searchQuery: string;
  selectedCategory: string | null;
  sortBy: SortOption;
  onSearchChange: (query: string) => void;
  onCategoryChange: (categoryId: string | null) => void;
  onSortChange: (sort: SortOption) => void;
  onClearAll: () => void;
  categories: Category[];
  totalPosts: number;
  filteredCount: number;
}

// FilterChip Component
interface FilterChipProps {
  label: string;
  onRemove: () => void;
  color: "blue" | "purple";
}

function FilterChip({ label, onRemove, color }: FilterChipProps) {
  const colorClasses = {
    blue: "bg-blue-50/80 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-300 dark:hover:bg-blue-900/30",
    purple:
      "bg-purple-50/80 text-purple-700 hover:bg-purple-100 dark:bg-purple-900/20 dark:text-purple-300 dark:hover:bg-purple-900/30",
  };

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium ${colorClasses[color]} transition-colors`}>
      {label}
      <button
        onClick={onRemove}
        className="hover:opacity-70 transition-opacity"
        aria-label={`Remove ${label} filter`}>
        <X className="h-3 w-3" />
      </button>
    </span>
  );
}

// Main BlogFilterControls Component
export function BlogFilterControls({
  searchQuery,
  selectedCategory,
  sortBy,
  onSearchChange,
  onCategoryChange,
  onSortChange,
  onClearAll,
  categories,
  totalPosts,
  filteredCount,
}: BlogFilterControlsProps) {
  const t = useTranslations("blog.filters");
  const tSearch = useTranslations("blog.search");

  const [localSearch, setLocalSearch] = useState(searchQuery);
  const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(
    null
  );

  // Debounced search
  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setLocalSearch(value);

      if (debounceTimeout) {
        clearTimeout(debounceTimeout);
      }

      const timeout = setTimeout(() => {
        onSearchChange(value);
      }, 300);

      setDebounceTimeout(timeout);
    },
    [debounceTimeout, onSearchChange]
  );

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeout) {
        clearTimeout(debounceTimeout);
      }
    };
  }, [debounceTimeout]);

  // Category options
  const categoryOptions = useMemo(
    () => [
      { value: "", label: t("category.all") },
      ...categories.map((cat) => ({
        value: cat.id,
        label: `${cat.name} (${cat._count?.Post || 0})`,
      })),
    ],
    [categories, t]
  );

  // Sort options
  const sortOptions = useMemo(
    () => [
      { value: "newest", label: t("sort.newest") },
      { value: "oldest", label: t("sort.oldest") },
      { value: "most-viewed", label: t("sort.mostViewed") },
      { value: "reading-time", label: t("sort.readingTime") },
    ],
    [t]
  );

  const hasActiveFilters =
    searchQuery.trim() !== "" ||
    selectedCategory !== null ||
    sortBy !== "newest";

  return (
    <div className="space-y-3">
      {/* Search & Filters Row */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
          <input
            type="text"
            value={localSearch}
            onChange={handleSearchChange}
            placeholder={tSearch("placeholder")}
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition-all"
          />
          {localSearch && (
            <button
              onClick={() => {
                setLocalSearch("");
                onSearchChange("");
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
              <X className="h-3.5 w-3.5 text-gray-400" />
            </button>
          )}
        </div>

        {/* Category & Sort */}
        <div className="flex gap-2">
          <div className="w-full sm:w-auto sm:min-w-[160px]">
            <Select
              value={selectedCategory || ""}
              onChange={(value) => onCategoryChange(value || null)}
              options={categoryOptions}
              placeholder={t("category.all")}
            />
          </div>

          <div className="w-full sm:w-auto sm:min-w-[150px]">
            <Select
              value={sortBy}
              onChange={(value) => onSortChange(value as SortOption)}
              options={sortOptions}
              placeholder={t("sort.label")}
            />
          </div>
        </div>
      </div>

      {/* Active Filters & Results Row */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Active Filters */}
        <div className="flex flex-wrap gap-1.5">
          {searchQuery.trim() && (
            <FilterChip
              label={`"${searchQuery}"`}
              onRemove={() => {
                setLocalSearch("");
                onSearchChange("");
              }}
              color="blue"
            />
          )}

          {selectedCategory && (
            <FilterChip
              label={
                categories.find((c) => c.id === selectedCategory)?.name || ""
              }
              onRemove={() => onCategoryChange(null)}
              color="purple"
            />
          )}

          {/* Clear All Button */}
          {hasActiveFilters && (
            <button
              onClick={onClearAll}
              className="px-2.5 py-1 text-xs font-medium text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors flex items-center gap-1">
              <X className="h-3 w-3" />
              {t("clearAll")}
            </button>
          )}
        </div>

        {/* Results Count */}
        <div className="ml-auto inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100/80 dark:bg-gray-800/50 text-gray-600 dark:text-gray-400 rounded-lg text-xs font-medium">
          <SlidersHorizontal className="h-3 w-3" />
          {filteredCount === totalPosts ? (
            <span>{totalPosts} artikel</span>
          ) : (
            <span>
              {filteredCount} dari {totalPosts} artikel
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
