import { z } from "zod";

// Auth Schemas
export const LoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

// Post Schemas
export const PostSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(200, "Title too long"),
  slug: z
    .string()
    .regex(
      /^[a-z0-9-]+$/,
      "Slug must contain only lowercase letters, numbers, and hyphens"
    ),
  content: z.string().min(10, "Content must be at least 10 characters"),
  excerpt: z.string().optional(),
  image: z.string().url("Invalid image URL").optional().or(z.literal("")),
  published: z.boolean().default(false),
  status: z.enum(["draft", "published", "archived"]).default("draft"),
  categoryId: z.string().optional().or(z.literal("")),
  tags: z.string().optional(), // Comma-separated tags
  metaDescription: z.string().max(160, "Meta description too long").optional(),
  metaKeywords: z.string().optional(),
});

// Project Schemas
export const ProjectSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(200, "Title too long"),
  slug: z
    .string()
    .regex(
      /^[a-z0-9-]+$/,
      "Slug must contain only lowercase letters, numbers, and hyphens"
    ),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description too long"),
  content: z.string().optional(),
  image: z.string().url("Invalid image URL").optional().or(z.literal("")),
  demoUrl: z.string().url("Invalid demo URL").optional().or(z.literal("")),
  githubUrl: z.string().url("Invalid GitHub URL").optional().or(z.literal("")),
  techStack: z.string().optional(),
  status: z.string().default("Completed"),
});

// Category Schemas
export const CategorySchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name too long"),
  slug: z
    .string()
    .regex(
      /^[a-z0-9-]+$/,
      "Slug must contain only lowercase letters, numbers, and hyphens"
    ),
  description: z.string().max(200, "Description too long").optional(),
});

// Settings Schema
export const SettingsSchema = z.object({
  siteName: z
    .string()
    .min(1, "Site name is required")
    .max(100, "Site name too long"),
  siteDescription: z.string().max(200, "Description too long").optional(),
  siteUrl: z.string().url("Invalid URL").optional(),
  contactEmail: z.string().email("Invalid email").optional(),
  socialLinks: z
    .object({
      twitter: z
        .string()
        .url("Invalid Twitter URL")
        .optional()
        .or(z.literal("")),
      github: z.string().url("Invalid GitHub URL").optional().or(z.literal("")),
      linkedin: z
        .string()
        .url("Invalid LinkedIn URL")
        .optional()
        .or(z.literal("")),
    })
    .optional(),
});

// Helper function to validate FormData
export function validateFormData<T>(
  schema: z.ZodSchema<T>,
  formData: FormData
): { success: true; data: T } | { success: false; error: string } {
  const data: Record<string, unknown> = Object.fromEntries(formData.entries());

  // Convert checkbox values and parse JSON arrays
  for (const [key, value] of Object.entries(data)) {
    if (value === "on" || value === "true") {
      data[key] = true;
    } else if (value === "false") {
      data[key] = false;
    } else if (
      typeof value === "string" &&
      value.startsWith("[") &&
      value.endsWith("]")
    ) {
      try {
        data[key] = JSON.parse(value);
      } catch {
        // Keep as string if not valid JSON
      }
    }
  }

  const result = schema.safeParse(data);

  if (result.success) {
    return { success: true, data: result.data };
  } else {
    const firstError = result.error.issues[0];
    return {
      success: false,
      error: firstError?.message || "Validation failed",
    };
  }
}
