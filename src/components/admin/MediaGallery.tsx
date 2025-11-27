'use client';

import { useState, useRef } from 'react';
import { uploadMedia, deleteMedia } from '@/lib/actions';
import { Button } from '@/components/ui/Button';
import { Upload, Trash2, Copy, Check, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';
import { Media } from '@prisma/client';
import { toast } from '@/hooks/useToast';

interface MediaGalleryProps {
  initialMedia: Media[];
}

export default function MediaGallery({ initialMedia }: MediaGalleryProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      await uploadMedia(formData);
      toast.success('Image uploaded successfully!');
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Upload failed:', error);
      toast.error('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleCopy = (url: string, id: string) => {
    const fullUrl = window.location.origin + url;
    navigator.clipboard.writeText(fullUrl);
    setCopiedId(id);
    toast.success('URL copied to clipboard!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this image?')) {
      try {
        await deleteMedia(id);
        toast.success('Image deleted successfully!');
      } catch {
        toast.error('Failed to delete image.');
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <div 
        className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-8 text-center hover:border-blue-500 dark:hover:border-blue-500 transition-colors cursor-pointer bg-gray-50 dark:bg-gray-900/50"
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={handleUpload}
          disabled={isUploading}
        />
        <div className="flex flex-col items-center gap-2">
          <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-600 dark:text-blue-400">
            <Upload className="h-6 w-6" />
          </div>
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {isUploading ? 'Uploading...' : 'Click to upload image'}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            PNG, JPG, GIF up to 5MB
          </p>
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {initialMedia.map((media) => (
          <div key={media.id} className="group relative aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
            <Image
              src={media.url}
              alt={media.filename}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            />
            
            {/* Overlay Actions */}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-4">
              <Button 
                size="sm" 
                variant="secondary" 
                className="w-full gap-2"
                onClick={() => handleCopy(media.url, media.id)}
              >
                {copiedId === media.id ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                {copiedId === media.id ? 'Copied' : 'Copy URL'}
              </Button>
              
              <Button 
                size="sm" 
                variant="destructive" 
                className="w-full gap-2"
                onClick={() => handleDelete(media.id)}
              >
                <Trash2 className="h-3 w-3" /> Delete
              </Button>
            </div>

            {/* Info Badge */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3 pt-8 pointer-events-none">
              <p className="text-xs text-white truncate">{media.filename}</p>
              <p className="text-[10px] text-gray-300">{(media.size / 1024).toFixed(1)} KB</p>
            </div>
          </div>
        ))}
      </div>

      {initialMedia.length === 0 && (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
            <ImageIcon className="h-6 w-6 text-gray-400" />
          </div>
          <h3 className="text-sm font-medium text-gray-900 dark:text-white">No media files</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Upload images to see them here.</p>
        </div>
      )}
    </div>
  );
}
