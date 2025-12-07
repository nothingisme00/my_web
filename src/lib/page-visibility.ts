import { prisma } from "@/lib/prisma";

export type PageKey =
  | "page_blog"
  | "page_portfolio"
  | "page_watchlist"
  | "page_about";

export async function isPageEnabled(pageKey: PageKey): Promise<boolean> {
  try {
    const setting = await prisma.settings.findUnique({
      where: { key: pageKey },
    });

    // Default to true if setting doesn't exist
    if (!setting) return true;

    return setting.value !== "false";
  } catch (error) {
    console.error(`Error checking page visibility for ${pageKey}:`, error);
    return true; // Default to showing page on error
  }
}

export async function getPageVisibilitySettings(): Promise<
  Record<string, string>
> {
  try {
    const settings = await prisma.settings.findMany({
      where: {
        key: {
          in: ["page_blog", "page_portfolio", "page_watchlist", "page_about"],
        },
      },
    });

    const result: Record<string, string> = {};
    settings.forEach((s) => {
      result[s.key] = s.value;
    });

    return result;
  } catch (error) {
    console.error("Error fetching page visibility settings:", error);
    return {};
  }
}
