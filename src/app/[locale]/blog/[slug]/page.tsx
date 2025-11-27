import Link from "next/link";
import { ArrowLeft, Eye, Clock, Calendar, ArrowRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { incrementPostViews, getRelatedPosts, getAboutContent } from "@/lib/actions";
import { formatDate, formatViewCount } from "@/lib/utils";
import { ShareButtons } from "@/components/blog/ShareButtons";
import { Metadata } from "next";
import Image from "next/image";
import DOMPurify from 'isomorphic-dompurify';
import { Prisma } from "@prisma/client";
import { ReadingProgress } from '@/components/blog/ReadingProgress';
import { BlogContent } from '@/components/blog/BlogContent';
import { ReactionButtons } from '@/components/blog/ReactionButtons';

// Enable ISR - revalidate every hour
export const revalidate = 3600;

type PostWithRelations = Prisma.PostGetPayload<{
  include: {
    category: true;
    tags: true;
  }
}>;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.post.findUnique({
    where: { slug },
    select: {
      title: true,
      excerpt: true,
      image: true,
      author: true,
      publishedAt: true,
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
    authors: post.author ? [{ name: post.author }] : undefined,
    openGraph: {
      title: post.title,
      description: post.excerpt || post.title,
      type: 'article',
      publishedTime: (post.publishedAt || post.createdAt).toISOString(),
      authors: post.author ? [post.author] : undefined,
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

  const [post, aboutData] = await Promise.all([
    prisma.post.findUnique({
      where: { slug },
      include: {
        category: true,
        tags: true,
      },
    }),
    getAboutContent(),
  ]);

  if (!post) {
    notFound();
  }

  // Increment view count
  await incrementPostViews(slug);

  // Get related posts
  const relatedPosts = await getRelatedPosts(post.id, post.categoryId, 3) as PostWithRelations[];

  // Sanitize HTML content (optimized for SSR)
  const sanitizedContent = DOMPurify.sanitize(post.content);

  const postUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/blog/${post.slug}`;

  return (
    <>
      <ReadingProgress />
      <div className="bg-white dark:bg-gray-900 transition-colors duration-300 min-h-screen">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
        <div className="mx-auto max-w-4xl px-6 py-8 lg:px-8">
          {/* Breadcrumb and Category */}
          <div className="flex items-center justify-between mb-6">
            <Link
              href="/blog"
              className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Blog
            </Link>

            {/* Category */}
            {post.category && (
              <Link
                href={`/blog/category/${post.category.slug}`}
                className="inline-flex items-center rounded-full bg-blue-50 dark:bg-blue-900/30 px-3 py-1 text-xs font-medium text-blue-700 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-all duration-200 ease-out"
              >
                {post.category.name}
              </Link>
            )}
          </div>

          {/* Title */}
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
            {post.title}
          </h1>

          {/* Excerpt */}
          {post.excerpt && (
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              {post.excerpt}
            </p>
          )}

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <time dateTime={post.publishedAt?.toISOString() || post.createdAt.toISOString()}>
                {formatDate(post.publishedAt || post.createdAt, 'id-ID')}
              </time>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{post.readingTime} min read</span>
            </div>
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              <span>{formatViewCount(post.views + 1)} views</span>
            </div>
            {post.author && (
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-900 dark:text-white">by {post.author}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Featured Image */}
      {post.image && (
        <div className="mx-auto max-w-5xl px-6 py-12 lg:px-8">
          <div className="relative w-full aspect-[21/9] rounded-2xl overflow-hidden">
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1400px"
              priority
            />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="mx-auto max-w-4xl px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-12 gap-12">
          {/* Sidebar - Social Sharing */}
          <aside className="lg:col-span-2 order-2 lg:order-1">
            <ShareButtons title={post.title} url={postUrl} />
          </aside>

          {/* Article Content */}
          <article className="lg:col-span-10 order-1 lg:order-2">
            <BlogContent content={sanitizedContent} />

            {/* Reaction Buttons */}
            <div className="flex justify-center my-12 py-8 border-y border-gray-200 dark:border-gray-800">
              <ReactionButtons
                slug={post.slug}
                initialReactions={{
                  love: post.reactionsLove,
                  like: post.reactionsLike,
                  wow: post.reactionsWow,
                  fire: post.reactionsFire,
                }}
              />
            </div>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4 uppercase tracking-wider">
                  Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <Link
                      key={tag.id}
                      href={`/blog/tag/${tag.slug}`}
                      className="inline-flex items-center rounded-full bg-gray-100 dark:bg-gray-800 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      #{tag.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </article>
        </div>

        {/* Author Bio */}
        {post.author && (
          <div className="mt-16 pt-12 border-t border-gray-200 dark:border-gray-800">
            <div className="group relative overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800 bg-gradient-to-br from-gray-50/50 to-white dark:from-gray-800/30 dark:to-gray-900/30 p-8 transition-all duration-300 hover:border-gray-300 dark:hover:border-gray-700 hover:shadow-lg">
              {/* Subtle gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 to-blue-50/0 dark:from-blue-900/0 dark:to-blue-900/0 group-hover:from-blue-50/30 group-hover:to-transparent dark:group-hover:from-blue-900/10 dark:group-hover:to-transparent transition-all duration-500" />
              
              <div className="relative flex items-start gap-6">
                {/* Avatar */}
                <div className="relative w-20 h-20 rounded-full overflow-hidden ring-2 ring-gray-200 dark:ring-gray-700 group-hover:ring-blue-400 dark:group-hover:ring-blue-600 transition-all duration-300 shrink-0">
                  {aboutData?.profileImage ? (
                    <Image
                      src={aboutData.profileImage}
                      alt={post.author}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-2xl font-bold">
                      {post.author.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1.5">
                      {aboutData?.name || post.author}
                    </h3>
                    <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                      {aboutData?.tagline || aboutData?.title || 'Learning Enthusiast'}
                    </p>
                  </div>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-5">
                    {aboutData?.bio ? aboutData.bio.split('\n')[0].slice(0, 160) + '...' : 'Passionate about creating beautiful web experiences and sharing knowledge through writing.'}
                  </p>
                  
                  <Link 
                    href="/about"
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors group/link"
                  >
                    View Full Profile 
                    <ArrowRight className="h-4 w-4 transition-transform group-hover/link:translate-x-1" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="mt-16 pt-12 border-t border-gray-200 dark:border-gray-800">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
              Read More
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {relatedPosts.map((relatedPost) => (
                <Link key={relatedPost.id} href={`/blog/${relatedPost.slug}`} className="group">
                  <article className="flex flex-col h-full">
                    {relatedPost.image && (
                      <div className="relative aspect-[16/10] overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800 mb-4">
                        <Image
                          src={relatedPost.image}
                          alt={relatedPost.title}
                          className="object-cover img-zoom"
                          fill
                          unoptimized
                        />
                      </div>
                    )}

                    {relatedPost.category && (
                      <span className="inline-flex items-center w-fit rounded-md bg-gray-100 dark:bg-gray-800 px-2 py-1 text-xs font-medium text-gray-700 dark:text-gray-300 mb-3">
                        {relatedPost.category.name}
                      </span>
                    )}

                    <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-2 leading-tight">
                      {relatedPost.title}
                    </h3>

                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 flex-grow">
                      {relatedPost.excerpt || ""}
                    </p>

                    <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mt-4">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{relatedPost.readingTime} min</span>
                      </div>
                      {relatedPost.views > 0 && (
                        <>
                          <span>·</span>
                          <div className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            <span>{formatViewCount(relatedPost.views)}</span>
                          </div>
                        </>
                      )}
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
    </>
  );
}
