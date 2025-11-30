/**
 * Image Compression Script
 * Compresses all images in /public/uploads directory using Sharp
 * Reduces file sizes while maintaining good quality
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const UPLOADS_DIR = path.join(__dirname, '../public/uploads');
const MAX_WIDTH = 2000;  // Maximum width in pixels
const MAX_HEIGHT = 2000; // Maximum height in pixels
const QUALITY = 85;      // JPEG/WebP quality (0-100)

// Supported image formats
const SUPPORTED_FORMATS = ['.jpg', '.jpeg', '.png', '.webp'];

/**
 * Format bytes to human-readable size
 */
function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Compress a single image
 */
async function compressImage(filePath) {
  try {
    const ext = path.extname(filePath).toLowerCase();
    if (!SUPPORTED_FORMATS.includes(ext)) {
      console.log(`⏭️  Skipping ${path.basename(filePath)} (unsupported format)`);
      return null;
    }

    // Get original file size
    const originalStats = fs.statSync(filePath);
    const originalSize = originalStats.size;

    // Skip if already optimized (less than 500KB)
    if (originalSize < 500 * 1024) {
      console.log(`✓ ${path.basename(filePath)} already optimized (${formatBytes(originalSize)})`);
      return null;
    }

    // Read image metadata
    const metadata = await sharp(filePath).metadata();

    console.log(`\n🔄 Processing: ${path.basename(filePath)}`);
    console.log(`   Original: ${metadata.width}x${metadata.height} - ${formatBytes(originalSize)}`);

    // Create backup
    const backupPath = filePath + '.backup';
    fs.copyFileSync(filePath, backupPath);

    // Compress image
    let sharpInstance = sharp(filePath);

    // Resize if image is too large
    if (metadata.width > MAX_WIDTH || metadata.height > MAX_HEIGHT) {
      sharpInstance = sharpInstance.resize(MAX_WIDTH, MAX_HEIGHT, {
        fit: 'inside',
        withoutEnlargement: true,
      });
    }

    // Apply format-specific compression
    if (ext === '.png') {
      // PNG: use compressionLevel 9 (max compression)
      await sharpInstance
        .png({ compressionLevel: 9, quality: QUALITY })
        .toFile(filePath + '.tmp');
    } else {
      // JPEG/WebP: use quality setting
      await sharpInstance
        .jpeg({ quality: QUALITY, mozjpeg: true })
        .toFile(filePath + '.tmp');
    }

    // Replace original with compressed version
    fs.unlinkSync(filePath);
    fs.renameSync(filePath + '.tmp', filePath);

    // Get new file size
    const newStats = fs.statSync(filePath);
    const newSize = newStats.size;
    const savedBytes = originalSize - newSize;
    const savedPercent = Math.round((savedBytes / originalSize) * 100);

    // Get new metadata
    const newMetadata = await sharp(filePath).metadata();

    console.log(`   Compressed: ${newMetadata.width}x${newMetadata.height} - ${formatBytes(newSize)}`);
    console.log(`   ✅ Saved: ${formatBytes(savedBytes)} (${savedPercent}% reduction)`);

    // Remove backup if successful
    fs.unlinkSync(backupPath);

    return {
      file: path.basename(filePath),
      originalSize,
      newSize,
      savedBytes,
      savedPercent,
    };
  } catch (error) {
    console.error(`   ❌ Error compressing ${path.basename(filePath)}:`, error.message);

    // Restore from backup if error occurred
    const backupPath = filePath + '.backup';
    if (fs.existsSync(backupPath)) {
      fs.copyFileSync(backupPath, filePath);
      fs.unlinkSync(backupPath);
      console.log(`   ↩️  Restored from backup`);
    }

    return null;
  }
}

/**
 * Main function
 */
async function main() {
  console.log('🖼️  Image Compression Tool');
  console.log('━'.repeat(60));
  console.log(`📁 Directory: ${UPLOADS_DIR}`);
  console.log(`📐 Max dimensions: ${MAX_WIDTH}x${MAX_HEIGHT}px`);
  console.log(`🎨 Quality: ${QUALITY}%`);
  console.log('━'.repeat(60));

  // Check if uploads directory exists
  if (!fs.existsSync(UPLOADS_DIR)) {
    console.error('❌ Uploads directory not found!');
    process.exit(1);
  }

  // Get all files in uploads directory
  const files = fs.readdirSync(UPLOADS_DIR)
    .filter(file => {
      const ext = path.extname(file).toLowerCase();
      return SUPPORTED_FORMATS.includes(ext);
    })
    .map(file => path.join(UPLOADS_DIR, file));

  if (files.length === 0) {
    console.log('📭 No images found to compress');
    return;
  }

  console.log(`\n📊 Found ${files.length} images to process\n`);

  // Compress all images
  const results = [];
  for (const file of files) {
    const result = await compressImage(file);
    if (result) {
      results.push(result);
    }
  }

  // Print summary
  console.log('\n' + '━'.repeat(60));
  console.log('📊 COMPRESSION SUMMARY');
  console.log('━'.repeat(60));

  if (results.length === 0) {
    console.log('✓ All images were already optimized!');
  } else {
    const totalOriginal = results.reduce((sum, r) => sum + r.originalSize, 0);
    const totalNew = results.reduce((sum, r) => sum + r.newSize, 0);
    const totalSaved = totalOriginal - totalNew;
    const totalPercent = Math.round((totalSaved / totalOriginal) * 100);

    console.log(`Files compressed: ${results.length}`);
    console.log(`Total original size: ${formatBytes(totalOriginal)}`);
    console.log(`Total new size: ${formatBytes(totalNew)}`);
    console.log(`Total saved: ${formatBytes(totalSaved)} (${totalPercent}% reduction)`);
    console.log('\n✅ Compression completed successfully!');
  }

  console.log('━'.repeat(60));
}

// Run the script
main().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
