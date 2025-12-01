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
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">
                  Title
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">
                  Type
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase hidden md:table-cell">
                  Genre
                </th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">
                  Status
                </th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">
                  Rating
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {items.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-12 text-center text-gray-500 dark:text-gray-400">
                    <Tv className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>No watchlist items yet</p>
                    <Link
                      href="/admin/watchlist/new"
                      className="text-blue-600 hover:underline mt-2 inline-block">
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
                      className="hover:bg-gray-50 dark:hover:bg-gray-900/50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {item.imageUrl ? (
                            <img
                              src={item.imageUrl}
                              alt={item.title}
                              className="w-10 h-14 object-cover rounded"
                            />
                          ) : (
                            <div className="w-10 h-14 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center">
                              <TypeIcon className="h-5 w-5 text-gray-400" />
                            </div>
                          )}
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {item.title}
                            </p>
                            {item.year && (
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {item.year}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <TypeIcon className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            {item.type}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {item.genre || "-"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={clsx(
                            "inline-flex px-2.5 py-1 rounded-full text-xs font-medium",
                            statusColors[item.status] ||
                              statusColors["Completed"]
                          )}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        {item.rating ? (
                          <div className="flex items-center justify-center gap-1">
                            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              {item.rating.toFixed(1)}
                            </span>
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/admin/watchlist/${item.id}/edit`}>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeleteId(item.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20">
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
