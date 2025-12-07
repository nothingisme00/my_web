import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

// GET - Get single watchlist item
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const item = await prisma.watchlist.findUnique({
      where: { id },
    });

    if (!item) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    return NextResponse.json(item);
  } catch (error) {
    console.error("Error fetching watchlist item:", error);
    return NextResponse.json(
      { error: "Failed to fetch watchlist item" },
      { status: 500 }
    );
  }
}

// PUT - Admin: Update watchlist item
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth(request);
    const { id } = await params;

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

    const item = await prisma.watchlist.update({
      where: { id },
      data: {
        title,
        type,
        genre: genre || null,
        totalEpisode: totalEpisode ? parseInt(totalEpisode) : null,
        status,
        rating: rating ? parseFloat(rating) : null,
        notesId: notesId || null,
        notesEn: notesEn || null,
        imageUrl: imageUrl || null,
        year: year ? parseInt(year) : null,
        completedAt: status === "Completed" ? new Date() : null,
      },
    });

    return NextResponse.json(item);
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Error updating watchlist item:", error);
    return NextResponse.json(
      { error: "Failed to update watchlist item" },
      { status: 500 }
    );
  }
}

// DELETE - Admin: Delete watchlist item
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth(request);
    const { id } = await params;

    await prisma.watchlist.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Error deleting watchlist item:", error);
    return NextResponse.json(
      { error: "Failed to delete watchlist item" },
      { status: 500 }
    );
  }
}
