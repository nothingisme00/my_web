/**
 * Utility functions for the blog
 */

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combine class names with tailwind-merge
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Calculate reading time based on word count
 * Average reading speed: 200 words per minute
 */
export function calculateReadingTime(content: string): number {
  // Remove HTML tags
  const text = content.replace(/<[^>]*>/g, "");

  // Count words
  const words = text.trim().split(/\s+/).length;

  // Calculate minutes (round up)
  const minutes = Math.ceil(words / 200);

  // Return at least 1 minute
  return Math.max(1, minutes);
}

/**
 * Format date to Indonesian locale
 */
export function formatDate(
  date: Date | string,
  locale: string = "id-ID"
): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;

  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(dateObj);
}

/**
 * Format date to relative time (e.g., "2 days ago")
 */
export function formatRelativeTime(
  date: Date | string,
  _locale: string = "id-ID"
): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);

  const intervals = {
    tahun: 31536000,
    bulan: 2592000,
    minggu: 604800,
    hari: 86400,
    jam: 3600,
    menit: 60,
  };

  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    const interval = Math.floor(diffInSeconds / secondsInUnit);
    if (interval >= 1) {
      return `${interval} ${unit} yang lalu`;
    }
  }

  return "Baru saja";
}

/**
 * Truncate text to a specific length
 */
export function truncateText(text: string, length: number = 100): string {
  if (text.length <= length) return text;

  // Truncate and add ellipsis
  return text.substring(0, length).trim() + "...";
}

/**
 * Strip HTML tags from content
 */
export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "");
}

/**
 * Generate excerpt from content if not provided
 */
export function generateExcerpt(
  content: string,
  maxLength: number = 160
): string {
  const text = stripHtml(content);
  return truncateText(text, maxLength);
}

/**
 * Format view count to readable format (1K, 1M, etc)
 */
export function formatViewCount(count: number): string {
  if (count >= 1000000) {
    return (count / 1000000).toFixed(1) + "M";
  }
  if (count >= 1000) {
    return (count / 1000).toFixed(1) + "K";
  }
  return count.toString();
}

/**
 * Create URL-friendly slug from text
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/--+/g, "-") // Replace multiple hyphens with single hyphen
    .trim();
}
