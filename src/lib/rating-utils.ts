/**
 * Rating utility functions for watchlist
 *
 * Rating Scale:
 * - 9.0-10:   Masterpiece / Sempurna
 * - 8.4-<9.0: Highly Recommended / Sangat Direkomendasikan
 * - 7.5-<8.4: Very Good / Sangat Bagus
 * - 6.0-<7.5: Good / Bagus
 * - 4.0-<6.0: Average / Biasa Saja
 * - <4.0:     Poor / Kurang
 */

export interface RatingLabel {
  label: string;
  color: string;
  description?: string;
}

export function getRatingLabel(
  rating: number,
  locale: "id" | "en" = "en"
): RatingLabel {
  if (rating >= 9.0) {
    return {
      label: locale === "id" ? "Sempurna" : "Masterpiece",
      color:
        "text-amber-600 bg-amber-50 dark:bg-amber-900/30 border-amber-200 dark:border-amber-700",
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

/**
 * Get short rating label for compact displays
 */
export function getShortRatingLabel(
  rating: number,
  locale: "id" | "en" = "en"
): string {
  if (rating >= 9.0) return locale === "id" ? "Sempurna" : "Masterpiece";
  if (rating >= 8.4) return locale === "id" ? "Top!" : "Highly Rec.";
  if (rating >= 7.5) return locale === "id" ? "Bagus!" : "Very Good";
  if (rating >= 6.0) return locale === "id" ? "Bagus" : "Good";
  if (rating >= 4.0) return locale === "id" ? "Biasa" : "Average";
  return locale === "id" ? "Kurang" : "Poor";
}
