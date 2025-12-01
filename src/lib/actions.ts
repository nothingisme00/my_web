"use server";

import { writeFile, unlink, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import {
  validateFormData,
  LoginSchema,
  PostSchema,
  ProjectSchema,
  CategorySchema,
  TagSchema,
} from "@/lib/validations";
import { calculateReadingTime } from "@/lib/utils";
import { verifyPassword, generateToken } from "@/lib/auth";
import { loginLimiter, RATE_LIMITS } from "@/lib/rate-limit";
import { logAuthAttempt, logError } from "@/lib/logger";

// Types
interface FormState {
  error?: string;
}

// Auth
export async function login(
  prevState: FormState | null,
  formData: FormData
): Promise<FormState> {
  // Validate input
  const validation = validateFormData(LoginSchema, formData);
  if (!validation.success) {
    logError(new Error("Login validation failed"), { error: validation.error });
    return { error: validation.error };
  }

  const { email, password } = validation.data;

  // Rate limiting: 5 attempts per 15 minutes per email
  const rateLimitResult = loginLimiter.check(
    email,
    RATE_LIMITS.LOGIN.limit,
    RATE_LIMITS.LOGIN.windowMs
  );

  if (!rateLimitResult.success) {
    const minutesLeft = Math.ceil(
      (rateLimitResult.resetTime - Date.now()) / 60000
    );
    logAuthAttempt(email, false, "rate-limited");
    return {
      error: `Too many login attempts. Please try again in ${minutesLeft} minute${
        minutesLeft > 1 ? "s" : ""
      }.`,
    };
  }

  try {
    // Find user in database
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      logAuthAttempt(email, false, "user-not-found");
      return { error: "Invalid email or password" };
    }

    // Verify password
    const isPasswordValid = await verifyPassword(password, user.password);

    if (!isPasswordValid) {
      logAuthAttempt(email, false, "invalid-password");
      return { error: "Invalid email or password" };
    }

    // Successful login - reset rate limit for this email
    loginLimiter.reset(email);
    logAuthAttempt(email, true, "login-success");

    // Generate JWT token
    const token = await generateToken(user.id, user.email);

    // Set secure cookie
    (await cookies()).set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    console.log("✅ Cookie set, redirecting to /admin");
  } catch (error) {
    console.error("❌ Login error:", error);
    logError(error as Error, { context: "login", email });
    return { error: "An error occurred during login" };
  }

  // Redirect OUTSIDE try-catch (Next.js redirect throws special error)
  redirect("/admin");
}

export async function logout() {
  (await cookies()).delete("auth_token");
  redirect("/login");
}

// Posts
export async function getPosts() {
  return await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      category: true,
      tags: true,
    },
  });
}

export async function createPost(formData: FormData) {
  try {
    // Handle Category: Create new if provided
    let categoryId = formData.get("categoryId") as string;
    const newCategoryName = formData.get("newCategory") as string;

    if (newCategoryName) {
      const slug = newCategoryName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

      // Check if exists first
      const existingCategory = await prisma.category.findUnique({
        where: { slug },
      });
      if (existingCategory) {
        categoryId = existingCategory.id;
      } else {
        const newCategory = await prisma.category.create({
          data: { name: newCategoryName, slug },
        });
        categoryId = newCategory.id;
      }
      formData.set("categoryId", categoryId);
    }

    // Handle Tags: Parse comma-separated string and new tag
    const tagsInput = formData.get("tagsInput") as string;
    const newTagName = formData.get("newTag") as string;
    const tagIds: string[] = [];

    // Add new tag if provided
    if (newTagName && newTagName.trim()) {
      const slug = newTagName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

      let tag = await prisma.tag.findUnique({ where: { slug } });
      if (!tag) {
        tag = await prisma.tag.create({
          data: { name: newTagName.trim(), slug },
        });
      }
      tagIds.push(tag.id);
    }

    // Add existing selected tags
    if (tagsInput) {
      const tagNames = tagsInput
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t.length > 0);

      for (const tagName of tagNames) {
        const slug = tagName
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "");

        // Find or create tag
        let tag = await prisma.tag.findUnique({ where: { slug } });
        if (!tag) {
          tag = await prisma.tag.create({ data: { name: tagName, slug } });
        }
        if (!tagIds.includes(tag.id)) {
          tagIds.push(tag.id);
        }
      }
    }

    // Fallback to existing checkbox tags if any (legacy support or mixed usage)
    const existingTags = formData.getAll("tags") as string[];
    existingTags.forEach((id) => {
      if (!tagIds.includes(id)) tagIds.push(id);
    });

    formData.set("tagIds", JSON.stringify(tagIds));

    // Handle status: draft or published
    const status = (formData.get("status") as string) || "draft";
    const published = status === "published";
    formData.set("published", published ? "true" : "false");
    formData.set("status", status);

    // Validate input
    const validation = validateFormData(PostSchema, formData);
    if (!validation.success) {
      throw new Error(validation.error);
    }

    const { title, slug, content, excerpt, image } = validation.data;

    // Calculate reading time
    const readingTime = calculateReadingTime(content);

    await prisma.post.create({
      data: {
        title,
        slug,
        content,
        excerpt: excerpt || null,
        image: image || null,
        published,
        status,
        readingTime,
        publishedAt: published ? new Date() : null,
        categoryId: categoryId || null,
        tags:
          tagIds.length > 0
            ? {
                connect: tagIds.map((tagId) => ({ id: tagId })),
              }
            : undefined,
      },
    });

    revalidatePath("/blog");
    revalidatePath("/admin/posts");
    redirect("/admin/posts");
  } catch (error) {
    console.error("Error creating post:", error);
    throw error;
  }
}

