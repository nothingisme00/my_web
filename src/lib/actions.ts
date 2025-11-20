'use server';

import { writeFile, unlink, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { validateFormData, LoginSchema, PostSchema, ProjectSchema, CategorySchema, TagSchema } from '@/lib/validations';

// Types
interface FormState {
  error?: string;
}

// Auth
export async function login(prevState: FormState | null, formData: FormData): Promise<FormState> {
  // Validate input
  const validation = validateFormData(LoginSchema, formData);
  if (!validation.success) {
    return { error: validation.error };
  }

  const { email, password } = validation.data;

  // Simple hardcoded check for demo purposes
  // In production, use bcrypt and check against database
  if (email === 'admin@example.com' && password === 'password') {
    (await cookies()).set('auth_token', 'secret_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
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
  try {
    // Prepare data with tag IDs
    const tags = formData.getAll('tags') as string[];
    formData.set('tagIds', JSON.stringify(tags));
    formData.set('published', formData.get('published') === 'on' ? 'true' : 'false');

    // Validate input
    const validation = validateFormData(PostSchema, formData);
    if (!validation.success) {
      throw new Error(validation.error);
    }

    const { title, slug, content, excerpt, image, published, categoryId, tagIds } = validation.data;

    await prisma.post.create({
      data: {
        title,
        slug,
        content,
        excerpt: excerpt || null,
        image: image || null,
        published,
        categoryId: categoryId || null,
        tags: tagIds && tagIds.length > 0 ? {
          connect: tagIds.map(tagId => ({ id: tagId })),
        } : undefined,
      },
    });

    revalidatePath('/blog');
    revalidatePath('/admin/posts');
    redirect('/admin/posts');
  } catch (error) {
    console.error('Error creating post:', error);
    throw error;
  }
}

export async function deletePost(id: string) {
  await prisma.post.delete({ where: { id } });
  revalidatePath('/blog');
  revalidatePath('/admin/posts');
}

export async function updatePost(id: string, formData: FormData) {
  try {
    const tags = formData.getAll('tags') as string[];
    formData.set('tagIds', JSON.stringify(tags));
    formData.set('published', formData.get('published') === 'on' ? 'true' : 'false');

    const validation = validateFormData(PostSchema, formData);
    if (!validation.success) {
      throw new Error(validation.error);
    }

    const { title, slug, content, excerpt, image, published, categoryId, tagIds } = validation.data;

    await prisma.post.update({
      where: { id },
      data: {
        title,
        slug,
        content,
        excerpt: excerpt || null,
        image: image || null,
        published,
        categoryId: categoryId || null,
        tags: {
          set: [],
          connect: tagIds && tagIds.length > 0 ? tagIds.map(tagId => ({ id: tagId })) : [],
        },
      },
    });

    revalidatePath('/blog');
    revalidatePath(`/blog/${slug}`);
    revalidatePath('/admin/posts');
    redirect('/admin/posts');
  } catch (error) {
    console.error('Error updating post:', error);
    throw error;
  }
}

// Projects
export async function getProjects() {
  return await prisma.project.findMany({ orderBy: { createdAt: 'desc' } });
}

export async function createProject(formData: FormData) {
  try {
    const validation = validateFormData(ProjectSchema, formData);
    if (!validation.success) {
      throw new Error(validation.error);
    }

    const { title, slug, description, content, techStack, image, demoUrl, githubUrl, status } = validation.data;

    await prisma.project.create({
      data: {
        title,
        slug,
        description,
        content: content || null,
        techStack: techStack || null,
        image: image || null,
        demoUrl: demoUrl || null,
        githubUrl: githubUrl || null,
        status: status || 'Completed',
      },
    });

    revalidatePath('/portfolio');
    revalidatePath('/admin/projects');
    redirect('/admin/projects');
  } catch (error) {
    console.error('Error creating project:', error);
    throw error;
  }
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

  // Validation: File size (max 5MB)
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes
  if (file.size > MAX_FILE_SIZE) {
    throw new Error('File size exceeds 5MB limit');
  }

  // Validation: MIME type
  const ALLOWED_MIME_TYPES = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml'
  ];

  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    throw new Error('Invalid file type. Only images (JPEG, PNG, GIF, WebP, SVG) are allowed');
  }

  // Validation: File extension
  const fileExtension = file.name.split('.').pop()?.toLowerCase();
  const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];

  if (!fileExtension || !ALLOWED_EXTENSIONS.includes(fileExtension)) {
    throw new Error('Invalid file extension');
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Create unique filename
  const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
  const filename = file.name.replace(/\.[^/.]+$/, "") + '-' + uniqueSuffix + '.' + fileExtension;
  const uploadDir = join(process.cwd(), 'public', 'uploads');

  // Ensure upload directory exists
  if (!existsSync(uploadDir)) {
    await mkdir(uploadDir, { recursive: true });
  }

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
