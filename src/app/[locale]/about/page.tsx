import { getSettings, getAboutContent } from "@/lib/actions";
import { getTranslations } from "next-intl/server";
import { AboutContent } from "@/components/about/AboutContent";
import { isPageEnabled } from "@/lib/page-visibility";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function AboutPage() {
  try {
    // Check if page is enabled
    const pageEnabled = await isPageEnabled("page_about");
    if (!pageEnabled) {
      notFound();
    }

    const [aboutData, settings] = await Promise.all([
      getAboutContent(),
      getSettings(),
    ]);

    return <AboutContent aboutData={aboutData} settings={settings} />;
  } catch (error) {
    console.error("Database error:", error);
    return <div>Loading...</div>;
  }
}
