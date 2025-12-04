"use client";

import Link from "next/link";
import Image from "next/image";
import { ExternalLink, Github } from "lucide-react";
import {
  StaggerContainer,
  StaggerItem,
} from "@/components/transitions/ScrollReveal";

interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  descriptionEn: string | null;
  image: string | null;
  techStack: string | null;
  demoUrl: string | null;
  githubUrl: string | null;
}

interface ProjectsGridProps {
  projects: Project[];
  locale?: string;
}

// Helper to get localized content
function getLocalizedField(
  id: string | null | undefined,
  en: string | null | undefined,
  locale: string
): string {
  if (locale === "en") {
    return en || id || "";
  }
  return id || "";
}

export function ProjectsGrid({ projects, locale = "id" }: ProjectsGridProps) {
  return (
    <StaggerContainer
      className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
      staggerDelay={0.1}>
      {projects.map((project) => {
        const localizedDescription = getLocalizedField(
          project.description,
          project.descriptionEn,
          locale
        );

        return (
          <StaggerItem key={project.id}>
            <article className="group flex flex-col h-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-md border border-gray-200/60 dark:border-gray-700/60 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300">
              {/* Project Image */}
              {project.image && (
                <div className="relative w-full h-48 overflow-hidden bg-gray-100 dark:bg-gray-800">
                  <Image
                    src={project.image}
                    alt={project.title}
                    className="object-cover img-zoom"
                    fill
                    unoptimized
                  />
                </div>
              )}

              {/* Project Content */}
              <div className="p-6 flex flex-col grow">
                <Link href={`/portfolio/${project.slug}`}>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
                    {project.title}
                  </h3>
                </Link>

                <p className="text-gray-600 dark:text-gray-400 mb-4 grow line-clamp-2">
                  {localizedDescription}
                </p>

                {/* Tech Stack */}
                {project.techStack && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.techStack
                      .split(",")
                      .slice(0, 3)
                      .map((tech) => (
                        <span
                          key={tech.trim()}
                          className="inline-flex items-center rounded-md bg-blue-50 dark:bg-blue-900/30 px-2 py-1 text-xs font-medium text-blue-700 dark:text-blue-400">
                          {tech.trim()}
                        </span>
                      ))}
                  </div>
                )}

                {/* Links */}
                <div className="flex items-center gap-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                  {project.demoUrl && (
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                      <ExternalLink className="h-4 w-4" />
                      {locale === "id" ? "Demo" : "Live Demo"}
                    </a>
                  )}
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                      <Github className="h-4 w-4" />
                      {locale === "id" ? "Kode" : "Source"}
                    </a>
                  )}
                </div>
              </div>
            </article>
          </StaggerItem>
        );
      })}
    </StaggerContainer>
  );
}
