import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import { uploadLimiter, getClientIdentifier, RATE_LIMITS } from '@/lib/rate-limit';

export async function GET() {
  const photos = await prisma.galleryPhoto.findMany({
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json(photos);
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
      const minutesLeft = Math.ceil((rateLimitResult.resetTime - Date.now()) / 60000);
      return NextResponse.json(
        { error: `Upload limit exceeded. Try again in ${minutesLeft} minutes.` },
        { status: 429 }
      );
    }

    const formData = await request.formData();
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const category = formData.get('category') as string;
    const takenAt = formData.get('takenAt') as string;
    const file = formData.get('file') as File;

    if (!file || !title) {
      return NextResponse.json({ error: 'Title and file are required' }, { status: 400 });
    }

    // Save file to public/gallery
    const uploadDir = join(process.cwd(), 'public', 'gallery');
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filename = `${Date.now()}-${file.name.replace(/\s/g, '-')}`;
    const filepath = join(uploadDir, filename);
    await writeFile(filepath, buffer);

    const photo = await prisma.galleryPhoto.create({
      data: {
        title,
        description: description || null,
        filename,
        category: category || null,
        takenAt: takenAt ? new Date(takenAt) : null,
      },
    });

    return NextResponse.json(photo);
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
