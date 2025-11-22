import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { requireAuth } from '@/lib/auth';

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
  try {
    // Require authentication
    await requireAuth(request);

    const data = await request.json();

    await prisma.settings.upsert({
      where: { key: 'about_page_content' },
      update: { value: JSON.stringify(data) },
      create: { key: 'about_page_content', value: JSON.stringify(data) },
    });

    revalidatePath('/about');
    revalidatePath('/admin/about');

    return NextResponse.json({ success: true });
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
