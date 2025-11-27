import Link from "next/link";
import Image from 'next/image';
import { notFound } from "next/navigation";
import { Clock, Eye, ArrowLeft, Hash } from "lucide-react";
import { getPostsByTag, getTagBySlug } from "@/lib/actions";
import { formatDate, formatViewCount } from "@/lib/utils";
import { Prisma } from "@prisma/client";

type PostWithRelations = Prisma.PostGetPayload<{
  include: {
    category: true;
    tags: true;
  }
}>;

export default async function TagPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tag = await getTagBySlug(slug);

  if (!tag) {
    notFound();
  }

  const posts = await getPostsByTag(slug) as PostWithRelations[];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Link
            href="/blog"
            className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Blog
          </Link>
        </div>

        {/* Tag Header */}
        <div className="mb-12 pb-8 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3 mb-4">
            <Hash className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              {tag.name}
            </h1>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {tag._count?.posts || 0} {tag._count?.posts === 1 ? 'article' : 'articles'} tagged
          </p>
        </div>

        {/* Posts Grid */}
        {posts.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`} className="group">
                <article className="flex flex-col h-full">
                  {/* Image */}
                  {post.image && (
                    <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800 mb-4">
                      <Image
                        src={post.image}
                        alt={post.title}
                        className="object-cover img-zoom"
                        fill
                        unoptimized
                      />
                    </div>
                  )}

                  {/* Category */}
                  {post.category && (
                    <span className="inline-flex items-center w-fit rounded-md bg-gray-100 dark:bg-gray-800 px-2 py-1 text-xs font-medium text-gray-700 dark:text-gray-300 mb-3">
                      {post.category.name}
                    </span>
                  )}

                  {/* Title */}
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-2 leading-tight">
                    {post.title}
                  </h3>

                  {/* Excerpt */}
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-4 flex-grow">
                    {post.excerpt || ""}
                  </p>

                  {/* Meta */}
                  <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                    <time dateTime={post.publishedAt?.toISOString() || post.createdAt.toISOString()}>
                      {formatDate(post.publishedAt || post.createdAt, 'id-ID')}
                    </time>
                    <span>·</span>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{post.readingTime} min</span>
                    </div>
                    {post.views > 0 && (
                      <>
                        <span>·</span>
                        <div className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          <span>{formatViewCount(post.views)}</span>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Other Tags */}
                  {post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      {post.tags.slice(0, 3).map((t) => (
                        <span
                          key={t.id}
                          className={`inline-flex items-center text-xs ${
                            t.id === tag.id
                              ? 'text-blue-600 dark:text-blue-400 font-medium'
                              : 'text-gray-600 dark:text-gray-400'
                          }`}
                        >
                          #{t.name}
                        </span>
                      ))}
                    </div>
                  )}
                </article>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              Belum ada artikel dengan tag ini.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
