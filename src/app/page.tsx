import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ArrowRight, Github, Linkedin, Mail } from "lucide-react";
import { FadeIn } from "@/components/ui/FadeIn";
import { getPosts } from "@/lib/actions";
import { Prisma } from "@prisma/client";

type PostWithRelations = Prisma.PostGetPayload<{
  include: {
    category: true;
    tags: true;
  }
}>;

export default async function Home() {
  const posts = await getPosts() as PostWithRelations[];
  const latestPosts = posts.slice(0, 3);

  return (
    <div className="relative isolate overflow-hidden bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Background Gradients */}
      <div
        className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
        aria-hidden="true"
      >
        <div
          className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem] dark:opacity-20"
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
        />
      </div>

      {/* Hero Section */}
      <div className="@container">
        <div className="mx-auto max-w-7xl px-6 pb-24 pt-32 @sm:pt-40 @lg:pt-48 @sm:pb-32 @lg:px-8 @lg:py-32 flex flex-col items-center justify-center text-center min-h-[80vh]">
        <FadeIn>
          <div className="mb-8 flex justify-center">
            <span className="rounded-full bg-blue-600/10 px-3 py-1 text-sm font-semibold leading-6 text-blue-600 ring-1 ring-inset ring-blue-600/10 dark:bg-blue-500/10 dark:text-blue-400 dark:ring-blue-500/20">
              Available for hire
            </span>
          </div>
        </FadeIn>
        
        <FadeIn delay={100}>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white @sm:text-6xl max-w-4xl">
            Building digital experiences with <span className="text-blue-600 dark:text-blue-400">passion</span> and <span className="text-blue-600 dark:text-blue-400">precision</span>.
          </h1>
        </FadeIn>

        <FadeIn delay={200}>
          <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Hi, I'm a Full Stack Developer based in Indonesia. I craft beautiful, high-performance websites and applications that solve real-world problems.
          </p>
        </FadeIn>

        <FadeIn delay={300}>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link href="/blog">
              <Button size="lg" className="gap-2 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all dark:shadow-blue-500/10 dark:hover:shadow-blue-500/30">
                Read My Blog <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/portfolio">
              <Button variant="outline" size="lg" className="dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800">
                View Portfolio
              </Button>
            </Link>
          </div>
        </FadeIn>

        <FadeIn delay={400}>
          <div className="mt-10 flex justify-center gap-x-6 text-gray-400">
            <a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors"><Github className="h-6 w-6" /></a>
            <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"><Linkedin className="h-6 w-6" /></a>
            <a href="#" className="hover:text-red-500 dark:hover:text-red-400 transition-colors"><Mail className="h-6 w-6" /></a>
          </div>
        </FadeIn>
      </div>
      </div>

      {/* Latest Articles Section */}
      <section className="py-24 bg-gray-50/50 dark:bg-gray-800/50 transition-colors duration-300">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <FadeIn>
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">Latest Articles</h2>
              <p className="mt-2 text-lg leading-8 text-gray-600 dark:text-gray-300">
                Thoughts, tutorials, and insights on technology.
              </p>
            </FadeIn>
          </div>
          
          <div className="mx-auto grid max-w-2xl grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            {latestPosts.map((post, index) => (
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
            {latestPosts.length === 0 && (
              <div className="col-span-3 text-center py-12 text-gray-500 dark:text-gray-400">
                <p>No articles found yet.</p>
                <Link href="/admin/posts/new" className="text-blue-600 dark:text-blue-400 hover:underline mt-2 inline-block">
                  Write your first post
                </Link>
              </div>
            )}
          </div>
          
          <div className="mt-12 text-center">
            <Link href="/blog">
              <Button variant="outline" className="gap-2 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800">
                View All Articles <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      <div
        className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
        aria-hidden="true"
      >
        <div
          className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem] dark:opacity-20"
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
        />
      </div>
    </div>
  );
}
