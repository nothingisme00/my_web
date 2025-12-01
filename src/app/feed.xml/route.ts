import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const revalidate = 3600; // Cache for 1 hour

export async function GET() {
  try {
    // Fetch 20 most recent published posts
    const posts = await prisma.post.findMany({
      where: { published: true },
      orderBy: { publishedAt: "desc" },
      take: 20,
      include: {
        category: true,
        tags: true,
      },
    });

    // Get site settings for RSS metadata
    const siteSettings = await prisma.settings.findUnique({
      where: { key: "general_settings" },
    });

    const siteTitle = siteSettings
      ? JSON.parse(siteSettings.value).siteName || "Alfattah Atalarais Blog"
      : "Alfattah Atalarais Blog";

    const siteDescription = siteSettings
      ? JSON.parse(siteSettings.value).siteDescription ||
        "Learning, Creative, Tech, and Art Enthusiast"
      : "Learning, Creative, Tech, and Art Enthusiast";

    // Get base URL from environment or default
    const baseUrl =
      process.env.NEXT_PUBLIC_SITE_URL || "https://yourdomain.com";

    // Generate RSS 2.0 XML
    const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
     xmlns:content="http://purl.org/rss/1.0/modules/content/"
     xmlns:dc="http://purl.org/dc/elements/1.1/"
     xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(siteTitle)}</title>
    <description>${escapeXml(siteDescription)}</description>
    <link>${baseUrl}</link>
    <language>id-ID</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml" />
    <generator>Next.js 15</generator>
${posts
  .map((post) => {
    const postUrl = `${baseUrl}/blog/${post.slug}`;
    const pubDate = post.publishedAt || post.createdAt;

    // Clean content for RSS (remove problematic HTML, keep basic formatting)
    const cleanContent = post.content
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "");

    return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${postUrl}</link>
      <guid isPermaLink="true">${postUrl}</guid>
      <pubDate>${pubDate.toUTCString()}</pubDate>
      <description>${escapeXml(post.excerpt || "")}</description>
      <content:encoded><![CDATA[${cleanContent}]]></content:encoded>
      ${
        post.category
          ? `<category>${escapeXml(post.category.name)}</category>`
          : ""
      }
      ${post.tags
        .map((tag) => `<category>${escapeXml(tag.name)}</category>`)
        .join("\n      ")}
      ${post.image ? `<enclosure url="${post.image}" type="image/jpeg" />` : ""}
    </item>`;
  })
  .join("\n")}
  </channel>
</rss>`;

    return new NextResponse(rss, {
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200",
      },
    });
  } catch (error) {
    console.error("RSS feed generation error:", error);
    return new NextResponse("Error generating RSS feed", { status: 500 });
  }
}

/**
 * Escape XML special characters
 */
function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
