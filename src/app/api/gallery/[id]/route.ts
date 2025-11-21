import { NextRequest, NextResponse } from 'next/server';
import { unlink } from 'fs/promises';
import { join } from 'path';
import { prisma } from '@/lib/prisma';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const photo = await prisma.galleryPhoto.findUnique({ where: { id } });

  if (!photo) {
    return NextResponse.json({ error: 'Photo not found' }, { status: 404 });
  }

  // Delete file
  const filepath = join(process.cwd(), 'public', 'gallery', photo.filename);
  try {
    await unlink(filepath);
  } catch (error) {
    console.error('Error deleting file:', error);
  }

  await prisma.galleryPhoto.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
