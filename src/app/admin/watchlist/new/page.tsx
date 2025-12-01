import { WatchlistForm } from "@/components/watchlist/WatchlistForm";

export default function NewWatchlistPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Add to Watchlist
        </h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Add a new anime, film, or series to your watchlist
        </p>
      </div>

      <WatchlistForm />
    </div>
  );
}
