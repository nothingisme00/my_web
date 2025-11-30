/**
 * Image Optimization Utility
 * Automatically compresses and optimizes uploaded images using Sharp
 */

import sharp from 'sharp';
import { promises as fs } from 'fs';

// Configuration
const MAX_WIDTH = 2000;
const MAX_HEIGHT = 2000;
const JPEG_QUALITY = 85;
const PNG_QUALITY = 85;
const WEBP_QUALITY = 85;

export interface OptimizationResult {
  success: boolean;
  originalSize: number;
  optimizedSize: number;
  savedBytes: number;
  savedPercent: number;
  width: number;
  height: number;
  format: string;
}

/**
 * Optimize an image file
 * Automatically compresses and resizes if needed
 *
 * @param filePath - Absolute path to the image file
 * @returns OptimizationResult with compression stats
 */
export async function optimizeImage(filePath: string): Promise<OptimizationResult> {
  try {
    // Get original file size
    const originalStats = await fs.stat(filePath);
    const originalSize = originalStats.size;

    // Read image metadata
    const metadata = await sharp(filePath).metadata();

    if (!metadata.format || !metadata.width || !metadata.height) {
      throw new Error('Invalid image file');
    }

    // Create Sharp instance
    let sharpInstance = sharp(filePath);

    // Resize if image is too large
    const needsResize = metadata.width > MAX_WIDTH || metadata.height > MAX_HEIGHT;
    if (needsResize) {
      sharpInstance = sharpInstance.resize(MAX_WIDTH, MAX_HEIGHT, {
        fit: 'inside',
        withoutEnlargement: true,
      });
    }

    // Apply format-specific optimization
    const tempPath = filePath + '.optimizing';

    switch (metadata.format) {
      case 'png':
        await sharpInstance
          .png({
            compressionLevel: 9,
            quality: PNG_QUALITY,
          })
          .toFile(tempPath);
        break;

      case 'jpeg':
      case 'jpg':
        await sharpInstance
          .jpeg({
            quality: JPEG_QUALITY,
            mozjpeg: true, // Use mozjpeg for better compression
          })
          .toFile(tempPath);
        break;

      case 'webp':
        await sharpInstance
          .webp({
            quality: WEBP_QUALITY,
          })
          .toFile(tempPath);
        break;

      default:
        // For other formats, just resize if needed
        if (needsResize) {
          await sharpInstance.toFile(tempPath);
        } else {
          // No optimization needed
          return {
            success: true,
            originalSize,
            optimizedSize: originalSize,
            savedBytes: 0,
            savedPercent: 0,
            width: metadata.width,
            height: metadata.height,
            format: metadata.format,
          };
        }
    }

    // Get optimized file stats
    const optimizedStats = await fs.stat(tempPath);
    const optimizedSize = optimizedStats.size;

    // Replace original with optimized version
    await fs.unlink(filePath);
    await fs.rename(tempPath, filePath);

    // Get final metadata
    const finalMetadata = await sharp(filePath).metadata();

    // Calculate savings
    const savedBytes = originalSize - optimizedSize;
    const savedPercent = Math.round((savedBytes / originalSize) * 100);

    return {
      success: true,
      originalSize,
      optimizedSize,
      savedBytes,
      savedPercent,
      width: finalMetadata.width || metadata.width,
      height: finalMetadata.height || metadata.height,
      format: finalMetadata.format || metadata.format,
    };
  } catch (error) {
    // Clean up temp file if it exists
    const tempPath = filePath + '.optimizing';
    try {
      await fs.unlink(tempPath);
    } catch {
      // Ignore if temp file doesn't exist
    }

    throw new Error(`Image optimization failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Check if a file is an image based on MIME type
 */
export function isImageFile(mimeType: string): boolean {
  return mimeType.startsWith('image/');
}

/**
 * Check if an image format is optimizable
 */
export function isOptimizableFormat(mimeType: string): boolean {
  const optimizableFormats = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
  ];

  return optimizableFormats.includes(mimeType);
}

/**
 * Format bytes to human-readable size
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}
