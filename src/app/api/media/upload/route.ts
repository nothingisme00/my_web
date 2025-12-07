import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import { join } from "path";
import { requireAuth } from "@/lib/auth";
import {
  uploadLimiter,
  getClientIdentifier,
  RATE_LIMITS,
} from "@/lib/rate-limit";

// For App Router - ensure dynamic rendering and no body size limit
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60; // 60 seconds timeout for large uploads

// Allowed file types
const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
];
const ALLOWED_VIDEO_TYPES = [
  "video/mp4",
  "video/webm",
  "video/ogg",
  "video/quicktime",
];

// Max file sizes
const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100MB

// Get safe file extension
function getSafeExtension(filename: string, type: string): string {
  const ext = filename.split(".").pop()?.toLowerCase() || "";

  if (type.startsWith("image/")) {
    const allowedExts = ["jpg", "jpeg", "png", "gif", "webp"];
    return allowedExts.includes(ext) ? ext : "jpg";
  }

  if (type.startsWith("video/")) {
    const allowedExts = ["mp4", "webm", "ogg", "mov"];
    return allowedExts.includes(ext) ? ext : "mp4";
  }

  return ext;
}

export async function POST(request: NextRequest) {
  try {
    // Require authentication
    await requireAuth(request);

    // Rate limiting
    const clientId = getClientIdentifier(request.headers);
    const rateLimitResult = uploadLimiter.check(
      `media-upload:${clientId}`,
      RATE_LIMITS.UPLOAD.limit,
      RATE_LIMITS.UPLOAD.windowMs
    );

    if (!rateLimitResult.success) {
      const minutesLeft = Math.ceil(
        (rateLimitResult.resetTime - Date.now()) / 60000
      );
      return NextResponse.json(
        {
          error: `Upload limit exceeded. Try again in ${minutesLeft} minutes.`,
        },
        { status: 429 }
      );
    }

    // Check content-type header
    const contentType = request.headers.get("content-type") || "";
    if (!contentType.includes("multipart/form-data")) {
      return NextResponse.json(
        { error: "Invalid content type. Expected multipart/form-data" },
        { status: 400 }
      );
    }

    let formData: FormData;
    try {
      formData = await request.formData();
    } catch (formError) {
      console.error("FormData parsing error:", formError);
      return NextResponse.json(
        {
          error:
            "Failed to parse upload. File may be too large. Max video size: 100MB",
          details:
            formError instanceof Error ? formError.message : "Unknown error",
        },
        { status: 400 }
      );
    }

    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Log file info for debugging
    console.log("Upload attempt:", {
      name: file.name,
      type: file.type,
      size: file.size,
      sizeMB: (file.size / (1024 * 1024)).toFixed(2) + "MB",
    });

    const isImage = ALLOWED_IMAGE_TYPES.includes(file.type);
    const isVideo = ALLOWED_VIDEO_TYPES.includes(file.type);

    // Validate file type
    if (!isImage && !isVideo) {
      return NextResponse.json(
        {
          error: `Invalid file type: ${file.type}. Allowed: JPG, PNG, GIF, WEBP, MP4, WEBM, OGG`,
        },
        { status: 400 }
      );
    }

    // Validate file size
    const maxSize = isImage ? MAX_IMAGE_SIZE : MAX_VIDEO_SIZE;
    if (file.size > maxSize) {
      const maxSizeMB = maxSize / (1024 * 1024);
      return NextResponse.json(
        {
          error: `File too large (${(file.size / (1024 * 1024)).toFixed(
            2
          )}MB). Maximum size: ${maxSizeMB}MB`,
        },
        { status: 400 }
      );
    }

    // Create uploads directory structure
    const mediaType = isImage ? "images" : "videos";
    const uploadDir = join(process.cwd(), "public", "uploads", mediaType);
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // Save file with unique name
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 8);
    const ext = getSafeExtension(file.name, file.type);
    const filename = `${mediaType.slice(
      0,
      -1
    )}-${timestamp}-${randomStr}.${ext}`;
    const filepath = join(uploadDir, filename);

    await writeFile(filepath, buffer);
    console.log(`✅ File saved: ${filepath}`);

    // Optimize images
    if (isImage) {
      try {
        const { optimizeImage } = await import("@/lib/image-optimizer");
        const result = await optimizeImage(filepath);

        if (result.success && result.savedBytes > 0) {
          console.log(`✅ Image optimized: ${result.savedPercent}% reduction`);
        }
      } catch {
        console.warn("⚠️ Image optimization failed, using original file");
      }
    }

    const url = `/uploads/${mediaType}/${filename}`;

    return NextResponse.json({
      url,
      type: isImage ? "image" : "video",
      filename,
      size: file.size,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Log detailed error for debugging
    console.error("Media upload error:", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    });

    // Return more specific error message
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: `Upload failed: ${errorMessage}` },
      { status: 500 }
    );
  }
}
