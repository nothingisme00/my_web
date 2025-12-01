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
  MessageSquare,
  Tag,
  Hash,
} from "lucide-react";
import { clsx } from "clsx";
import { SelectCompact } from "@/components/ui/SelectCompact";

interface WatchlistItem {
  id: string;
  title: string;
  type: string;
  genre: string | null;
  totalEpisode: number | null;
  status: string;
  rating: number | null;
  notes: string | null;
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

function RatingStars({ rating }: { rating: number | null }) {
  if (!rating) return <span className="text-gray-400 text-sm">-</span>;

  const fullStars = Math.floor(rating / 2);
  const hasHalfStar = rating % 2 >= 1;

  return (
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
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">
        {rating.toFixed(1)}
      </span>
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
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterGenre, setFilterGenre] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("rating");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [selectedItem, setSelectedItem] = useState<WatchlistItem | null>(null);

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

      {/* Filters - Simplified */}
      <div className="bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search title or genre..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Filter Dropdowns */}
          <div className="flex gap-2 flex-wrap sm:flex-nowrap">
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
              className="w-full sm:w-auto sm:min-w-[130px]"
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
              className="w-full sm:w-auto sm:min-w-[130px]"
            />

            {/* Type Filter */}
            <SelectCompact
              value={filterType}
              onChange={setFilterType}
              options={[
                { value: "all", label: "All Types" },
                ...uniqueTypes.map((type) => ({ value: type, label: type })),
              ]}
              className="w-full sm:w-auto sm:min-w-[120px]"
            />
          </div>
        </div>
      </div>

      {/* Table */}
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
                            {item.notes && (
                              <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[200px]">
                                {item.notes.length > 40
                                  ? `${item.notes.slice(0, 40)}…`
                                  : item.notes}
                              </p>
                            )}
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
                          <RatingStars rating={item.rating} />
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

          return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              {/* Backdrop */}
              <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={() => setSelectedItem(null)}
              />

              {/* Modal Card */}
              <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-800 rounded-2xl shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                {/* Close Button */}
                <button
                  onClick={() => setSelectedItem(null)}
                  className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors">
                  <X className="h-5 w-5" />
                </button>

                {/* Header with Poster */}
                <div className="relative h-48 bg-gradient-to-br from-gray-800 to-gray-900">
                  {selectedItem.imageUrl ? (
                    <>
                      <img
                        src={selectedItem.imageUrl}
                        alt={selectedItem.title}
                        className="w-full h-full object-cover opacity-40"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent" />
                    </>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <ModalTypeIcon
                        className={clsx("h-20 w-20 opacity-20", modalTypeColor)}
                      />
                    </div>
                  )}

                  {/* Title overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <ModalTypeIcon
                        className={clsx("h-5 w-5", modalTypeColor)}
                      />
                      <span className="text-sm font-medium text-gray-300">
                        {selectedItem.type}
                      </span>
                      {selectedItem.year && (
                        <>
                          <span className="text-gray-500">•</span>
                          <span className="text-sm text-gray-300">
                            {selectedItem.year}
                          </span>
                        </>
                      )}
                    </div>
                    <h2 className="text-2xl font-bold text-white">
                      {selectedItem.title}
                    </h2>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-5">
                  {/* Status & Rating Row */}
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <span
                      className={clsx(
                        "inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium",
                        modalStatus.bgColor,
                        modalStatus.color
                      )}>
                      {modalStatus.label}
                    </span>
                    {selectedItem.rating && (
                      <div className="flex items-center gap-1">
                        <div className="flex">
                          {[...Array(10)].map((_, i) => (
                            <Star
                              key={i}
                              className={clsx(
                                "h-4 w-4",
                                i < selectedItem.rating!
                                  ? "fill-amber-400 text-amber-400"
                                  : "text-gray-300 dark:text-gray-600"
                              )}
                            />
                          ))}
                        </div>
                        <span className="text-lg font-bold text-amber-500 ml-2">
                          {selectedItem.rating}/10
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Info Grid */}
                  {(selectedItem.genre || selectedItem.totalEpisode) && (
                    <div className="grid grid-cols-2 gap-4">
                      {selectedItem.genre && (
                        <div className="flex items-start gap-2">
                          <Tag className="h-4 w-4 text-gray-400 mt-0.5 shrink-0" />
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Genre
                            </p>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {selectedItem.genre}
                            </p>
                          </div>
                        </div>
                      )}
                      {selectedItem.totalEpisode && (
                        <div className="flex items-start gap-2">
                          <Hash className="h-4 w-4 text-gray-400 mt-0.5 shrink-0" />
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Episodes
                            </p>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {selectedItem.totalEpisode}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Notes/Review */}
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2 mb-3">
                      <MessageSquare className="h-4 w-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        My Review
                      </span>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4">
                      {selectedItem.notes ? (
                        <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
                          {selectedItem.notes}
                        </p>
                      ) : (
                        <p className="text-sm text-gray-400 dark:text-gray-500 italic text-center py-2">
                          No review written for this title
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}
    </div>
  );
}
