import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  // Fetch all published posts with images
  const posts = await prisma.post.findMany({
    where: { published: true },
    select: {
      slug: true,
      updatedAt: true,
      image: true,
    },
    orderBy: { updatedAt: "desc" },
  });

  // Fetch all projects with images
  const projects = await prisma.project.findMany({
    select: {
      slug: true,
      updatedAt: true,
      image: true,
    },
    orderBy: { updatedAt: "desc" },
  });

  // Fetch all categories
  const categories = await prisma.category.findMany({
    select: {
      slug: true,
      updatedAt: true,
    },
  });

  // Get most recent post/project date for static pages
  const latestPostDate = posts[0]?.updatedAt || new Date();
  const latestProjectDate = projects[0]?.updatedAt || new Date();

  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: latestPostDate, // Use latest post date
      changeFrequency: "daily" as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: latestPostDate,
      changeFrequency: "daily" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/portfolio`,
      lastModified: latestProjectDate,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/gallery`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
  ];

  // Blog posts with images
  const postPages = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.8,
    ...(post.image && {
      images: [post.image],
    }),
  }));

  // Portfolio projects with images
  const projectPages = projects.map((project) => ({
    url: `${baseUrl}/portfolio/${project.slug}`,
    lastModified: project.updatedAt,
    changeFrequency: "monthly" as const,
    priority: 0.7,
    ...(project.image && {
      images: [project.image],
    }),
  }));

  // Category pages
  const categoryPages = categories.map((category) => ({
    url: `${baseUrl}/blog/category/${category.slug}`,
    lastModified: category.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  return [...staticPages, ...postPages, ...projectPages, ...categoryPages];
}
