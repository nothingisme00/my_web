import { NextResponse } from "next/server";
import { getLoginActivity, cleanupOldLoginActivity } from "@/lib/logger";

export async function GET() {
  try {
    // Get last 20 login activities
    const activities = await getLoginActivity(20);

    return NextResponse.json({
      success: true,
      data: activities,
    });
  } catch (error) {
    console.error("Error fetching login activity:", error);
    return NextResponse.json(
      { error: "Failed to fetch login activity" },
      { status: 500 }
    );
  }
}

// DELETE - Cleanup old login activity (older than 30 days)
export async function DELETE() {
  try {
    const deletedCount = await cleanupOldLoginActivity();

    return NextResponse.json({
      success: true,
      message: `Cleaned up ${deletedCount} old login activity records`,
      deletedCount,
    });
  } catch (error) {
    console.error("Error cleaning up login activity:", error);
    return NextResponse.json(
      { error: "Failed to cleanup login activity" },
      { status: 500 }
    );
  }
}
