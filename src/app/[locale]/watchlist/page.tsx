import { prisma } from "@/lib/prisma";
import { WatchlistTable } from "@/components/watchlist/WatchlistTable";
import { Tv } from "lucide-react";
import { isPageEnabled } from "@/lib/page-visibility";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Watchlist | Anime & Film",
  description: "My personal anime and film watchlist with ratings",
};

export default async function WatchlistPage() {
  // Check if page is enabled
  const pageEnabled = await isPageEnabled("page_watchlist");
  if (!pageEnabled) {
    notFound();
  }

  const items = await prisma.watchlist.findMany({
    orderBy: [{ rating: "desc" }, { createdAt: "desc" }],
  });

  // Serialize dates for client component
  const serializedItems = items.map((item) => ({
    ...item,
    notesId: item.notesId,
    notesEn: item.notesEn,
    completedAt: item.completedAt?.toISOString() || null,
    createdAt: item.createdAt.toISOString(),
    updatedAt: item.updatedAt.toISOString(),
  }));

  return (
    <div className="min-h-screen">
      {/* Compact Minimal Hero */}
      <section className="relative -mt-24 pt-32 pb-8">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-pink-100 dark:bg-pink-900/30">
              <Tv className="h-4 w-4 text-pink-600 dark:text-pink-400" />
            </div>
            <span className="text-sm font-medium text-pink-600 dark:text-pink-400">
              Watchlist
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            My Anime & Film List
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-lg">
            A collection of anime, films, and series I&apos;ve watched with
            personal ratings
          </p>
          {/* Subtle gradient line */}
          <div className="mt-6 h-px bg-gradient-to-r from-pink-500/50 via-purple-500/50 to-transparent max-w-xs" />
        </div>
      </section>

      {/* Content Section */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-8 lg:py-12">
        {items.length === 0 ? (
          <div className="text-center py-20">
            <Tv className="mx-auto h-16 w-16 text-gray-300 dark:text-gray-600" />
            <p className="mt-4 text-gray-500 dark:text-gray-400">
              No watchlist items yet
            </p>
          </div>
        ) : (
          <WatchlistTable items={serializedItems} />
        )}
      </div>
    </div>
  );
}
