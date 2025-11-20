import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ArrowLeft, Eye } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { incrementPostViews } from "@/lib/actions";
import { Metadata } from "next";
import Image from "next/image";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.post.findUnique({
    where: { slug },
    select: {
      title: true,
      excerpt: true,
      image: true,
      createdAt: true,
      category: { select: { name: true } },
    },
  });

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return {
    title: post.title,
    description: post.excerpt || post.title,
    openGraph: {
      title: post.title,
      description: post.excerpt || post.title,
      type: 'article',
      publishedTime: post.createdAt.toISOString(),
      images: post.image ? [{ url: post.image }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt || post.title,
      images: post.image ? [post.image] : [],
    },
  };
}

export async function generateStaticParams() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    select: { slug: true },
  });

  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  const post = await prisma.post.findUnique({
    where: { slug },
    include: {
      category: true,
      tags: true,
    },
  });

  if (!post) {
    notFound();
  }

  // Increment view count
  await incrementPostViews(slug);

  return (
    <div className="bg-white dark:bg-gray-900 py-24 sm:py-32 transition-colors duration-300 min-h-screen">
      <div className="mx-auto max-w-3xl px-6 lg:px-8">
        <div className="mb-8">
          <Link href="/blog">
            <Button variant="ghost" size="sm" className="gap-2 pl-0 hover:bg-transparent hover:text-blue-600 dark:hover:text-blue-400">
              <ArrowLeft className="h-4 w-4" /> Kembali ke Blog
            </Button>
          </Link>
        </div>
        
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-x-4 text-xs mb-4">
            <time dateTime={post.createdAt.toISOString()} className="text-gray-500 dark:text-gray-400">
              {new Date(post.createdAt).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            </time>
            {post.category && (
              <span className="relative z-10 rounded-full bg-blue-50 dark:bg-blue-900/30 px-3 py-1.5 font-medium text-blue-600 dark:text-blue-400">
                {post.category.name}
              </span>
            )}
            <span className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
              <Eye className="h-3.5 w-3.5" />
              {post.views + 1}
            </span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl mb-6">
            {post.title}
          </h1>
          {post.excerpt && (
            <p className="text-lg text-gray-600 dark:text-gray-300">
              {post.excerpt}
            </p>
          )}
        </div>

        {post.image && (
          <div className="relative w-full aspect-video mb-12 rounded-2xl overflow-hidden">
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
              priority
            />
          </div>
        )}

        <div 
          className="prose prose-lg prose-blue dark:prose-invert mx-auto text-gray-600 dark:text-gray-300" 
          dangerouslySetInnerHTML={{ __html: post.content }} 
        />

        {post.tags && post.tags.length > 0 && (
          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag.id}
                  className="inline-flex items-center rounded-full bg-gray-100 dark:bg-gray-800 px-3 py-1 text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  #{tag.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
