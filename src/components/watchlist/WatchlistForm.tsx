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
  Languages,
} from "lucide-react";
import Link from "next/link";
import { clsx } from "clsx";

// Rating label system
function getRatingLabel(
  rating: number,
  locale: "id" | "en" = "en"
): { label: string; color: string; description: string } {
  if (rating >= 9.0) {
    return {
      label: locale === "id" ? "Sempurna" : "Masterpiece",
      color:
        "text-amber-500 bg-amber-50 dark:bg-amber-900/30 border-amber-200 dark:border-amber-700",
      description:
        locale === "id"
          ? "Wajib tonton seumur hidup"
          : "Must watch in a lifetime",
    };
  } else if (rating >= 8.4) {
    return {
      label: locale === "id" ? "Sangat Direkomendasikan" : "Highly Recommended",
      color:
        "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-700",
      description:
        locale === "id"
          ? "Sangat bagus, hampir sempurna"
          : "Excellent, nearly perfect",
    };
  } else if (rating >= 7.5) {
    return {
      label: locale === "id" ? "Sangat Bagus" : "Very Good",
      color:
        "text-blue-600 bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-700",
      description:
        locale === "id"
          ? "Tontonan solid, memuaskan"
          : "Solid watch, satisfying",
    };
  } else if (rating >= 6.0) {
    return {
      label: locale === "id" ? "Bagus" : "Good",
      color:
        "text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 border-indigo-200 dark:border-indigo-700",
      description:
        locale === "id"
          ? "Layak ditonton, menghibur"
          : "Worth watching, entertaining",
    };
  } else if (rating >= 4.0) {
    return {
      label: locale === "id" ? "Biasa Saja" : "Average",
      color:
        "text-gray-600 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600",
      description:
        locale === "id"
          ? "Tidak jelek, tapi tidak spesial"
          : "Not bad, but not special",
    };
  } else {
    return {
      label: locale === "id" ? "Kurang" : "Poor",
      color:
        "text-red-600 bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-700",
      description: locale === "id" ? "Skip saja" : "Skip it",
    };
  }
}

interface WatchlistFormData {
  title: string;
  type: string;
  genre: string;
  totalEpisode: string;
  status: string;
  rating: string;
  notesId: string;
  notesEn: string;
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
  const [isTranslating, setIsTranslating] = useState(false);
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);
  const [formData, setFormData] = useState<WatchlistFormData>({
    title: initialData?.title || "",
    type: initialData?.type || "Anime",
    genre: initialData?.genre || "",
    totalEpisode: initialData?.totalEpisode || "",
    status: initialData?.status || "Completed",
    rating: initialData?.rating || "",
    notesId: initialData?.notesId || "",
    notesEn: initialData?.notesEn || "",
    imageUrl: initialData?.imageUrl || "",
    year: initialData?.year || "",
  });

  // Auto-translate Indonesian to English
  async function translateToEnglish(text: string) {
    if (!text.trim()) return;

    setIsTranslating(true);
    try {
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ text }),
      });

      const data = await res.json();
      if (res.ok && data.translatedText) {
        setFormData((prev) => ({ ...prev, notesEn: data.translatedText }));
      }
    } catch (error) {
      console.error("Translation failed:", error);
    } finally {
      setIsTranslating(false);
    }
  }

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

            {/* Rating with Slider */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Rating <span className="text-red-500">*</span>
              </label>

              {/* Star Display */}
              <div className="flex items-center gap-4 mb-3">
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() =>
                        setFormData({ ...formData, rating: value.toString() })
                      }
                      className="p-0.5 transition-transform hover:scale-110">
                      <Star
                        className={clsx(
                          "h-5 w-5 transition-colors",
                          value <= displayRating
                            ? "fill-amber-400 text-amber-400"
                            : value - 0.5 <= displayRating
                            ? "fill-amber-400/50 text-amber-400"
                            : "text-gray-300 dark:text-gray-600"
                        )}
                      />
                    </button>
                  ))}
                </div>
                <span className="text-lg font-bold text-gray-900 dark:text-white min-w-[3rem]">
                  {displayRating > 0 ? displayRating.toFixed(1) : "-"}
                </span>
              </div>

              {/* Rating Slider */}
              <div className="space-y-2">
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="0.1"
                  value={formData.rating || 0}
                  onChange={(e) =>
                    setFormData({ ...formData, rating: e.target.value })
                  }
                  onMouseEnter={() =>
                    setHoveredRating(parseFloat(formData.rating) || null)
                  }
                  onMouseLeave={() => setHoveredRating(null)}
                  className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span>0</span>
                  <span>2</span>
                  <span>4</span>
                  <span>6</span>
                  <span>8</span>
                  <span>10</span>
                </div>
              </div>

              {/* Rating Label Badge */}
              {displayRating > 0 && (
                <div className="mt-3 flex items-center gap-3">
                  <span
                    className={clsx(
                      "inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold border",
                      getRatingLabel(displayRating, "en").color
                    )}>
                    {getRatingLabel(displayRating, "en").label}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {getRatingLabel(displayRating, "en").description}
                  </span>
                </div>
              )}

              {/* Clear button */}
              {currentRating > 0 && (
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, rating: "" })}
                  className="mt-2 text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 underline">
                  Clear rating
                </button>
              )}

              <input
                type="hidden"
                name="rating"
                value={formData.rating}
                required
              />
            </div>
          </div>

          {/* Notes - Bilingual */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Review (ID) <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.notesId}
                onChange={(e) =>
                  setFormData({ ...formData, notesId: e.target.value })
                }
                onBlur={() => {
                  if (formData.notesId && formData.notesId.trim()) {
                    translateToEnglish(formData.notesId);
                  }
                }}
                rows={3}
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                placeholder="Tulis review dalam Bahasa Indonesia..."
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Akan otomatis diterjemahkan ke Inggris
              </p>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Review (EN)
                </label>
                {isTranslating && (
                  <span className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400">
                    <Languages className="h-3 w-3 animate-pulse" />
                    Translating...
                  </span>
                )}
              </div>
              <textarea
                value={formData.notesEn}
                onChange={(e) =>
                  setFormData({ ...formData, notesEn: e.target.value })
                }
                rows={3}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                placeholder="Automatically translated from Indonesian..."
              />
            </div>
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
