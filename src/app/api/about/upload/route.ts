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

// Get safe file extension to prevent path traversal
function getSafeExtension(filename: string): string {
  const ext = filename.split(".").pop()?.toLowerCase() || "jpg";
  const allowedExts = ["jpg", "jpeg", "png", "gif", "webp"];
  return allowedExts.includes(ext) ? ext : "jpg";
}

export async function POST(request: NextRequest) {
  try {
    // Require authentication
    await requireAuth(request);

    // Rate limiting: 10 uploads per hour per IP
    const clientId = getClientIdentifier(request.headers);
    const rateLimitResult = uploadLimiter.check(
      `upload:${clientId}`,
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

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
    }

    // Create uploads directory if not exists
    const uploadDir = join(process.cwd(), "public", "uploads");
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // Save file
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filename = `profile-${Date.now()}.${getSafeExtension(file.name)}`;
    const filepath = join(uploadDir, filename);
    await writeFile(filepath, buffer);

    // Auto-optimize image (compress and resize if needed)
    if (file.type.startsWith("image/")) {
      try {
        const { optimizeImage } = await import("@/lib/image-optimizer");
        const result = await optimizeImage(filepath);

        if (result.success && result.savedBytes > 0) {
          console.log(
            `✅ Profile image optimized: ${result.savedPercent}% reduction`
          );
        }
      } catch {
        console.warn("⚠️  Image optimization failed, using original file");
        // Continue with original file if optimization fails
      }
    }

    return NextResponse.json({ url: `/uploads/${filename}` });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
