import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { WatchlistForm } from "@/components/watchlist/WatchlistForm";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditWatchlistPage({ params }: Props) {
  const { id } = await params;

  const item = await prisma.watchlist.findUnique({
    where: { id },
  });

  if (!item) {
    notFound();
  }

  const initialData = {
    id: item.id,
    title: item.title,
    type: item.type,
    genre: item.genre || "",
    totalEpisode: item.totalEpisode?.toString() || "",
    status: item.status,
    rating: item.rating?.toString() || "",
    notesId: item.notesId || "",
    notesEn: item.notesEn || "",
    imageUrl: item.imageUrl || "",
    year: item.year?.toString() || "",
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Edit Watchlist Item
        </h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Update details for &quot;{item.title}&quot;
        </p>
      </div>

      <WatchlistForm initialData={initialData} isEdit />
    </div>
  );
}
