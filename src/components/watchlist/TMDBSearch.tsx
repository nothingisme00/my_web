"use client";

import { useState, useEffect, useRef } from "react";
import { Search, Loader2, X, Film, Tv } from "lucide-react";
import { clsx } from "clsx";

interface TMDBResult {
  id: number;
  title: string;
  originalTitle: string;
  year: string;
  posterUrl: string | null;
  overview: string;
  rating: number | null;
  mediaType: "movie" | "tv";
}

interface TMDBDetails {
  id: number;
  title: string;
  year: string;
  posterUrl: string | null;
  genres: string;
  totalEpisodes: number | null;
  rating: number | null;
}

interface TMDBSearchProps {
  type: string;
  onSelect: (data: {
    title: string;
    year: string;
    imageUrl: string;
    genre: string;
    totalEpisode: string;
  }) => void;
}

export function TMDBSearch({ type, onSelect }: TMDBSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<TMDBResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounced search
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (query.length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `/api/tmdb/search?query=${encodeURIComponent(query)}&type=${type}`
        );
        const data = await res.json();

        if (data.error) {
          setError(data.error);
          setResults([]);
        } else {
          setResults(data.results || []);
          setIsOpen(true);
        }
      } catch {
        setError("Failed to search");
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 500);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query, type]);

  async function handleSelect(item: TMDBResult) {
    setIsLoading(true);
    try {
      // Fetch detailed info
      const res = await fetch(
        `/api/tmdb/details?id=${item.id}&type=${item.mediaType}`
      );
      const details: TMDBDetails = await res.json();

      onSelect({
        title: details.title || item.title,
        year: details.year || item.year,
        imageUrl: details.posterUrl || item.posterUrl || "",
        genre: details.genres || "",
        totalEpisode: details.totalEpisodes?.toString() || "",
      });

      setQuery("");
      setResults([]);
      setIsOpen(false);
    } catch {
      // Fallback to basic info if details fail
      onSelect({
        title: item.title,
        year: item.year,
        imageUrl: item.posterUrl || "",
        genre: "",
        totalEpisode: "",
      });
      setQuery("");
      setResults([]);
      setIsOpen(false);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div ref={containerRef} className="relative">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Search TMDB
      </label>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search movies or TV shows..."
          className="w-full pl-10 pr-10 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {isLoading && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 animate-spin" />
        )}
        {query && !isLoading && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setResults([]);
              setIsOpen(false);
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600">
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}

      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
        Data from TMDB • Select to auto-fill title, year, poster & genre
      </p>

      {/* Results Dropdown */}
      {isOpen && results.length > 0 && (
        <div className="absolute z-50 mt-1 w-full bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-xl max-h-96 overflow-y-auto">
          {results.map((item) => (
            <button
              key={`${item.mediaType}-${item.id}`}
              type="button"
              onClick={() => handleSelect(item)}
              className="w-full flex items-start gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left border-b border-gray-100 dark:border-gray-700 last:border-0">
              {/* Poster */}
              {item.posterUrl ? (
                <img
                  src={item.posterUrl}
                  alt={item.title}
                  className="w-12 h-18 object-cover rounded flex-shrink-0"
                />
              ) : (
                <div className="w-12 h-18 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center flex-shrink-0">
                  {item.mediaType === "movie" ? (
                    <Film className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Tv className="h-5 w-5 text-gray-400" />
                  )}
                </div>
              )}

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900 dark:text-white truncate">
                    {item.title}
                  </span>
                  {item.year && (
                    <span className="text-sm text-gray-500 dark:text-gray-400 flex-shrink-0">
                      ({item.year})
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 mt-1">
                  <span
                    className={clsx(
                      "px-1.5 py-0.5 text-xs rounded",
                      item.mediaType === "movie"
                        ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                        : "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
                    )}>
                    {item.mediaType === "movie" ? "Movie" : "TV"}
                  </span>
                  {item.rating && (
                    <span className="text-xs text-amber-600 dark:text-amber-400">
                      ★ {item.rating}
                    </span>
                  )}
                </div>

                {item.overview && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                    {item.overview}
                  </p>
                )}
              </div>
            </button>
          ))}
        </div>
      )}

      {isOpen && query.length >= 2 && results.length === 0 && !isLoading && (
        <div className="absolute z-50 mt-1 w-full bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-xl p-4 text-center text-gray-500 dark:text-gray-400">
          No results found for &quot;{query}&quot;
        </div>
      )}
    </div>
  );
}
