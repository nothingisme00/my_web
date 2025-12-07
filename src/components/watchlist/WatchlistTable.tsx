"use client";

import { useState, useMemo, useEffect } from "react";
import {
  Star,
  Search,
  Tv,
  Film,
  PlayCircle,
  X,
  ChevronUp,
  ChevronDown,
  RotateCcw,
  SlidersHorizontal,
  LayoutGrid,
  LayoutList,
} from "lucide-react";
import { clsx } from "clsx";
import { SelectCompact } from "@/components/ui/SelectCompact";
import { useLocale } from "next-intl";

// Rating label system
function getRatingLabel(
  rating: number,
  locale: "id" | "en" = "en"
): { label: string; color: string } {
  if (rating >= 9.0) {
    return {
      label: locale === "id" ? "Sempurna" : "Masterpiece",
      color:
        "text-amber-600 bg-amber-50 dark:bg-amber-900/30 border-amber-200 dark:border-amber-700",
    };
  } else if (rating >= 8.4) {
    return {
      label: locale === "id" ? "Sangat Bagus!" : "Highly Rec.",
      color:
        "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-700",
    };
  } else if (rating >= 7.5) {
    return {
      label: locale === "id" ? "Bagus Banget" : "Very Good",
      color:
        "text-blue-600 bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-700",
    };
  } else if (rating >= 6.0) {
    return {
      label: locale === "id" ? "Bagus" : "Good",
      color:
        "text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 border-indigo-200 dark:border-indigo-700",
    };
  } else if (rating >= 4.0) {
    return {
      label: locale === "id" ? "Biasa Saja" : "Average",
      color:
        "text-gray-600 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600",
    };
  } else {
    return {
      label: locale === "id" ? "Kurang" : "Poor",
      color:
        "text-red-600 bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-700",
    };
  }
}

interface WatchlistItem {
  id: string;
  title: string;
  type: string;
  genre: string | null;
  totalEpisode: number | null;
  status: string;
  rating: number | null;
  notesId: string | null;
  notesEn: string | null;
  imageUrl: string | null;
  year: number | null;
  completedAt: string | null;
}

interface WatchlistTableProps {
  items: WatchlistItem[];
}

const statusConfig: Record<
  string,
  { label: string; color: string; bgColor: string }
> = {
  Watching: {
    label: "Watching",
    color: "text-blue-700 dark:text-blue-400",
    bgColor: "bg-blue-100 dark:bg-blue-900/30",
  },
  Completed: {
    label: "Completed",
    color: "text-green-700 dark:text-green-400",
    bgColor: "bg-green-100 dark:bg-green-900/30",
  },
  Dropped: {
    label: "Dropped",
    color: "text-red-700 dark:text-red-400",
    bgColor: "bg-red-100 dark:bg-red-900/30",
  },
  "On Hold": {
    label: "On Hold",
    color: "text-amber-700 dark:text-amber-400",
    bgColor: "bg-amber-100 dark:bg-amber-900/30",
  },
  "Plan to Watch": {
    label: "Plan to Watch",
    color: "text-purple-700 dark:text-purple-400",
    bgColor: "bg-purple-100 dark:bg-purple-900/30",
  },
};

const typeConfig: Record<string, { icon: typeof Tv; color: string }> = {
  Anime: { icon: Tv, color: "text-pink-500" },
  Film: { icon: Film, color: "text-blue-500" },
  Series: { icon: PlayCircle, color: "text-green-500" },
  Donghua: { icon: Tv, color: "text-red-500" },
};

function RatingStars({
  rating,
  locale = "en",
  showLabel = false,
}: {
  rating: number | null;
  locale?: "id" | "en";
  showLabel?: boolean;
}) {
  if (!rating) return <span className="text-gray-400 text-sm">-</span>;

  const fullStars = Math.floor(rating / 2);
  const hasHalfStar = rating % 2 >= 1;
  const ratingInfo = getRatingLabel(rating, locale);

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="flex items-center gap-1">
        <div className="flex">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={clsx(
                "h-4 w-4",
                i < fullStars
                  ? "fill-amber-400 text-amber-400"
                  : i === fullStars && hasHalfStar
                  ? "fill-amber-400/50 text-amber-400"
                  : "text-gray-300 dark:text-gray-600"
              )}
            />
          ))}
        </div>
        <span className="text-sm font-semibold text-gray-900 dark:text-white ml-1">
          {rating.toFixed(1)}
        </span>
      </div>
      {showLabel && (
        <span
          className={clsx(
            "text-[10px] font-medium px-1.5 py-0.5 rounded border",
            ratingInfo.color
          )}>
          {ratingInfo.label}
        </span>
      )}
    </div>
  );
}