export async function deletePost(id: string) {
  await prisma.post.delete({ where: { id } });
  revalidatePath("/blog");
  revalidatePath("/admin/posts");
}

// Archive a post (hide from public but keep in admin)
export async function archivePost(id: string) {
  await prisma.post.update({
    where: { id },
    data: {
      status: "archived",
      published: false,
      archivedAt: new Date(),
    },
  });
  revalidatePath("/blog");
  revalidatePath("/admin/posts");
}

// Restore an archived post (directly publish it)
export async function restorePost(id: string) {
  const post = await prisma.post.findUnique({ where: { id } });

  await prisma.post.update({
    where: { id },
    data: {
      status: "published",
      published: true,
      archivedAt: null,
      // Set publishedAt if it wasn't set before
      publishedAt: post?.publishedAt || new Date(),
    },
  });
  revalidatePath("/blog");
  revalidatePath("/admin/posts");
}

export async function updatePost(id: string, formData: FormData) {
  try {
    // Handle Category: Create new if provided
    let categoryId = formData.get("categoryId") as string;
    const newCategoryName = formData.get("newCategory") as string;

    if (newCategoryName) {
      const slug = newCategoryName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

      const existingCategory = await prisma.category.findUnique({
        where: { slug },
      });
      if (existingCategory) {
        categoryId = existingCategory.id;
      } else {
        const newCategory = await prisma.category.create({
          data: { name: newCategoryName, slug },
        });
        categoryId = newCategory.id;
      }
      formData.set("categoryId", categoryId);
    }

    // Handle Tags: Parse comma-separated string and new tag
    const tagsInput = formData.get("tagsInput") as string;
    const newTagName = formData.get("newTag") as string;
    const tagIds: string[] = [];

    // Add new tag if provided
    if (newTagName && newTagName.trim()) {
      const slug = newTagName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

      let tag = await prisma.tag.findUnique({ where: { slug } });
      if (!tag) {
        tag = await prisma.tag.create({
          data: { name: newTagName.trim(), slug },
        });
      }
      tagIds.push(tag.id);
    }

    // Add existing selected tags
    if (tagsInput) {
      const tagNames = tagsInput
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t.length > 0);

      for (const tagName of tagNames) {
        const slug = tagName
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "");

        let tag = await prisma.tag.findUnique({ where: { slug } });
        if (!tag) {
          tag = await prisma.tag.create({ data: { name: tagName, slug } });
        }
        if (!tagIds.includes(tag.id)) {
          tagIds.push(tag.id);
        }
      }
    }

    // Fallback to existing checkbox tags
    const existingTags = formData.getAll("tags") as string[];
    existingTags.forEach((id) => {
      if (!tagIds.includes(id)) tagIds.push(id);
    });

    formData.set("tagIds", JSON.stringify(tagIds));

    // Handle status: draft or published
    const status = (formData.get("status") as string) || "draft";
    const published = status === "published";
    formData.set("published", published ? "true" : "false");
    formData.set("status", status);

    const validation = validateFormData(PostSchema, formData);
    if (!validation.success) {
      throw new Error(validation.error);
    }

    const { title, slug, content, excerpt, image } = validation.data;

    // Calculate reading time
    const readingTime = calculateReadingTime(content);

    // Get current post to check if publishedAt should be set
    const currentPost = await prisma.post.findUnique({ where: { id } });
    const shouldSetPublishedAt = published && !currentPost?.publishedAt;

    await prisma.post.update({
      where: { id },
      data: {
        title,
        slug,
        content,
        excerpt: excerpt || null,
        image: image || null,
        published,
        status,
        readingTime,
        publishedAt: shouldSetPublishedAt ? new Date() : undefined,
        archivedAt: null, // Clear archivedAt when updating normally
        categoryId: categoryId || null,
        tags: {
          set: [],
          connect:
            tagIds.length > 0 ? tagIds.map((tagId) => ({ id: tagId })) : [],
        },
      },
    });

    revalidatePath("/blog");
    revalidatePath(`/blog/${slug}`);
    revalidatePath("/admin/posts");
    redirect("/admin/posts");
  } catch (error) {
    console.error("Error updating post:", error);
    throw error;
  }
}

