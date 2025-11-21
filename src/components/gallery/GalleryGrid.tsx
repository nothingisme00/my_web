'use client';

import { useState } from 'react';
import { X, Calendar, Tag } from 'lucide-react';

interface Photo {
  id: string;
  title: string;
  description: string | null;
  filename: string;
  category: string | null;
  takenAt: Date | null;
  createdAt: Date;
}

interface GalleryGridProps {
  photos: Photo[];
  categories: string[];
}

export default function GalleryGrid({ photos, categories }: GalleryGridProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  const filteredPhotos = activeCategory
    ? photos.filter((p) => p.category === activeCategory)
    : photos;

  return (
    <>
      {/* Category Filter */}
      {categories.length > 0 && (
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          <button
            onClick={() => setActiveCategory(null)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeCategory === null
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeCategory === cat
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Masonry Grid */}
      <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
        {filteredPhotos.map((photo) => (
          <div
            key={photo.id}
            className="break-inside-avoid cursor-pointer group"
            onClick={() => setSelectedPhoto(photo)}
          >
            <div className="relative overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800">
              <img
                src={`/gallery/${photo.filename}`}
                alt={photo.title}
                className="w-full h-auto object-cover img-zoom"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-white font-semibold text-lg line-clamp-1">
                    {photo.title}
                  </h3>
                  {photo.category && (
                    <span className="inline-flex items-center gap-1 text-sm text-gray-300 mt-1">
                      <Tag className="h-3 w-3" />
                      {photo.category}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <button
            className="absolute top-4 right-4 p-2 text-white hover:bg-white/10 rounded-full transition-colors"
            onClick={() => setSelectedPhoto(null)}
          >
            <X className="h-6 w-6" />
          </button>

          <div
            className="max-w-5xl max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={`/gallery/${selectedPhoto.filename}`}
              alt={selectedPhoto.title}
              className="max-h-[75vh] w-auto object-contain rounded-lg"
            />
            <div className="mt-4 text-white">
              <h2 className="text-xl font-bold">{selectedPhoto.title}</h2>
              {selectedPhoto.description && (
                <p className="text-gray-300 mt-2">{selectedPhoto.description}</p>
              )}
              <div className="flex items-center gap-4 mt-3 text-sm text-gray-400">
                {selectedPhoto.category && (
                  <span className="inline-flex items-center gap-1">
                    <Tag className="h-4 w-4" />
                    {selectedPhoto.category}
                  </span>
                )}
                {selectedPhoto.takenAt && (
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {new Date(selectedPhoto.takenAt).toLocaleDateString('id-ID', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
