import { getMedia } from "@/lib/actions";
import MediaGallery from "@/components/admin/MediaGallery";
import { Media } from "@prisma/client";

export const dynamic = "force-dynamic";

export default async function MediaPage() {
  const media: Media[] = await getMedia();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Media Library
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Manage your uploaded images and assets.
        </p>
      </div>

      <MediaGallery initialMedia={media} />
    </div>
  );
}