// Sortable Header Component
function SortableHeader({
  label,
  sortKey,
  currentSortBy,
  currentSortOrder,
  onSort,
  className = "",
}: {
  label: string;
  sortKey: string;
  currentSortBy: string;
  currentSortOrder: "asc" | "desc";
  onSort: (key: string) => void;
  className?: string;
}) {
  const isActive = currentSortBy === sortKey;

  return (
    <th
      className={clsx(
        "px-4 py-3 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors select-none",
        className
      )}
      onClick={() => onSort(sortKey)}>
      <div className="flex items-center gap-1">
        <span>{label}</span>
        <div className="flex flex-col">
          <ChevronUp
            className={clsx(
              "h-3 w-3 -mb-1",
              isActive && currentSortOrder === "asc"
                ? "text-blue-500"
                : "text-gray-300 dark:text-gray-600"
            )}
          />
          <ChevronDown
            className={clsx(
              "h-3 w-3 -mt-1",
              isActive && currentSortOrder === "desc"
                ? "text-blue-500"
                : "text-gray-300 dark:text-gray-600"
            )}
          />
        </div>
      </div>
    </th>
  );
}

export function WatchlistTable({ items }: WatchlistTableProps) {
  const locale = useLocale();
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterGenre, setFilterGenre] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("rating");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [selectedItem, setSelectedItem] = useState<WatchlistItem | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");

  // Count active filters for badge
  const activeFilterCount = [
    filterGenre !== "all",
    filterStatus !== "all",
    filterType !== "all",
  ].filter(Boolean).length;

  // Helper to get localized notes
  const getLocalizedNotes = (item: WatchlistItem) => {
    if (locale === "en") {
      return item.notesEn || item.notesId || null;
    }
    return item.notesId || null;
  };

  const stats = useMemo(() => {
    const completed = items.filter((i) => i.status === "Completed");
    const avgRating =
      completed.reduce((sum, i) => sum + (i.rating || 0), 0) /
      (completed.filter((i) => i.rating).length || 1);
    return {
      total: items.length,
      completed: completed.length,
      watching: items.filter((i) => i.status === "Watching").length,
      avgRating: avgRating.toFixed(1),
    };
  }, [items]);

  // Handle escape key and body scroll lock for modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedItem(null);
    };
    if (selectedItem) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [selectedItem]);

  // Get unique genres
  const uniqueGenres = useMemo(() => {
    const genres = new Set<string>();
    items.forEach((item) => {
      if (item.genre) {
        item.genre.split(",").forEach((g) => genres.add(g.trim()));
      }
    });
    return Array.from(genres).sort();
  }, [items]);

  // Get unique types
  const uniqueTypes = useMemo(
    () => [...new Set(items.map((i) => i.type))],
    [items]
  );

  const filteredItems = useMemo(() => {
    return items
      .filter((item) => {
        const matchesSearch =
          item.title.toLowerCase().includes(search.toLowerCase()) ||
          item.genre?.toLowerCase().includes(search.toLowerCase());
        const matchesStatus =
          filterStatus === "all" || item.status === filterStatus;
        const matchesType = filterType === "all" || item.type === filterType;
        const matchesGenre =
          filterGenre === "all" || item.genre?.includes(filterGenre);
        return matchesSearch && matchesStatus && matchesType && matchesGenre;
      })
      .sort((a, b) => {
        let comparison = 0;
        if (sortBy === "rating") {
          comparison = (b.rating || 0) - (a.rating || 0);
        } else if (sortBy === "title") {
          comparison = a.title.localeCompare(b.title);
        } else if (sortBy === "year") {
          comparison = (b.year || 0) - (a.year || 0);
        } else if (sortBy === "episodes") {
          comparison = (b.totalEpisode || 0) - (a.totalEpisode || 0);
        }
        return sortOrder === "desc" ? comparison : -comparison;
      });
  }, [items, search, filterStatus, filterType, filterGenre, sortBy, sortOrder]);

  // Handle sort click
  const handleSort = (key: string) => {
    if (sortBy === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(key);
      setSortOrder("desc");
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">Total</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {stats.total}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">Completed</p>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">
            {stats.completed}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">Watching</p>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {stats.watching}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">Avg Rating</p>
          <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
            ⭐ {stats.avgRating}
          </p>
        </div>
      </div>

      {/* Filters - Collapsible on Mobile */}
      <div className="bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Search Row */}
        <div className="p-4">
          <div className="flex gap-2">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search title or genre..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-10 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Filter Toggle Button - Mobile Only */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="sm:hidden flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              <SlidersHorizontal className="h-4 w-4" />
              {activeFilterCount > 0 && (
                <span className="flex items-center justify-center w-5 h-5 text-xs font-bold bg-blue-500 text-white rounded-full">
                  {activeFilterCount}
                </span>
              )}
              <ChevronDown
                className={clsx(
                  "h-4 w-4 transition-transform duration-200",
                  showFilters && "rotate-180"
                )}
              />
            </button>

            {/* Desktop Filters - Always visible on sm+ */}
            <div className="hidden sm:flex gap-2 flex-nowrap">
              {/* Genre Filter */}
              <SelectCompact
                value={filterGenre}
                onChange={setFilterGenre}
                options={[
                  { value: "all", label: "All Genres" },
                  ...uniqueGenres.map((genre) => ({
                    value: genre,
                    label: genre,
                  })),
                ]}
                className="sm:min-w-[130px]"
              />

              {/* Status Filter */}
              <SelectCompact
                value={filterStatus}
                onChange={setFilterStatus}
                options={[
                  { value: "all", label: "All Status" },
                  ...Object.keys(statusConfig).map((status) => ({
                    value: status,
                    label: status,
                  })),
                ]}
                className="sm:min-w-[130px]"
              />

              {/* Type Filter */}
              <SelectCompact
                value={filterType}
                onChange={setFilterType}
                options={[
                  { value: "all", label: "All Types" },
                  ...uniqueTypes.map((type) => ({ value: type, label: type })),
                ]}
                className="sm:min-w-[120px]"
              />

              {/* Reset Button - Desktop */}
              {(search ||
                filterGenre !== "all" ||
                filterStatus !== "all" ||
                filterType !== "all") && (
                <button
                  onClick={() => {
                    setSearch("");
                    setFilterGenre("all");
                    setFilterStatus("all");
                    setFilterType("all");
                  }}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 text-sm font-medium transition-colors border border-red-200 dark:border-red-800"
                  title="Reset all filters">
                  <RotateCcw className="h-4 w-4" />
                  <span>Reset</span>
                </button>
              )}

              {/* View Mode Toggle - More Visible */}
              <div className="flex items-center gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <button
                  onClick={() => setViewMode("table")}
                  className={clsx(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all",
                    viewMode === "table"
                      ? "bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm"
                      : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                  )}
                  title="Table view">
                  <LayoutList className="h-4 w-4" />
                  <span className="hidden lg:inline">Table</span>
                </button>
                <button
                  onClick={() => setViewMode("grid")}
                  className={clsx(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all",
                    viewMode === "grid"
                      ? "bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm"
                      : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                  )}
                  title="Grid view">
                  <LayoutGrid className="h-4 w-4" />
                  <span className="hidden lg:inline">Grid</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Filter Dropdown - Collapsible */}
        <div
          className={clsx(
            "sm:hidden border-t border-gray-200 dark:border-gray-700 transition-all duration-300 ease-in-out overflow-hidden",
            showFilters
              ? "max-h-96 opacity-100"
              : "max-h-0 opacity-0 border-t-0"
          )}>
          <div className="p-4 pt-3 space-y-3 bg-gray-50 dark:bg-gray-800/30">
            {/* Genre Filter */}
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">
                Genre
              </label>
              <SelectCompact
                value={filterGenre}
                onChange={setFilterGenre}
                options={[
                  { value: "all", label: "All Genres" },
                  ...uniqueGenres.map((genre) => ({
                    value: genre,
                    label: genre,
                  })),
                ]}
                className="w-full"
              />
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">
                Status
              </label>
              <SelectCompact
                value={filterStatus}
                onChange={setFilterStatus}
                options={[
                  { value: "all", label: "All Status" },
                  ...Object.keys(statusConfig).map((status) => ({
                    value: status,
                    label: status,
                  })),
                ]}
                className="w-full"
              />
            </div>

            {/* Type Filter */}
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">
                Type
              </label>
              <SelectCompact
                value={filterType}
                onChange={setFilterType}
                options={[
                  { value: "all", label: "All Types" },
                  ...uniqueTypes.map((type) => ({ value: type, label: type })),
                ]}
                className="w-full"
              />
            </div>

            {/* Reset Button - Mobile */}
            {(filterGenre !== "all" ||
              filterStatus !== "all" ||
              filterType !== "all") && (
              <button
                onClick={() => {
                  setFilterGenre("all");
                  setFilterStatus("all");
                  setFilterType("all");
                }}
                className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 text-sm font-medium transition-colors border border-red-200 dark:border-red-800">
                <RotateCcw className="h-4 w-4" />
                <span>Reset Filters</span>
              </button>
            )}

            {/* View Mode Toggle - Mobile */}
            <div className="flex items-center justify-center border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode("table")}
                className={clsx(
                  "flex-1 flex items-center justify-center gap-2 p-2 transition-colors",
                  viewMode === "table"
                    ? "bg-blue-500 text-white"
                    : "bg-white dark:bg-gray-900 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800"
                )}>
                <LayoutList className="h-4 w-4" />
                <span className="text-sm">Table</span>
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={clsx(
                  "flex-1 flex items-center justify-center gap-2 p-2 transition-colors",
                  viewMode === "grid"
                    ? "bg-blue-500 text-white"
                    : "bg-white dark:bg-gray-900 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800"
                )}>
                <LayoutGrid className="h-4 w-4" />
                <span className="text-sm">Grid</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Table View */}
      {viewMode === "table" && (
        <div className="bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                  <SortableHeader
                    label="Title"
                    sortKey="title"
                    currentSortBy={sortBy}
                    currentSortOrder={sortOrder}
                    onSort={handleSort}
                    className="text-left"
                  />
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider hidden md:table-cell">
                    Genre
                  </th>
                  <SortableHeader
                    label="Episodes"
                    sortKey="episodes"
                    currentSortBy={sortBy}
                    currentSortOrder={sortOrder}
                    onSort={handleSort}
                    className="text-center hidden sm:table-cell"
                  />
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <SortableHeader
                    label="Rating"
                    sortKey="rating"
                    currentSortBy={sortBy}
                    currentSortOrder={sortOrder}
                    onSort={handleSort}
                    className="text-center"
                  />
                  <SortableHeader
                    label="Year"
                    sortKey="year"
                    currentSortBy={sortBy}
                    currentSortOrder={sortOrder}
                    onSort={handleSort}
                    className="text-center hidden lg:table-cell"
                  />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredItems.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-4 py-12 text-center text-gray-500 dark:text-gray-400">
                      No items found
                    </td>
                  </tr>
                ) : (
                  filteredItems.map((item) => {
                    const TypeIcon = typeConfig[item.type]?.icon || Tv;
                    const typeColor =
                      typeConfig[item.type]?.color || "text-gray-500";
                    const status =
                      statusConfig[item.status] || statusConfig["Completed"];

                    return (
                      <tr
                        key={item.id}
                        onClick={() => setSelectedItem(item)}
                        className="group cursor-pointer border-l-2 border-transparent hover:border-l-blue-500 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all duration-200">
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            {item.imageUrl ? (
                              <img
                                src={item.imageUrl}
                                alt={item.title}
                                className="w-10 h-14 object-cover rounded-md shrink-0"
                              />
                            ) : (
                              <div className="w-10 h-14 bg-gray-200 dark:bg-gray-700 rounded-md flex items-center justify-center shrink-0">
                                <TypeIcon
                                  className={clsx("h-5 w-5", typeColor)}
                                />
                              </div>
                            )}
                            <div className="min-w-0">
                              <p className="font-medium text-gray-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                {item.title}
                              </p>
                              {(() => {
                                const notes = getLocalizedNotes(item);
                                return (
                                  notes && (
                                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[200px]">
                                      {notes.length > 40
                                        ? `${notes.slice(0, 40)}…`
                                        : notes}
                                    </p>
                                  )
                                );
                              })()}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            <TypeIcon className={clsx("h-4 w-4", typeColor)} />
                            <span className="text-sm text-gray-700 dark:text-gray-300">
                              {item.type}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-4 hidden md:table-cell">
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {item.genre || "-"}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-center hidden sm:table-cell">
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {item.totalEpisode || "-"}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-center">
                          <span
                            className={clsx(
                              "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium",
                              status.bgColor,
                              status.color
                            )}>
                            {status.label}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex justify-center">
                            <RatingStars
                              rating={item.rating}
                              locale={locale as "id" | "en"}
                              showLabel
                            />
                          </div>
                        </td>
                        <td className="px-4 py-4 text-center hidden lg:table-cell">
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {item.year || "-"}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Grid View */}
      {viewMode === "grid" && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-5">
          {filteredItems.length === 0 ? (
            <div className="col-span-full py-12 text-center text-gray-500 dark:text-gray-400">
              No items found
            </div>
          ) : (
            filteredItems.map((item) => {
              const TypeIcon = typeConfig[item.type]?.icon || Tv;
              const typeColor = typeConfig[item.type]?.color || "text-gray-500";
              const status =
                statusConfig[item.status] || statusConfig["Completed"];

              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
                  className="group cursor-pointer bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-xl hover:scale-[1.02] hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300">
                  {/* Poster */}
                  <div className="relative aspect-[2/3] overflow-hidden bg-gray-100 dark:bg-gray-900">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center">
                        <TypeIcon
                          className={clsx("h-12 w-12 opacity-30", typeColor)}
                        />
                      </div>
                    )}

                    {/* Rating Badge - Combined */}
                    {item.rating && (
                      <div className="absolute top-2 right-2 flex items-center gap-1.5 px-2 py-1 bg-black/70 backdrop-blur-sm rounded-full">
                        <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                        <span className="text-xs font-bold text-white">
                          {item.rating.toFixed(1)}
                        </span>
                        <span className="text-[9px] font-medium text-amber-300">
                          {
                            getRatingLabel(item.rating, locale as "id" | "en")
                              .label
                          }
                        </span>
                      </div>
                    )}

                    {/* Status Badge */}
                    <div className="absolute bottom-2 left-2">
                      <span
                        className={clsx(
                          "px-2 py-0.5 rounded-full text-[10px] font-medium backdrop-blur-sm",
                          status.bgColor,
                          status.color
                        )}>
                        {status.label}
                      </span>
                    </div>

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>

                  {/* Info */}
                  <div className="p-2.5 sm:p-3">
                    <h3 className="font-medium text-xs sm:text-sm text-gray-900 dark:text-white line-clamp-2 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors leading-tight">
                      {item.title}
                    </h3>
                    <div className="flex items-center gap-1.5 mt-1.5 text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
                      <TypeIcon className={clsx("h-3 w-3", typeColor)} />
                      <span>{item.type}</span>
                      {item.year && (
                        <>
                          <span className="text-gray-300 dark:text-gray-600">
                            •
                          </span>
                          <span>{item.year}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Results count */}
      <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
        Showing {filteredItems.length} of {items.length} items
      </p>

      {/* Detail Modal */}
      {selectedItem &&
        (() => {
          const ModalTypeIcon = typeConfig[selectedItem.type]?.icon || Tv;
          const modalTypeColor =
            typeConfig[selectedItem.type]?.color || "text-gray-500";
          const modalStatus =
            statusConfig[selectedItem.status] || statusConfig["Completed"];

          const localizedNotes = getLocalizedNotes(selectedItem);

          return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              {/* Backdrop */}
              <div
                className="absolute inset-0 bg-black/50 backdrop-blur-md"
                onClick={() => setSelectedItem(null)}
              />

              {/* Modal Card - Modern Glass Design */}
              <div className="relative w-full max-w-lg max-h-[90vh] bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-3xl shadow-2xl animate-in fade-in zoom-in-95 duration-300 border border-gray-200/50 dark:border-gray-700/50 overflow-y-auto">
                {/* Hero Section with Gradient Overlay */}
                <div className="relative h-52">
                  {/* Background Image Container */}
                  <div className="absolute inset-0 overflow-hidden rounded-t-3xl">
                    {selectedItem.imageUrl ? (
                      <>
                        <img
                          src={selectedItem.imageUrl}
                          alt={selectedItem.title}
                          className="w-full h-full object-cover scale-110 blur-sm"
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/50 to-white dark:to-gray-900" />
                      </>
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-gray-200 via-gray-300 to-gray-400 dark:from-gray-700 dark:via-gray-800 dark:to-gray-900">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <ModalTypeIcon
                            className={clsx(
                              "h-20 w-20 opacity-20",
                              modalTypeColor
                            )}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Close Button */}
                  <button
                    onClick={() => setSelectedItem(null)}
                    className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/30 text-white transition-all duration-200 hover:scale-105">
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Floating Elements - Outside hero for proper visibility */}
                <div className="relative">
                  {/* Floating Poster */}
                  <div className="absolute -top-16 left-6">
                    {selectedItem.imageUrl ? (
                      <img
                        src={selectedItem.imageUrl}
                        alt={selectedItem.title}
                        className="w-28 h-40 object-cover rounded-2xl shadow-2xl ring-4 ring-white dark:ring-gray-900"
                      />
                    ) : (
                      <div className="w-28 h-40 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-2xl shadow-2xl ring-4 ring-white dark:ring-gray-900 flex items-center justify-center">
                        <ModalTypeIcon
                          className={clsx(
                            "h-12 w-12 opacity-50",
                            modalTypeColor
                          )}
                        />
                      </div>
                    )}
                  </div>

                  {/* Rating Badge - Compact */}
                  {selectedItem.rating && (
                    <div className="absolute -top-4 right-6 flex flex-col items-center">
                      <div className="flex items-center gap-1.5 bg-amber-500 rounded-full shadow-lg px-3 py-1.5">
                        <Star className="h-4 w-4 fill-white text-white" />
                        <span className="text-sm font-bold text-white">
                          {selectedItem.rating.toFixed(1)}
                        </span>
                      </div>
                      <span className="text-xs font-medium text-gray-600 dark:text-gray-400 mt-1">
                        {
                          getRatingLabel(
                            selectedItem.rating,
                            locale as "id" | "en"
                          ).label
                        }
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="pt-6 pb-6 px-6">
                  {/* Title & Meta - with left padding to avoid poster overlap */}
                  <div className="mb-5 pl-36">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2 leading-tight">
                      {selectedItem.title}
                    </h2>
                    <div className="flex items-center flex-wrap gap-2">
                      {/* Type Badge */}
                      <span
                        className={clsx(
                          "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800",
                          modalTypeColor
                        )}>
                        <ModalTypeIcon className="h-3.5 w-3.5" />
                        {selectedItem.type}
                      </span>
                      {/* Year */}
                      {selectedItem.year && (
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                          {selectedItem.year}
                        </span>
                      )}
                      {/* Status */}
                      <span
                        className={clsx(
                          "px-3 py-1 rounded-full text-xs font-medium",
                          modalStatus.bgColor,
                          modalStatus.color
                        )}>
                        {modalStatus.label}
                      </span>
                    </div>
                  </div>

                  {/* Spacer for poster height */}
                  <div className="h-14" />

                  {/* Info Cards */}
                  {(selectedItem.genre || selectedItem.totalEpisode) && (
                    <div className="flex gap-3 mb-5">
                      {selectedItem.genre && (
                        <div className="flex-1 p-3 rounded-xl bg-gray-100 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
                          <p className="text-[10px] uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-1">
                            Genre
                          </p>
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 line-clamp-2">
                            {selectedItem.genre}
                          </p>
                        </div>
                      )}
                      {selectedItem.totalEpisode && (
                        <div className="p-3 rounded-xl bg-gray-100 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 min-w-[80px]">
                          <p className="text-[10px] uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-1">
                            Episodes
                          </p>
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {selectedItem.totalEpisode}
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Review Section */}
                  <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-1 h-4 rounded-full bg-gradient-to-b from-blue-500 to-purple-500" />
                      <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        {locale === "id" ? "Review Saya" : "My Review"}
                      </p>
                    </div>
                    {localizedNotes ? (
                      <div className="p-4 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100/50 dark:from-gray-800/50 dark:to-gray-800/30">
                        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-wrap">
                          {localizedNotes}
                        </p>
                      </div>
                    ) : (
                      <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/30 text-center">
                        <p className="text-sm text-gray-400 dark:text-gray-600 italic">
                          {locale === "id"
                            ? "Belum ada review untuk judul ini"
                            : "No review written for this title"}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })()}
    </div>
  );
}
