'use server';

import { writeFile, unlink } from 'fs/promises';
import { join } from 'path';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

// Auth
export async function login(prevState: any, formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  // Simple hardcoded check for demo purposes
  // In production, use bcrypt and check against database
  if (email === 'admin@example.com' && password === 'password') {
    (await cookies()).set('auth_token', 'secret_token', { httpOnly: true });
    redirect('/admin');
  } else {
    return { error: 'Invalid credentials' };
  }
}

export async function logout() {
  (await cookies()).delete('auth_token');
  redirect('/login');
}

// Posts
export async function getPosts() {
  return await prisma.post.findMany({ 
    orderBy: { createdAt: 'desc' },
    include: {
      category: true,
      tags: true,
    }
  });
}

export async function createPost(formData: FormData) {
  const title = formData.get('title') as string;
  const slug = formData.get('slug') as string;
  const content = formData.get('content') as string;
  const excerpt = formData.get('excerpt') as string;
  const image = formData.get('image') as string;
  const categoryId = formData.get('categoryId') as string;
  const published = formData.get('published') === 'on';
  const tags = formData.getAll('tags') as string[];

  await prisma.post.create({
    data: {
      title,
      slug,
      content,
      excerpt,
      image,
      published,
      categoryId: categoryId || null,
      tags: {
        connect: tags.map(tagId => ({ id: tagId })),
      },
    },
  });

  revalidatePath('/blog');
  revalidatePath('/admin/posts');
  redirect('/admin/posts');
}

export async function deletePost(id: string) {
  await prisma.post.delete({ where: { id } });
  revalidatePath('/blog');
  revalidatePath('/admin/posts');
}

export async function updatePost(id: string, formData: FormData) {
  const title = formData.get('title') as string;
  const slug = formData.get('slug') as string;
  const content = formData.get('content') as string;
  const excerpt = formData.get('excerpt') as string;
  const image = formData.get('image') as string;
  const categoryId = formData.get('categoryId') as string;
  const published = formData.get('published') === 'on';
  const tags = formData.getAll('tags') as string[];

  await prisma.post.update({
    where: { id },
    data: {
      title,
      slug,
      content,
      excerpt,
      image,
      published,
      categoryId: categoryId || null,
      tags: {
        set: [], // Disconnect all existing tags
        connect: tags.map(tagId => ({ id: tagId })), // Connect new tags
      },
    },
  });

  revalidatePath('/blog');
  revalidatePath(`/blog/${slug}`);
  revalidatePath('/admin/posts');
  redirect('/admin/posts');
}

// Projects
export async function getProjects() {
  return await prisma.project.findMany({ orderBy: { createdAt: 'desc' } });
}

export async function createProject(formData: FormData) {
  const title = formData.get('title') as string;
  const slug = formData.get('slug') as string;
  const description = formData.get('description') as string;
  const content = formData.get('content') as string;
  const techStack = formData.get('techStack') as string;
  const image = formData.get('image') as string;

  await prisma.project.create({
    data: {
      title,
      slug,
      description,
      content,
      techStack, // In real app, parse this
      image,
    },
  });

  revalidatePath('/portfolio');
  revalidatePath('/admin/projects');
  redirect('/admin/projects');
}

export async function deleteProject(id: string) {
  await prisma.project.delete({ where: { id } });
  revalidatePath('/portfolio');
  revalidatePath('/admin/projects');
}

export async function updateProject(id: string, formData: FormData) {
  const title = formData.get('title') as string;
  const slug = formData.get('slug') as string;
  const description = formData.get('description') as string;
  const content = formData.get('content') as string;
  const techStack = formData.get('techStack') as string;
  const image = formData.get('image') as string;

  await prisma.project.update({
    where: { id },
    data: {
      title,
      slug,
      description,
      content,
      techStack,
      image,
    },
  });

  revalidatePath('/portfolio');
  revalidatePath(`/portfolio/${slug}`);
  revalidatePath('/admin/projects');
  redirect('/admin/projects');
}

