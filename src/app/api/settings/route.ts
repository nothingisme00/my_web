import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requireAuth } from "@/lib/auth";

export async function GET() {
  const settings = await prisma.settings.findMany();

  const settingsObj: Record<string, string> = {};
  settings.forEach((setting) => {
    settingsObj[setting.key] = setting.value;
  });

  return NextResponse.json(settingsObj);
}

export async function POST(request: NextRequest) {
  try {
    // Require authentication
    await requireAuth(request);

    const formData = await request.formData();

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
    revalidatePath("/blog");
    revalidatePath("/portfolio");
    revalidatePath("/watchlist");
    revalidatePath("/en");
    revalidatePath("/id");
    revalidatePath("/en/about");
    revalidatePath("/id/about");
    revalidatePath("/en/blog");
    revalidatePath("/id/blog");
    revalidatePath("/en/portfolio");
    revalidatePath("/id/portfolio");
    revalidatePath("/en/watchlist");
    revalidatePath("/id/watchlist");

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