// Projects
export async function getProjects() {
  return await prisma.project.findMany({ orderBy: { createdAt: "desc" } });
}

export async function createProject(formData: FormData) {
  try {
    const validation = validateFormData(ProjectSchema, formData);
    if (!validation.success) {
      throw new Error(validation.error);
    }

    const {
      title,
      slug,
      description,
      content,
      techStack,
      image,
      demoUrl,
      githubUrl,
      status,
    } = validation.data;

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
        status: status || "Completed",
      },
    });

    revalidatePath("/portfolio");
    revalidatePath("/admin/projects");
    redirect("/admin/projects");
  } catch (error) {
    console.error("Error creating project:", error);
    throw error;
  }
}

export async function deleteProject(id: string) {
  await prisma.project.delete({ where: { id } });
  revalidatePath("/portfolio");
  revalidatePath("/admin/projects");
}

export async function updateProject(id: string, formData: FormData) {
  const title = formData.get("title") as string;
  const slug = formData.get("slug") as string;
  const description = formData.get("description") as string;
  const content = formData.get("content") as string;
  const techStack = formData.get("techStack") as string;
  const image = formData.get("image") as string;

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

  revalidatePath("/portfolio");
  revalidatePath(`/portfolio/${slug}`);
  revalidatePath("/admin/projects");
  redirect("/admin/projects");
}

// Categories
export async function getCategories() {
  return await prisma.category.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { posts: true } } },
  });
}

export async function createCategory(formData: FormData) {
  const name = formData.get("name") as string;
  const slug = formData.get("slug") as string;
  const description = formData.get("description") as string;

  await prisma.category.create({
    data: {
      name,
      slug,
      description,
    },
  });

  revalidatePath("/admin/categories");
}

export async function deleteCategory(id: string) {
  await prisma.category.delete({ where: { id } });
  revalidatePath("/admin/categories");
}

export async function getCategoryById(id: string) {
  return await prisma.category.findUnique({ where: { id } });
}

export async function updateCategory(id: string, formData: FormData) {
  const validation = validateFormData(CategorySchema, formData);
  if (!validation.success) {
    throw new Error(validation.error);
  }

  const { name, slug, description } = validation.data;

  await prisma.category.update({
    where: { id },
    data: { name, slug, description: description || null },
  });

  revalidatePath("/admin/categories");
  revalidatePath("/blog");
  redirect("/admin/categories");
}

// Tags
export async function getTags() {
  return await prisma.tag.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { posts: true } } },
  });
}

export async function createTag(formData: FormData) {
  const name = formData.get("name") as string;
  const slug = formData.get("slug") as string;

  await prisma.tag.create({
    data: {
      name,
      slug,
    },
  });

  revalidatePath("/admin/tags");
}

export async function deleteTag(id: string) {
  await prisma.tag.delete({ where: { id } });
  revalidatePath("/admin/tags");
}

export async function getTagById(id: string) {
  return await prisma.tag.findUnique({ where: { id } });
}

export async function updateTag(id: string, formData: FormData) {
  const validation = validateFormData(TagSchema, formData);
  if (!validation.success) {
    throw new Error(validation.error);
  }

  const { name, slug } = validation.data;

  await prisma.tag.update({
    where: { id },
    data: { name, slug },
  });

  revalidatePath("/admin/tags");
  revalidatePath("/blog");
  redirect("/admin/tags");
}

// Quick create actions for PostForm (return created items)
export async function quickCreateCategory(name: string) {
  "use server";
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  // Check if exists first
  const existingCategory = await prisma.category.findUnique({
    where: { slug },
  });
  if (existingCategory) {
    return existingCategory;
  }

  const newCategory = await prisma.category.create({
    data: { name, slug },
  });

  revalidatePath("/admin/posts");
  revalidatePath("/admin/categories");
  return newCategory;
}

