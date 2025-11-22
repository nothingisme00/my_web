'use client';

import Link from 'next/link';
import { ExternalLink, Github } from 'lucide-react';
import { StaggerContainer, StaggerItem } from '@/components/transitions/ScrollReveal';

interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  image: string | null;
  techStack: string | null;
  demoUrl: string | null;
  githubUrl: string | null;
}

interface ProjectsGridProps {
  projects: Project[];
}

export function ProjectsGrid({ projects }: ProjectsGridProps) {
  return (
    <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-8" staggerDelay={0.1}>
      {projects.map((project) => (
        <StaggerItem key={project.id}>
          <article className="group flex flex-col h-full border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden hover:border-blue-200 dark:hover:border-blue-900/50 hover:shadow-lg transition-all duration-300 ease-out hover:-translate-y-1">
            {/* Project Image */}
            {project.image && (
              <div className="relative w-full h-48 overflow-hidden bg-gray-100 dark:bg-gray-800">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover img-zoom"
                />
              </div>
            )}

            {/* Project Content */}
            <div className="p-6 flex flex-col flex-grow">
              <Link href={`/portfolio/${project.slug}`}>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
                  {project.title}
                </h3>
              </Link>

              <p className="text-gray-600 dark:text-gray-400 mb-4 flex-grow line-clamp-2">
                {project.description}
              </p>

              {/* Tech Stack */}
              {project.techStack && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.techStack.split(',').slice(0, 3).map((tech) => (
                    <span
                      key={tech.trim()}
                      className="inline-flex items-center rounded-md bg-blue-50 dark:bg-blue-900/30 px-2 py-1 text-xs font-medium text-blue-700 dark:text-blue-400"
                    >
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
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Live Demo
                  </a>
                )}
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    <Github className="h-4 w-4" />
                    Source
                  </a>
                )}
              </div>
            </div>
          </article>
        </StaggerItem>
      ))}
    </StaggerContainer>
  );
}
