import Link from "next/link";
import { getPosts } from "@/lib/actions";
import { FadeIn } from "@/components/ui/FadeIn";
import { Prisma } from "@prisma/client";

type PostWithRelations = Prisma.PostGetPayload<{
  include: {
    category: true;
    tags: true;
  }
}>;

export default async function BlogPage() {
  const posts = await getPosts() as PostWithRelations[];

  return (
    <div className="bg-gray-50 dark:bg-gray-950 py-24 sm:py-32 transition-colors duration-300 min-h-screen">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <FadeIn>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl font-display">
              Blog & Insights
            </h2>
            <p className="mt-4 text-lg leading-8 text-gray-600 dark:text-gray-400">
              Tulisan seputar teknologi, gadget, dan pengalaman coding.
            </p>
          </FadeIn>
        </div>
        
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {posts.map((post, index) => (
            <FadeIn key={post.id} delay={index * 100}>
              <Link href={`/blog/${post.slug}`} className="group flex flex-col h-full">
                <article className="flex flex-col h-full overflow-hidden rounded-2xl bg-white dark:bg-gray-900 shadow-sm hover:shadow-2xl hover:scale-[1.02] transition-transform duration-300 ease-out border border-gray-100 dark:border-gray-800 hover:border-blue-100 dark:hover:border-blue-900/50 will-change-transform">
                  {/* Image Container */}
                  <div className="relative aspect-[16/9] w-full overflow-hidden bg-gray-100 dark:bg-gray-800">
                    {post.image ? (
                      <img
                        src={post.image}
                        alt={post.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-gray-400">
                        <span className="text-sm">No Image</span>
                      </div>
                    )}
                    
                    {/* Category Badge - Floating */}
                    {post.category && (
                      <div className="absolute top-4 left-4">
                        <span className="inline-flex items-center rounded-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm px-3 py-1 text-xs font-medium text-gray-900 dark:text-white shadow-sm">
                          {post.category.name}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex flex-1 flex-col p-6">
                    <div className="flex items-center gap-x-4 text-xs text-gray-500 dark:text-gray-400 mb-3">
                      <time dateTime={post.createdAt.toISOString()}>
                        {new Date(post.createdAt).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </time>
                    </div>
                    
                    <h3 className="text-xl font-bold leading-snug text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-3">
                      {post.title}
                    </h3>
                    
                    <p className="flex-1 line-clamp-3 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                      {post.excerpt || "No excerpt available."}
                    </p>

                    {/* Read More Link */}
                    <div className="mt-6 flex items-center text-sm font-medium text-blue-600 dark:text-blue-400">
                      Read article 
                      <svg className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                  </div>
                </article>
              </Link>
            </FadeIn>
          ))}
        </div>

        {posts.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500 dark:text-gray-400">Belum ada artikel yang dipublikasikan.</p>
          </div>
        )}
      </div>
    </div>
  );
}