export async function quickCreateTag(name: string) {
  "use server";
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  // Check if exists first
  const existingTag = await prisma.tag.findUnique({ where: { slug } });
  if (existingTag) {
    return existingTag;
  }

  const newTag = await prisma.tag.create({
    data: { name, slug },
  });

  revalidatePath("/admin/posts");
  revalidatePath("/admin/tags");
  return newTag;
}

// Media
export async function getMedia() {
  return await prisma.media.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export async function uploadMedia(formData: FormData) {
  const file = formData.get("file") as File;

  if (!file) {
    throw new Error("No file uploaded");
  }

  // Validation: File size (max 5MB)
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes
  if (file.size > MAX_FILE_SIZE) {
    throw new Error("File size exceeds 5MB limit");
  }

  // Validation: MIME type
  const ALLOWED_MIME_TYPES = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
    "image/svg+xml",
  ];

  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    throw new Error(
      "Invalid file type. Only images (JPEG, PNG, GIF, WebP, SVG) are allowed"
    );
  }

  // Validation: File extension
  const fileExtension = file.name.split(".").pop()?.toLowerCase();
  const ALLOWED_EXTENSIONS = ["jpg", "jpeg", "png", "gif", "webp", "svg"];

  if (!fileExtension || !ALLOWED_EXTENSIONS.includes(fileExtension)) {
    throw new Error("Invalid file extension");
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Create unique filename
  const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
  const filename =
    file.name.replace(/\.[^/.]+$/, "") +
    "-" +
    uniqueSuffix +
    "." +
    fileExtension;
  const uploadDir = join(process.cwd(), "public", "uploads");

  // Ensure upload directory exists
  if (!existsSync(uploadDir)) {
    await mkdir(uploadDir, { recursive: true });
  }

  const filepath = join(uploadDir, filename);

  // Write file to disk
  await writeFile(filepath, buffer);

  // Auto-optimize images (compress and resize if needed)
  let finalFileSize = file.size;
  if (file.type.startsWith("image/") && !file.type.includes("svg")) {
    try {
      const { optimizeImage } = await import("./image-optimizer");
      const result = await optimizeImage(filepath);

      if (result.success && result.savedBytes > 0) {
        finalFileSize = result.optimizedSize;
        console.log(
          `✅ Image optimized: ${result.savedPercent}% reduction (${result.savedBytes} bytes saved)`
        );
      }
    } catch (error) {
      console.warn(
        "⚠️  Image optimization failed, using original file:",
        error
      );
      // Continue with original file if optimization fails
    }
  }

  await prisma.media.create({
    data: {
      filename: filename,
      originalName: file.name,
      url: `/uploads/${filename}`,
      mimeType: file.type,
      size: finalFileSize, // Use optimized size if available
    },
  });

  revalidatePath("/admin/media");
}

export async function deleteMedia(id: string) {
  const media = await prisma.media.findUnique({ where: { id } });

  if (media) {
    const filename = media.url.split("/").pop();
    if (filename) {
      const filepath = join(process.cwd(), "public", "uploads", filename);
      try {
        await unlink(filepath);
      } catch (error) {
        console.error("Error deleting file:", error);
      }
    }

    await prisma.media.delete({ where: { id } });
    revalidatePath("/admin/media");
  }
}

