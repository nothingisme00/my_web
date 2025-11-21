import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function GET() {
  const setting = await prisma.settings.findUnique({
    where: { key: 'about_page_content' },
  });

  if (!setting) {
    return NextResponse.json({});
  }

  try {
    return NextResponse.json(JSON.parse(setting.value));
  } catch {
    return NextResponse.json({});
  }
}

export async function POST(request: NextRequest) {
  const data = await request.json();

  await prisma.settings.upsert({
    where: { key: 'about_page_content' },
    update: { value: JSON.stringify(data) },
    create: { key: 'about_page_content', value: JSON.stringify(data) },
  });

  revalidatePath('/about');
  revalidatePath('/admin/about');

  return NextResponse.json({ success: true });
}
