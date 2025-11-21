import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const photos = await prisma.galleryPhoto.findMany({
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json(photos);
}

export async function POST(request: NextRequest) {
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
}
