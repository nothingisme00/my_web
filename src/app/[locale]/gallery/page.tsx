import { getGalleryPhotos, getGalleryCategories } from '@/lib/actions';
import GalleryGrid from '@/components/gallery/GalleryGrid';
import { Camera } from 'lucide-react';

export const metadata = {
  title: 'Gallery | Photography',
  description: 'A collection of my photography work',
};

export default async function GalleryPage() {
  const [photos, categories] = await Promise.all([
    getGalleryPhotos(),
    getGalleryCategories(),
  ]);

  return (
    <div className="min-h-screen py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 dark:bg-blue-900/30 px-4 py-2 text-sm font-medium text-blue-700 dark:text-blue-400 mb-4">
            <Camera className="h-4 w-4" />
            Photography
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl mb-4">
            Gallery
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            A collection of moments captured through my lens
          </p>
        </div>

        {photos.length === 0 ? (
          <div className="text-center py-20">
            <Camera className="mx-auto h-16 w-16 text-gray-300 dark:text-gray-600" />
            <p className="mt-4 text-gray-500 dark:text-gray-400">No photos yet</p>
          </div>
        ) : (
          <GalleryGrid photos={photos} categories={categories} />
        )}
      </div>
    </div>
  );
}
