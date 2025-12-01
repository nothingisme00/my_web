import { getSettings, getAboutContent } from "@/lib/actions";
import { getTranslations } from "next-intl/server";
import { AboutContent } from "@/components/about/AboutContent";
import { Metadata } from "next";
import { isPageEnabled } from "@/lib/page-visibility";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });
  const aboutData = await getAboutContent();
  const settings = await getSettings();

  const name = aboutData?.name || settings.owner_name || "Alfattah";
  const title = aboutData?.title || "Learning Enthusiast";
  const bio = aboutData?.bio || "";

  return {
    title: `${t("title")} | ${name}`,
    description: `${title} - ${bio.slice(0, 160)}` || `${t("title")} - ${name}`,
    openGraph: {
      title: `${t("title")} | ${name}`,
      description:
        `${title} - ${bio.slice(0, 160)}` || `${t("title")} - ${name}`,
      images: aboutData?.profileImage ? [{ url: aboutData.profileImage }] : [],
    },
  };
}

export default async function AboutPage() {
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
}