// Dashboard
export async function getDashboardStats() {
  const [postsCount, projectsCount, categoriesCount, tagsCount, recentPosts] =
    await Promise.all([
      prisma.post.count(),
      prisma.project.count(),
      prisma.category.count(),
      prisma.tag.count(),
      prisma.post.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
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
  // Use unstable_noStore to ensure settings are always fresh
  const { unstable_noStore: noStore } = await import("next/cache");
  noStore();

  const settings = await prisma.settings.findMany();

  // Convert array to key-value object
  const settingsObj: Record<string, string> = {};
  settings.forEach((setting) => {
    settingsObj[setting.key] = setting.value;
  });

  return settingsObj;
}

export async function updateSettings(formData: FormData) {
  const settingsToUpdate = [
    "site_name",
    "site_bio",
    "owner_name",
    "contact_email",
    "social_github",
    "social_linkedin",
    "social_twitter",
    "social_instagram",
    "social_whatsapp",
    "seo_description",
    "seo_keywords",
    // Page visibility settings
    "page_blog",
    "page_portfolio",
    "page_watchlist",
    "page_about",
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

  revalidatePath("/admin/settings");
  revalidatePath("/");
  revalidatePath("/about");
  return { success: true };
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

// Enhanced Blog Functions

/**
 * Get featured posts for homepage (most viewed or latest)
 */
export async function getFeaturedPosts(limit: number = 6) {
  return await prisma.post.findMany({
    where: { status: "published" },
    orderBy: [
      { views: "desc" },
      { publishedAt: "desc" },
      { createdAt: "desc" },
    ],
    take: limit,
    include: {
      category: true,
      tags: true,
    },
  });
}

/**
 * Get posts by category
 */
export async function getPostsByCategory(categorySlug: string, limit?: number) {
  const category = await prisma.category.findUnique({
    where: { slug: categorySlug },
  });

  if (!category) return [];

  return await prisma.post.findMany({
    where: {
      status: "published",
      categoryId: category.id,
    },
    orderBy: { publishedAt: "desc" },
    take: limit,
    include: {
      category: true,
      tags: true,
    },
  });
}

/**
 * Get posts by tag
 */
export async function getPostsByTag(tagSlug: string, limit?: number) {
  const tag = await prisma.tag.findUnique({
    where: { slug: tagSlug },
  });

  if (!tag) return [];

  return await prisma.post.findMany({
    where: {
      status: "published",
      tags: {
        some: {
          id: tag.id,
        },
      },
    },
    orderBy: { publishedAt: "desc" },
    take: limit,
    include: {
      category: true,
      tags: true,
    },
  });
}

/**
 * Get related posts based on category and tags
 */
export async function getRelatedPosts(
  postId: string,
  categoryId?: string | null,
  limit: number = 3
) {
  const currentPost = await prisma.post.findUnique({
    where: { id: postId },
    include: { tags: true },
  });

  if (!currentPost) return [];

  const tagIds = currentPost.tags.map((tag) => tag.id);

  // Find posts with same category or shared tags
  const relatedPosts = await prisma.post.findMany({
    where: {
      status: "published",
      id: { not: postId },
      OR: [
        // Same category
        categoryId ? { categoryId } : {},
        // Has shared tags
        tagIds.length > 0
          ? {
              tags: {
                some: {
                  id: { in: tagIds },
                },
              },
            }
          : {},
      ],
    },
    orderBy: [{ views: "desc" }, { publishedAt: "desc" }],
    take: limit,
    include: {
      category: true,
      tags: true,
    },
  });

  return relatedPosts;
}

/**
 * Get published posts only (excludes drafts and archived)
 */
export async function getPublishedPosts(query?: string) {
  return await prisma.post.findMany({
    where: {
      status: "published", // Only published posts, not draft or archived
      OR: query
        ? [{ title: { contains: query } }, { excerpt: { contains: query } }]
        : undefined,
    },
    orderBy: { publishedAt: "desc" },
    include: {
      category: true,
      tags: true,
    },
  });
}

/**
 * Get single post by slug with related data
 */
export async function getPostBySlug(slug: string) {
  return await prisma.post.findUnique({
    where: { slug },
    include: {
      category: true,
      tags: true,
    },
  });
}

/**
 * Get category by slug with post count
 */
export async function getCategoryBySlug(slug: string) {
  return await prisma.category.findUnique({
    where: { slug },
    include: {
      _count: {
        select: { posts: true },
      },
    },
  });
}

/**
 * Get tag by slug with post count
 */
export async function getTagBySlug(slug: string) {
  return await prisma.tag.findUnique({
    where: { slug },
    include: {
      _count: {
        select: { posts: true },
      },
    },
  });
}

// About Page Data
export interface Experience {
  id: string;
  title: string;
  company: string;
  startMonth: string;
  startYear: string;
  endMonth: string;
  endYear: string;
  descriptionEn: string;
  descriptionId: string;
  isCurrent: boolean;
}

export interface Volunteer {
  id: string;
  role: string;
  organization: string;
  period: string;
  descriptionEn: string;
  descriptionId: string;
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  period: string;
  description: string;
}

export interface AboutData {
  name: string;
  title: string;
  tagline: string;
  profileImage: string;
  location: string;
  email: string;
  website: string;
  bio: string;
  cvUrl: string;
  portfolioUrl: string;
  techStack: string;
  tools: string;
  hobbies: string;
  experiences: Experience[];
  volunteering: Volunteer[];
  educations: Education[];
}

export async function getAboutContent(): Promise<AboutData | null> {
  const setting = await prisma.settings.findUnique({
    where: { key: "about_page_content" },
  });

  if (!setting) return null;

  try {
    return JSON.parse(setting.value);
  } catch {
    return null;
  }
}
