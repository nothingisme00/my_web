import Link from "next/link";
import { ArrowRight, Sparkles, Instagram, Linkedin, Mail } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { getFeaturedPosts, getSettings } from "@/lib/actions";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { TypewriterText } from "@/components/home/TypewriterText";
import { QuotesCarousel } from "@/components/home/QuotesCarousel";
import { FeaturedPostCard } from "@/components/home/FeaturedPostCard";
import { RecentPostsGrid } from "@/components/home/RecentPostsGrid";
import { getTranslations } from 'next-intl/server';

type PostWithRelations = Prisma.PostGetPayload<{
  include: {
    category: true;
    tags: true;
  }
}>;

async function getAboutData() {
  const setting = await prisma.settings.findUnique({
    where: { key: 'about_page_content' },
  });
  if (!setting) return null;
  try {
    return JSON.parse(setting.value);
  } catch {
    return null;
  }
}

export default async function Home() {
  const [allPosts, settings, aboutData, t] = await Promise.all([
    getFeaturedPosts(9) as Promise<PostWithRelations[]>,
    getSettings(),
    getAboutData(),
    getTranslations('home'),
  ]);

  // Separate featured (first post) and recent posts
  const featuredPost = allPosts[0];
  const recentPosts = allPosts.slice(1, 7);

  return (
    <div className="min-h-screen relative">
      {/* Hero Section - Pure Intro/Welcome */}
      <section className="relative -mt-24 pt-24">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 md:px-8 py-10 sm:py-14 md:py-16 lg:py-16 xl:py-20">
          <div className="max-w-xl md:max-w-2xl lg:max-w-3xl space-y-4 sm:space-y-5 md:space-y-6 lg:space-y-7 animate-fade-in">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 dark:bg-blue-900/30 px-4 py-2 text-sm font-medium text-blue-700 dark:text-blue-400 ring-1 ring-inset ring-blue-700/10 dark:ring-blue-400/20 animate-slide-down">
              <Sparkles className="h-4 w-4" />
              {t('hero.badge')}
            </div>

            {/* Main Heading */}
            <div className="space-y-1 sm:space-y-1.5 md:space-y-2">
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl text-gray-900 dark:text-white animate-slide-up">
                Alfattah Atalarais,
              </h1>
              <div className="text-3xl font-bold sm:text-4xl md:text-5xl lg:text-6xl animate-slide-up" style={{ animationDelay: '0.1s' }}>
                <span className="text-gray-900 dark:text-white">I&apos;m a </span>
                <TypewriterText
                  words={['Learning', 'Creative', 'Tech', 'Art']}
                  className="text-blue-600 dark:text-blue-400"
                />
              </div>
              <p className="text-3xl font-bold sm:text-4xl md:text-5xl lg:text-6xl text-gray-900 dark:text-white animate-slide-up" style={{ animationDelay: '0.15s' }}>
                Enthusiast
              </p>
              <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed animate-slide-up !mt-4 sm:!mt-5 md:!mt-6 max-w-lg" style={{ animationDelay: '0.2s' }}>
                {t('hero.description')}
              </p>
            </div>

            {/* Social Media Icons - Ghost Underline Style */}
            <div className="flex items-center gap-6 animate-slide-up !mt-6 sm:!mt-7 md:!mt-8" style={{ animationDelay: '0.3s' }}>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex flex-col items-center gap-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-300"
                title="Instagram"
              >
                <div className="transition-colors duration-300 group-hover:text-pink-600">
                  <Instagram className="h-6 w-6" />
                </div>
                <span className="absolute -bottom-2 w-0 h-0.5 bg-pink-600 transition-all duration-300 group-hover:w-full" />
              </a>

              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex flex-col items-center gap-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-300"
                title="LinkedIn"
              >
                <div className="transition-colors duration-300 group-hover:text-blue-600">
                  <Linkedin className="h-6 w-6" />
                </div>
                <span className="absolute -bottom-2 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full" />
              </a>

              <a
                href="mailto:hello@example.com"
                className="group relative flex flex-col items-center gap-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-300"
                title="Email"
              >
                <div className="transition-colors duration-300 group-hover:text-gray-900 dark:group-hover:text-white">
                  <Mail className="h-6 w-6" />
                </div>
                <span className="absolute -bottom-2 w-0 h-0.5 bg-gray-900 dark:bg-white transition-all duration-300 group-hover:w-full" />
              </a>
            </div>
          </div>
        </div>


      </section>

      {/* Featured Post + Recent Posts Grid */}
      <section id="articles" className="py-16 lg:py-20 relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">

          {featuredPost && (
            <div className="mb-16">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t('articles.featured')}</h2>
              </div>

              <FeaturedPostCard post={featuredPost} />
            </div>
          )}

          {/* Recent Posts List */}
          {recentPosts.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t('articles.recentTitle')}</h2>
                <Link
                  href="/blog"
                  className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                >
                  {t('articles.viewAll')}
                </Link>
              </div>

              <RecentPostsGrid posts={recentPosts} />
            </div>
          )}

          {/* Empty State */}
          {allPosts.length === 0 && (
            <div className="text-center py-20">
              <p className="text-gray-500 dark:text-gray-400 mb-4">{t('articles.noArticles')}</p>
            </div>
          )}
        </div>
      </section>

      {/* Quotes Section */}
      <QuotesCarousel />

      {/* About Me CTA Section */}
      <section className="py-20 relative">
        <div className="mx-auto max-w-5xl px-6 relative z-10">
          <div className="group relative bg-white dark:bg-gray-800 rounded-3xl p-8 md:px-12 md:py-10 shadow-xl hover:shadow-2xl transition-all duration-500 ease-out border border-gray-100 dark:border-gray-700 overflow-hidden">
            
            {/* Hover Gradient Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 via-transparent to-transparent dark:from-blue-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12">
              <div className="text-center md:text-left flex-1">
                <div className="flex items-center justify-center md:justify-start gap-4 mb-3">
                  <span className="animate-wave origin-bottom-right text-4xl">👋</span>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                    {t('aboutCta.title')}
                  </h2>
                </div>
                
                <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl">
                  {t('aboutCta.description', { name: aboutData?.name || settings.owner_name || 'seseorang' })}
                </p>
              </div>
              
              <div className="flex-shrink-0">
                <Link href="/about">
                  <Button 
                    size="lg" 
                    className="rounded-full px-8 py-6 text-base font-semibold bg-gray-900 text-white hover:bg-black dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 ease-out group/btn whitespace-nowrap"
                  >
                    {t('aboutCta.button')} 
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover/btn:translate-x-1" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
