import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { getProjects } from "@/lib/actions";
import { Project } from "@prisma/client";
import { FadeIn } from "@/components/ui/FadeIn";

export default async function PortfolioPage() {
  const projects: Project[] = await getProjects();

  return (
    <div className="bg-white dark:bg-gray-900 py-24 sm:py-32 transition-colors duration-300 min-h-screen">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <FadeIn>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">Portfolio</h2>
            <p className="mt-2 text-lg leading-8 text-gray-600 dark:text-gray-300">
              Kumpulan proyek yang pernah saya kerjakan.
            </p>
          </FadeIn>
        </div>
        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {projects.map((project, index) => (
            <FadeIn key={project.id} delay={index * 100}>
              <Link href={`/portfolio/${project.slug}`} className="group block h-full">
                <div className="flex flex-col items-start justify-between border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-200 ease-out hover:-translate-y-1 hover:border-blue-200 dark:hover:border-blue-900/50 bg-white dark:bg-gray-900 h-full">
                  <div className="relative w-full h-48 overflow-hidden">
                    {project.image && (
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-300 ease-out group-hover:scale-105"
                      />
                    )}
                  </div>
                  <div className="p-6 w-full flex flex-col flex-grow">
                    <h3 className="text-lg font-semibold leading-6 text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {project.title}
                    </h3>
                    <p className="mt-2 line-clamp-3 text-sm leading-6 text-gray-600 dark:text-gray-300 flex-grow">
                      {project.description}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2 mb-6">
                      {project.techStack?.split(',').map((tech) => (
                        <span key={tech.trim()} className="inline-flex items-center rounded-md bg-blue-50 dark:bg-blue-900/30 px-2 py-1 text-xs font-medium text-blue-700 dark:text-blue-400 ring-1 ring-inset ring-blue-700/10 dark:ring-blue-400/20">
                          {tech.trim()}
                        </span>
                      ))}
                    </div>
                    <div className="mt-auto flex items-center text-sm font-medium text-blue-600 dark:text-blue-400">
                      Lihat Detail
                      <svg className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            </FadeIn>
          ))}
          {projects.length === 0 && (
            <div className="col-span-3 text-center text-gray-500 dark:text-gray-400">
              Belum ada proyek. Silakan tambahkan dari CMS.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
