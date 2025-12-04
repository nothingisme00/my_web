"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import {
  Plus,
  Trash2,
  Edit,
  Star,
  Tv,
  Film,
  PlayCircle,
  Loader2,
} from "lucide-react";
import { clsx } from "clsx";
import { DeleteConfirmModal } from "@/components/admin/DeleteConfirmModal";

// Rating label system
function getRatingLabel(rating: number): { label: string; color: string } {
  if (rating >= 9.0) {
    return {
      label: "Masterpiece",
      color:
        "text-amber-600 bg-amber-50 dark:bg-amber-900/30 border-amber-200 dark:border-amber-700",
    };
  } else if (rating >= 8.4) {
    return {
      label: "Highly Rec.",
      color:
        "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-700",
    };
  } else if (rating >= 7.5) {
    return {
      label: "Very Good",
      color:
        "text-blue-600 bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-700",
    };
  } else if (rating >= 6.0) {
    return {
      label: "Good",
      color:
        "text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 border-indigo-200 dark:border-indigo-700",
    };
  } else if (rating >= 4.0) {
    return {
      label: "Average",
      color:
        "text-gray-600 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600",
    };
  } else {
    return {
      label: "Poor",
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
  notes: string | null;
  imageUrl: string | null;
  year: number | null;
}

const statusColors: Record<string, string> = {
  Watching: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  Completed:
    "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  Dropped: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  "On Hold":
    "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  "Plan to Watch":
    "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
};

const typeIcons: Record<string, typeof Tv> = {
  Anime: Tv,
  Film: Film,
  Series: PlayCircle,
  Donghua: Tv,
};

export default function AdminWatchlistPage() {
  const [items, setItems] = useState<WatchlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchItems();
  }, []);

  async function fetchItems() {
    try {
      const res = await fetch("/api/watchlist");
      const data = await res.json();
      setItems(data);
    } catch (error) {
      console.error("Error fetching watchlist:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDelete() {
    if (!deleteId) return;
    setIsDeleting(true);

    try {
      const res = await fetch(`/api/watchlist/${deleteId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setItems(items.filter((item) => item.id !== deleteId));
      }
    } catch (error) {
      console.error("Error deleting item:", error);
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Watchlist
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Manage your anime and film watchlist
          </p>
        </div>
        <Link href="/admin/watchlist/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" /> Add Item
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">Total</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {items.length}
          </p>
        </div>
        {Object.keys(statusColors).map((status) => (
          <div
            key={status}
            className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">{status}</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {items.filter((i) => i.status === status).length}
            </p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800/80 backdrop-blur-sm rounded-xl border border-gray-200/80 dark:border-gray-700/50 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="px-5 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-5 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-5 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider hidden md:table-cell">
                  Genre
                </th>
                <th className="px-5 py-4 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-5 py-4 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                  Rating
                </th>
                <th className="px-5 py-4 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
              {items.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-16 text-center">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gray-100 dark:bg-gray-800 mb-4">
                      <Tv className="h-6 w-6 text-gray-400" />
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                      No watchlist items yet
                    </p>
                    <Link
                      href="/admin/watchlist/new"
                      className="text-sm text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 font-medium">
                      Add your first item
                    </Link>
                  </td>
                </tr>
              ) : (
                items.map((item) => {
                  const TypeIcon = typeIcons[item.type] || Tv;
                  return (
                    <tr
                      key={item.id}
                      className="group hover:bg-gray-50/80 dark:hover:bg-gray-700/20 transition-all duration-150">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          {item.imageUrl ? (
                            <img
                              src={item.imageUrl}
                              alt={item.title}
                              className="w-10 h-14 object-cover rounded-md shadow-sm"
                            />
                          ) : (
                            <div className="w-10 h-14 bg-gray-100 dark:bg-gray-700 rounded-md flex items-center justify-center">
                              <TypeIcon className="h-5 w-5 text-gray-400" />
                            </div>
                          )}
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                              {item.title}
                            </p>
                            {item.year && (
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                {item.year}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <TypeIcon className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            {item.type}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-4 hidden md:table-cell">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {item.genre || "-"}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-center">
                        <span
                          className={clsx(
                            "inline-flex px-2.5 py-1 rounded-md text-xs font-medium border",
                            item.status === "Watching" &&
                              "bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800/50",
                            item.status === "Completed" &&
                              "bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800/50",
                            item.status === "Dropped" &&
                              "bg-red-50 text-red-700 border-red-100 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800/50",
                            item.status === "On Hold" &&
                              "bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800/50",
                            item.status === "Plan to Watch" &&
                              "bg-violet-50 text-violet-700 border-violet-100 dark:bg-violet-900/30 dark:text-violet-300 dark:border-violet-800/50"
                          )}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-center">
                        {item.rating ? (
                          <div className="flex flex-col items-center gap-1">
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                              <span className="text-sm font-semibold text-gray-900 dark:text-white tabular-nums">
                                {item.rating.toFixed(1)}
                              </span>
                            </div>
                            <span
                              className={clsx(
                                "text-[10px] font-medium px-1.5 py-0.5 rounded border",
                                getRatingLabel(item.rating).color
                              )}>
                              {getRatingLabel(item.rating).label}
                            </span>
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
                          <Link href={`/admin/watchlist/${item.id}/edit`}>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 dark:text-gray-400 dark:hover:text-indigo-400 dark:hover:bg-indigo-900/30">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setDeleteId(item.id)}
                            className="h-8 w-8 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:text-gray-400 dark:hover:text-red-400 dark:hover:bg-red-900/30">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Modal */}
      <DeleteConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Watchlist Item"
        description="Are you sure you want to delete this item? This action cannot be undone."
        isDeleting={isDeleting}
      />
    </div>
  );
}