// Categories
export async function getCategories() {
  return await prisma.category.findMany({ 
    orderBy: { name: 'asc' },
    include: { _count: { select: { posts: true } } }
  });
}

export async function createCategory(formData: FormData) {
  const name = formData.get('name') as string;
  const slug = formData.get('slug') as string;
  const description = formData.get('description') as string;

  await prisma.category.create({
    data: {
      name,
      slug,
      description,
    },
  });

  revalidatePath('/admin/categories');
}

export async function deleteCategory(id: string) {
  await prisma.category.delete({ where: { id } });
  revalidatePath('/admin/categories');
}

// Tags
export async function getTags() {
  return await prisma.tag.findMany({ 
    orderBy: { name: 'asc' },
    include: { _count: { select: { posts: true } } }
  });
}

export async function createTag(formData: FormData) {
  const name = formData.get('name') as string;
  const slug = formData.get('slug') as string;

  await prisma.tag.create({
    data: {
      name,
      slug,
    },
  });

  revalidatePath('/admin/tags');
}

export async function deleteTag(id: string) {
  await prisma.tag.delete({ where: { id } });
  revalidatePath('/admin/tags');
}

// Media
export async function getMedia() {
  return await prisma.media.findMany({ 
    orderBy: { createdAt: 'desc' } 
  });
}

export async function uploadMedia(formData: FormData) {
  const file = formData.get('file') as File;
  
  if (!file) {
    throw new Error('No file uploaded');
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Create unique filename
  const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
  const filename = file.name.replace(/\.[^/.]+$/, "") + '-' + uniqueSuffix + '.' + file.name.split('.').pop();
  const uploadDir = join(process.cwd(), 'public', 'uploads');
  const filepath = join(uploadDir, filename);

  await writeFile(filepath, buffer);

  await prisma.media.create({
    data: {
      filename: filename,
      originalName: file.name,
      url: `/uploads/${filename}`,
      mimeType: file.type,
      size: file.size,
    },
  });

  revalidatePath('/admin/media');
}

export async function deleteMedia(id: string) {
  const media = await prisma.media.findUnique({ where: { id } });

  if (media) {
    const filename = media.url.split('/').pop();
    if (filename) {
      const filepath = join(process.cwd(), 'public', 'uploads', filename);
      try {
        await unlink(filepath);
      } catch (error) {
        console.error('Error deleting file:', error);
      }
    }

    await prisma.media.delete({ where: { id } });
    revalidatePath('/admin/media');
  }
}

// Dashboard
export async function getDashboardStats() {
  const [postsCount, projectsCount, categoriesCount, tagsCount, recentPosts] = await Promise.all([
    prisma.post.count(),
    prisma.project.count(),
    prisma.category.count(),
    prisma.tag.count(),
    prisma.post.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        category: true,
      },
    }),
  ]);

  return {
    postsCount,
    projectsCount,
    categoriesCount,
    tagsCount,
    recentPosts,
  };
}

// Settings
export async function getSettings() {
  const settings = await prisma.settings.findMany();
  
  // Convert array to key-value object
  const settingsObj: Record<string, string> = {};
  settings.forEach(setting => {
    settingsObj[setting.key] = setting.value;
  });
  
  return settingsObj;
}

export async function updateSettings(formData: FormData) {
  const settingsToUpdate = [
    'site_name',
    'site_bio',
    'owner_name',
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
  redirect('/admin/settings');
}

// Analytics
export async function incrementPostViews(slug: string) {
  await prisma.post.update({
    where: { slug },
    data: {
      views: {
        increment: 1,
      },
    },
  });
}

export async function incrementProjectViews(slug: string) {
  await prisma.project.update({
    where: { slug },
    data: {
      views: {
        increment: 1,
      },
    },
  });
}
