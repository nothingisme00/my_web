import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

// GET - Public: Get all watchlist items
export async function GET() {
  try {
    const items = await prisma.watchlist.findMany({
      orderBy: [{ rating: "desc" }, { createdAt: "desc" }],
    });
    return NextResponse.json(items);
  } catch (error) {
    console.error("Error fetching watchlist:", error);
    return NextResponse.json(
      { error: "Failed to fetch watchlist" },
      { status: 500 }
    );
  }
}

// POST - Admin: Create new watchlist item
export async function POST(request: NextRequest) {
  try {
    await requireAuth(request);

    const body = await request.json();
    const {
      title,
      type,
      genre,
      totalEpisode,
      status,
      rating,
      notesId,
      notesEn,
      imageUrl,
      year,
    } = body;

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const item = await prisma.watchlist.create({
      data: {
        title,
        type: type || "Anime",
        genre: genre || null,
        totalEpisode: totalEpisode ? parseInt(totalEpisode) : null,
        status: status || "Completed",
        rating: rating ? parseFloat(rating) : null,
        notesId: notesId || null,
        notesEn: notesEn || null,
        imageUrl: imageUrl || null,
        year: year ? parseInt(year) : null,
        completedAt: status === "Completed" ? new Date() : null,
      },
    });

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Error creating watchlist item:", error);
    return NextResponse.json(
      { error: "Failed to create watchlist item" },
      { status: 500 }
    );
  }
}
