import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ArrowLeft, ExternalLink, Github, Eye } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { incrementProjectViews } from "@/lib/actions";
import { Metadata } from "next";
import Image from "next/image";
import DOMPurify from "isomorphic-dompurify";

// Force dynamic rendering - no build-time database queries
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

// Helper to get localized content
function getLocalizedField(
  id: string | null | undefined,
  en: string | null | undefined,
  locale: string
): string | null {
  if (locale === "en") {
    return en || id || null;
  }
  return id || null;
}

// Static metadata
export const metadata: Metadata = {
  title: "Project",
  description: "View this project",
};

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug, locale } = await params;

  let project;
  try {
    project = await prisma.project.findUnique({
      where: { slug },
    });
  } catch (error) {
    console.error("Database error:", error);
    notFound();
  }

  if (!project) {
    notFound();
  }

  // Increment view count
  await incrementProjectViews(slug);

  const techStackArray = project.techStack
    ? project.techStack.split(",").map((t) => t.trim())
    : [];

  // Get localized description
  const localizedDescription = getLocalizedField(
    project.description,
    project.descriptionEn,
    locale
  );

  // Sanitize HTML content (optimized for SSR)
  const sanitizedContent = project.content
    ? DOMPurify.sanitize(project.content)
    : "";

  return (
    <div className="min-h-screen">
      {/* Header Section */}
      <section className="relative -mt-24 pt-24 border-b border-gray-200/50 dark:border-gray-800/50 backdrop-blur-sm">
        <div className="mx-auto max-w-4xl px-6 lg:px-8 py-12">
          <div className="mb-6">
            <Link href="/portfolio">
              <Button
                variant="ghost"
                size="sm"
                className="gap-2 pl-0 hover:bg-transparent hover:text-blue-600 dark:hover:text-blue-400">
                <ArrowLeft className="h-4 w-4" />{" "}
                {locale === "id" ? "Kembali ke Portfolio" : "Back to Portfolio"}
              </Button>
            </Link>
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl mb-4">
            {project.title}
          </h1>
          {localizedDescription && (
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
              {localizedDescription}
            </p>
          )}

          <div className="flex items-center gap-4 mb-6">
            <span className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
              <Eye className="h-4 w-4" />
              {project.views + 1} {locale === "id" ? "dilihat" : "views"}
            </span>
          </div>

          {techStackArray.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {techStackArray.map((tech) => (
                <span
                  key={tech}
                  className="inline-flex items-center rounded-md bg-blue-50 dark:bg-blue-900/30 px-2 py-1 text-xs font-medium text-blue-700 dark:text-blue-400 ring-1 ring-inset ring-blue-700/10 dark:ring-blue-400/20">
                  {tech}
                </span>
              ))}
            </div>
          )}

          <div className="flex gap-4">
            {project.demoUrl && (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer">
                <Button className="gap-2">
                  <ExternalLink className="h-4 w-4" />{" "}
                  {locale === "id" ? "Demo" : "Live Demo"}
                </Button>
              </a>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer">
                <Button variant="outline" className="gap-2">
                  <Github className="h-4 w-4" />{" "}
                  {locale === "id" ? "Kode Sumber" : "Source Code"}
                </Button>
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Content Section */}
      <div className="mx-auto max-w-4xl px-6 lg:px-8 py-12 lg:py-16">
        {project.image && (
          <div className="relative aspect-video rounded-2xl overflow-hidden shadow-lg mb-12">
            <Image
              src={project.image}
              alt={project.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
              priority
            />
          </div>
        )}

        {sanitizedContent && (
          <div
            className="prose prose-lg prose-blue dark:prose-invert max-w-none text-gray-600 dark:text-gray-300"
            dangerouslySetInnerHTML={{ __html: sanitizedContent }}
          />
        )}
      </div>
    </div>
  );
}
