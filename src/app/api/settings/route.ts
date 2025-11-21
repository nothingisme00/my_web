import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function GET() {
  const settings = await prisma.settings.findMany();

  const settingsObj: Record<string, string> = {};
  settings.forEach(setting => {
    settingsObj[setting.key] = setting.value;
  });

  return NextResponse.json(settingsObj);
}

export async function POST(request: NextRequest) {
  const formData = await request.formData();

  const settingsToUpdate = [
    'site_name',
    'site_bio',
    'owner_name',
    'contact_email',
    'social_github',
    'social_linkedin',
    'social_twitter',
    'social_instagram',
    'seo_description',
    'seo_keywords',
  ];

  for (const key of settingsToUpdate) {
    const value = formData.get(key) as string;
    if (value !== null) {
      await prisma.settings.upsert({
        where: { key },
        update: { value },
        create: { key, value },
      });
    }
  }

  revalidatePath('/admin/settings');
  revalidatePath('/');

  return NextResponse.json({ success: true });
}
