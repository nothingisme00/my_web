import { getProjects } from "@/lib/actions";
import { Briefcase } from "lucide-react";
import { Project } from "@prisma/client";
import { ProjectsGrid } from "@/components/portfolio/ProjectsGrid";
import { isPageEnabled } from "@/lib/page-visibility";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";

export const dynamic = "force-dynamic";

export default async function PortfolioPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("portfolio");
  void locale; // Used by ProjectsGrid

  let projects: Project[] = [];

  try {
    // Check if page is enabled
    const pageEnabled = await isPageEnabled("page_portfolio");
    if (!pageEnabled) {
      notFound();
    }

    projects = (await getProjects()) as Project[];
  } catch (error) {
    console.error("Database error:", error);
  }

  return (
    <div className="min-h-screen">
      {/* Compact Minimal Hero */}
      <section className="relative -mt-24 pt-32 pb-8">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30">
              <Briefcase className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
              Portfolio
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {t("heading")}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-lg">
            {t("subheading")}
          </p>
          {/* Subtle gradient line */}
          <div className="mt-6 h-px bg-gradient-to-r from-blue-500/50 via-purple-500/50 to-transparent max-w-xs" />
        </div>
      </section>

      {/* Content Section */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-8 lg:py-12">
        {projects.length === 0 ? (
          <div className="text-center py-20">
            <Briefcase className="mx-auto h-16 w-16 text-gray-300 dark:text-gray-600" />
            <p className="mt-4 text-gray-500 dark:text-gray-400">
              {t("noProjects")}
            </p>
          </div>
        ) : (
          <ProjectsGrid projects={projects} locale={locale} />
        )}
      </div>
    </div>
  );
}
