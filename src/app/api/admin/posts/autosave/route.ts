import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { calculateReadingTime } from "@/lib/utils";

// Auto-save draft post (minimal validation, just save progress)
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { id, title, slug, content, excerpt, image, categoryId, tags } = data;

    // Basic validation - at least title and slug required
    if (!title || title.length < 3) {
      return NextResponse.json(
        { error: "Title must be at least 3 characters" },
        { status: 400 }
      );
    }

    if (!slug || !/^[a-z0-9-]+$/.test(slug)) {
      return NextResponse.json(
        { error: "Invalid slug format" },
        { status: 400 }
      );
    }

    // Calculate reading time if content exists
    const readingTime = content ? calculateReadingTime(content) : 5;

    if (id) {
      // Update existing draft
      await prisma.post.update({
        where: { id },
        data: {
          title,
          slug,
          content: content || "",
          excerpt: excerpt || null,
          image: image || null,
          readingTime,
          categoryId: categoryId || null,
          tags: tags || null,
          // Keep status as draft
          status: "draft",
          published: false,
        },
      });

      return NextResponse.json({
        success: true,
        id,
        message: "Draft auto-saved",
      });
    } else {
      // Check if slug already exists
      const existingPost = await prisma.post.findUnique({
        where: { slug },
      });

      if (existingPost) {
        return NextResponse.json(
          { error: "Slug already exists" },
          { status: 400 }
        );
      }

      // Create new draft
      const newPost = await prisma.post.create({
        data: {
          title,
          slug,
          content: content || "",
          excerpt: excerpt || null,
          image: image || null,
          readingTime,
          categoryId: categoryId || null,
          tags: tags || null,
          status: "draft",
          published: false,
        },
      });

      return NextResponse.json({
        success: true,
        id: newPost.id,
        message: "New draft created",
      });
    }
  } catch (error) {
    console.error("Auto-save error:", error);
    return NextResponse.json({ error: "Failed to auto-save" }, { status: 500 });
  }
}
