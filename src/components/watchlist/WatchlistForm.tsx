"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { SelectCompact } from "@/components/ui/SelectCompact";
import { TMDBSearch } from "@/components/watchlist/TMDBSearch";
import {
  Save,
  Loader2,
  Star,
  ArrowLeft,
  Calendar,
  Film,
  Tag,
} from "lucide-react";
import Link from "next/link";
import { clsx } from "clsx";

interface WatchlistFormData {
  title: string;
  type: string;
  genre: string;
  totalEpisode: string;
  status: string;
  rating: string;
  notes: string;
  imageUrl: string;
  year: string;
}

interface WatchlistFormProps {
  initialData?: WatchlistFormData & { id?: string };
  isEdit?: boolean;
}

const types = ["Anime", "Film", "Series", "Donghua"];
const statuses = [
  "Watching",
  "Completed",
  "Dropped",
  "On Hold",
  "Plan to Watch",
];

export function WatchlistForm({
  initialData,
  isEdit = false,
}: WatchlistFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);
  const [formData, setFormData] = useState<WatchlistFormData>({
    title: initialData?.title || "",
    type: initialData?.type || "Anime",
    genre: initialData?.genre || "",
    totalEpisode: initialData?.totalEpisode || "",
    status: initialData?.status || "Completed",
    rating: initialData?.rating || "",
    notes: initialData?.notes || "",
    imageUrl: initialData?.imageUrl || "",
    year: initialData?.year || "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const url = isEdit
        ? `/api/watchlist/${initialData?.id}`
        : "/api/watchlist";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        router.push("/admin/watchlist");
        router.refresh();
      } else {
        const error = await res.json();
        alert(error.error || "Failed to save");
      }
    } catch (error) {
      console.error("Error saving:", error);
      alert("Failed to save");
    } finally {
      setIsSubmitting(false);
    }
  }

  const currentRating = formData.rating ? parseFloat(formData.rating) : 0;
  const displayRating = hoveredRating !== null ? hoveredRating : currentRating;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Back Link */}
      <Link
        href="/admin/watchlist"
        className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Watchlist
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form - Left Side */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 space-y-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {isEdit ? "Edit Item" : "Add New Item"}
          </h2>

          {/* TMDB Search */}
          <TMDBSearch
            type={formData.type}
            onSelect={(data) => {
              setFormData({
                ...formData,
                title: data.title,
                year: data.year,
                imageUrl: data.imageUrl,
                genre: data.genre || formData.genre,
                totalEpisode: data.totalEpisode || formData.totalEpisode,
              });
            }}
          />

          {/* Info from TMDB - Read Only Display */}
          {(formData.title ||
            formData.year ||
            formData.genre ||
            formData.totalEpisode) && (
            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 space-y-3">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                Data from TMDB
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {formData.year && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Year
                      </p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {formData.year}
                      </p>
                    </div>
                  </div>
                )}
                {formData.totalEpisode && (
                  <div className="flex items-center gap-2">
                    <Film className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Episodes
                      </p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {formData.totalEpisode}
                      </p>
                    </div>
                  </div>
                )}
                {formData.genre && (
                  <div className="col-span-2 flex items-start gap-2">
                    <Tag className="h-4 w-4 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Genre
                      </p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {formData.genre}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
              Fill in details below:
            </p>
          </div>

          {/* Title */}
          <Input
            label="Title"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            placeholder="Enter title or search TMDB above"
            required
          />

          {/* Type */}
          <SelectCompact
            label="Type"
            value={formData.type}
            onChange={(value) => setFormData({ ...formData, type: value })}
            options={types.map((type) => ({ value: type, label: type }))}
          />

          {/* Status & Rating Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SelectCompact
              label="Status"
              value={formData.status}
              onChange={(value) => setFormData({ ...formData, status: value })}
              options={statuses.map((status) => ({
                value: status,
                label: status,
              }))}
            />

            {/* Rating */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Rating
              </label>
              <div className="flex items-center gap-3">
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
                    <button
                      key={value}
                      type="button"
                      onMouseEnter={() => setHoveredRating(value)}
                      onMouseLeave={() => setHoveredRating(null)}
                      onClick={() =>
                        setFormData({ ...formData, rating: value.toString() })
                      }
                      className="p-0.5 transition-transform hover:scale-110">
                      <Star
                        className={clsx(
                          "h-5 w-5 transition-colors",
                          value <= displayRating
                            ? "fill-amber-400 text-amber-400"
                            : "text-gray-300 dark:text-gray-600"
                        )}
                      />
                    </button>
                  ))}
                </div>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  {displayRating > 0 ? `${displayRating}/10` : "-"}
                </span>
                {currentRating > 0 && (
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, rating: "" })}
                    className="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                    Clear
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Notes (optional)
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              rows={4}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              placeholder="Your thoughts or review..."
            />
          </div>
        </div>

        {/* Sidebar - Right Side */}
        <div className="space-y-6">
          {/* Image Preview Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
              Cover Image
            </h3>

            {/* Preview Image */}
            {formData.imageUrl ? (
              <div className="aspect-[2/3] w-full bg-gray-100 dark:bg-gray-900 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                <img
                  src={formData.imageUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="150"><rect fill="%23374151" width="100" height="150"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="%236B7280" font-size="12">No Image</text></svg>';
                  }}
                />
              </div>
            ) : (
              <div className="aspect-[2/3] w-full bg-gray-100 dark:bg-gray-900 rounded-lg flex items-center justify-center border border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-400">No image</p>
              </div>
            )}

            <Input
              label="Image URL"
              type="url"
              value={formData.imageUrl}
              onChange={(e) =>
                setFormData({ ...formData, imageUrl: e.target.value })
              }
              placeholder="https://..."
              helperText="Cover/poster image URL"
            />
          </div>

          {/* Actions Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
              Actions
            </h3>

            <div className="space-y-3">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full gap-2">
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    {isEdit ? "Update" : "Save"}
                  </>
                )}
              </Button>

              <Link href="/admin/watchlist" className="block">
                <Button type="button" variant="outline" className="w-full">
                  Cancel
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
