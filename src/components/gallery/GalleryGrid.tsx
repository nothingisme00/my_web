'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { X, Calendar, Tag, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const filteredPhotos = activeCategory
    ? photos.filter((p) => p.category === activeCategory)
    : photos;

  const navigateNext = useCallback(() => {
    const nextIndex = (currentIndex + 1) % filteredPhotos.length;
    setCurrentIndex(nextIndex);
    setSelectedPhoto(filteredPhotos[nextIndex]);
  }, [currentIndex, filteredPhotos]);

  const navigatePrev = useCallback(() => {
    const prevIndex = (currentIndex - 1 + filteredPhotos.length) % filteredPhotos.length;
    setCurrentIndex(prevIndex);
    setSelectedPhoto(filteredPhotos[prevIndex]);
  }, [currentIndex, filteredPhotos]);

  // Keyboard navigation
  useEffect(() => {
    if (!selectedPhoto) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedPhoto(null);
      } else if (e.key === 'ArrowLeft') {
        navigatePrev();
      } else if (e.key === 'ArrowRight') {
        navigateNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedPhoto, currentIndex, filteredPhotos, navigateNext, navigatePrev]);

  const openLightbox = (photo: Photo, index: number) => {
    setSelectedPhoto(photo);
    setCurrentIndex(index);
  };

  return (
    <>
      {/* Category Filter */}
      {categories.length > 0 && (
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveCategory(null)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              activeCategory === null
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            All
          </motion.button>
          {categories.map((cat) => (
            <motion.button
              key={cat}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                activeCategory === cat
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {cat}
            </motion.button>
          ))}
        </div>
      )}

      {/* Masonry Grid */}
      <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
        {filteredPhotos.map((photo, index) => (
          <div
            key={photo.id}
            className="break-inside-avoid cursor-pointer group mb-4"
            onClick={() => openLightbox(photo, index)}
          >
            <div className="relative overflow-hidden rounded-xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-md shadow-md hover:shadow-xl transition-all duration-300">
              <Image
                src={`/gallery/${photo.filename}`}
                alt={photo.title}
                width={0}
                height={0}
                sizes="100vw"
                className="w-full h-auto object-cover img-zoom"
                style={{ width: '100%', height: 'auto' }}
                unoptimized
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
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedPhoto(null)}
          >
            {/* Close Button */}
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ delay: 0.1 }}
              className="absolute top-4 right-4 p-3 text-white hover:bg-white/10 rounded-full transition-colors z-10"
              onClick={() => setSelectedPhoto(null)}
            >
              <X className="h-6 w-6" />
            </motion.button>

            {/* Navigation Buttons */}
            {filteredPhotos.length > 1 && (
              <>
                <motion.button
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: 0.1 }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-3 text-white hover:bg-white/10 rounded-full transition-colors z-10"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigatePrev();
                  }}
                >
                  <ChevronLeft className="h-8 w-8" />
                </motion.button>

                <motion.button
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: 0.1 }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-3 text-white hover:bg-white/10 rounded-full transition-colors z-10"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigateNext();
                  }}
                >
                  <ChevronRight className="h-8 w-8" />
                </motion.button>
              </>
            )}

            {/* Photo Counter */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: 0.1 }}
              className="absolute top-4 left-4 text-white text-sm bg-black/50 px-3 py-1.5 rounded-full"
            >
              {currentIndex + 1} / {filteredPhotos.length}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1.0] }}
              className="max-w-6xl max-h-[90vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedPhoto.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.25 }}
                  className="relative flex justify-center"
                >
                  <Image
                    src={`/gallery/${selectedPhoto.filename}`}
                    alt={selectedPhoto.title}
                    width={0}
                    height={0}
                    sizes="100vw"
                    className="max-h-[70vh] w-auto object-contain rounded-lg"
                    style={{ width: 'auto', height: 'auto' }}
                    draggable={false}
                    unoptimized
                  />
                </motion.div>
              </AnimatePresence>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-6 text-white max-w-3xl"
              >
                <h2 className="text-2xl font-bold">{selectedPhoto.title}</h2>
                {selectedPhoto.description && (
                  <p className="text-gray-300 mt-3 text-lg">{selectedPhoto.description}</p>
                )}
                <div className="flex items-center gap-6 mt-4 text-sm text-gray-400">
                  {selectedPhoto.category && (
                    <span className="inline-flex items-center gap-2">
                      <Tag className="h-4 w-4" />
                      {selectedPhoto.category}
                    </span>
                  )}
                  {selectedPhoto.takenAt && (
                    <span className="inline-flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {new Date(selectedPhoto.takenAt).toLocaleDateString('id-ID', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </span>
                  )}
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
