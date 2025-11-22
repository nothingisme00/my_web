import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ArrowLeft, ExternalLink, Github, Eye } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { incrementProjectViews } from "@/lib/actions";
import { Metadata } from "next";
import Image from "next/image";
import DOMPurify from 'isomorphic-dompurify';

// Enable ISR - revalidate every hour
export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = await prisma.project.findUnique({
    where: { slug },
    select: {
      title: true,
      description: true,
      image: true,
      createdAt: true,
    },
  });

  if (!project) {
    return {
      title: 'Project Not Found',
    };
  }

  return {
    title: project.title,
    description: project.description || project.title,
    openGraph: {
      title: project.title,
      description: project.description || project.title,
      type: 'website',
      images: project.image ? [{ url: project.image }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: project.title,
      description: project.description || project.title,
      images: project.image ? [project.image] : [],
    },
  };
}

export async function generateStaticParams() {
  const projects = await prisma.project.findMany({
    select: { slug: true },
  });

  return projects.map((project) => ({
    slug: project.slug,
  }));
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  const project = await prisma.project.findUnique({
    where: { slug },
  });

  if (!project) {
    notFound();
  }

  // Increment view count
  await incrementProjectViews(slug);

  const techStackArray = project.techStack ? project.techStack.split(',').map(t => t.trim()) : [];

  // Sanitize HTML content (optimized for SSR)
  const sanitizedContent = project.content ? DOMPurify.sanitize(project.content) : '';

  return (
    <div className="bg-white dark:bg-gray-900 py-24 sm:py-32 transition-colors duration-300 min-h-screen">
      <div className="mx-auto max-w-4xl px-6 lg:px-8">
        <div className="mb-8">
          <Link href="/portfolio">
            <Button variant="ghost" size="sm" className="gap-2 pl-0 hover:bg-transparent hover:text-blue-600 dark:hover:text-blue-400">
              <ArrowLeft className="h-4 w-4" /> Kembali ke Portfolio
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl mb-4">
              {project.title}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
              {project.description}
            </p>
            
            <div className="flex items-center gap-2 mb-6">
              <span className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                <Eye className="h-4 w-4" />
                {project.views + 1} views
              </span>
            </div>

            {techStackArray.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                {techStackArray.map((tech) => (
                  <span key={tech} className="inline-flex items-center rounded-md bg-blue-50 dark:bg-blue-900/30 px-2 py-1 text-xs font-medium text-blue-700 dark:text-blue-400 ring-1 ring-inset ring-blue-700/10 dark:ring-blue-400/20">
                    {tech}
                  </span>
                ))}
              </div>
            )}

            <div className="flex gap-4 mb-8">
              {project.demoUrl && (
                <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                  <Button className="gap-2">
                    <ExternalLink className="h-4 w-4" /> Live Demo
                  </Button>
                </a>
              )}
              {project.githubUrl && (
                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" className="gap-2">
                    <Github className="h-4 w-4" /> Source Code
                  </Button>
                </a>
              )}
            </div>
          </div>

          {project.image && (
            <div className="relative aspect-video rounded-2xl overflow-hidden shadow-lg">
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
        </div>

        {sanitizedContent && (
          <div className="mt-16 prose prose-lg prose-blue dark:prose-invert max-w-none text-gray-600 dark:text-gray-300" dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
        )}
      </div>
    </div>
  );
}
