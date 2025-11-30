import { getProjects } from '@/lib/actions';
import { Briefcase } from 'lucide-react';
import { Project } from '@prisma/client';
import { ProjectsGrid } from '@/components/portfolio/ProjectsGrid';

export const metadata = {
  title: 'Portfolio | Projects',
  description: 'A collection of my projects and works',
};

export default async function PortfolioPage() {
  const projects = await getProjects() as Project[];

  return (
    <div className="min-h-screen">
      {/* Header Section - Full Width */}
      <section className="relative -mt-24 pt-24 border-b border-gray-200/50 dark:border-gray-800/50 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 py-16 lg:py-24">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 dark:bg-blue-900/30 px-4 py-2 text-sm font-medium text-blue-700 dark:text-blue-400 mb-4">
              <Briefcase className="h-4 w-4" />
              Portfolio
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl mb-4">
              My Projects
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              A collection of projects I&apos;ve worked on
            </p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-16 lg:py-20">
        {projects.length === 0 ? (
          <div className="text-center py-20">
            <Briefcase className="mx-auto h-16 w-16 text-gray-300 dark:text-gray-600" />
            <p className="mt-4 text-gray-500 dark:text-gray-400">No projects yet</p>
          </div>
        ) : (
          <ProjectsGrid projects={projects} />
        )}
      </div>
    </div>
  );
}
