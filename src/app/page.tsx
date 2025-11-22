import Link from "next/link";
import { ArrowRight, Clock, Eye, Sparkles, BookOpen, ChevronDown, Github, Linkedin, Mail, MapPin } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { getFeaturedPosts, getCategories, getSettings } from "@/lib/actions";
import { prisma } from "@/lib/prisma";
import { formatDate, formatViewCount } from "@/lib/utils";
import { Prisma } from "@prisma/client";
import { HeroCarousel } from "@/components/home/HeroCarousel";
import { TypewriterText } from "@/components/home/TypewriterText";
import { QuotesCarousel } from "@/components/home/QuotesCarousel";
import { FeaturedPostCard } from "@/components/home/FeaturedPostCard";
import { RecentPostsGrid } from "@/components/home/RecentPostsGrid";

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
  const [allPosts, categories, settings, aboutData] = await Promise.all([
    getFeaturedPosts(9) as Promise<PostWithRelations[]>,
    getCategories(),
    getSettings(),
    getAboutData(),
  ]);

  // Separate featured (first post) and recent posts
  const featuredPost = allPosts[0];
  const recentPosts = allPosts.slice(1, 7);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300 relative">
      {/* Background Pattern - Full Page */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] dark:opacity-[0.05]" />
      </div>

      {/* Geometric Shapes - Full Page */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none hidden lg:block">
        {/* === TOP SECTION === */}
        <div className="absolute top-20 right-[10%] w-40 h-40 rounded-full border border-gray-300/30 dark:border-gray-600/30" style={{ animation: 'float 25s ease-in-out infinite' }} />
        <div className="absolute top-48 right-[30%] w-24 h-24 rounded-full border border-blue-400/25 dark:border-blue-500/25" style={{ animation: 'float 20s ease-in-out infinite', animationDelay: '-8s' }} />
        <div className="absolute top-32 right-[8%] w-4 h-4 rounded-full bg-blue-500/35 dark:bg-blue-400/35" style={{ animation: 'float 15s ease-in-out infinite', animationDelay: '-3s' }} />
        <div className="absolute top-16 left-[8%] w-32 h-32 rounded-full border border-gray-300/25 dark:border-gray-600/25" style={{ animation: 'float 23s ease-in-out infinite', animationDelay: '-2s' }} />
        <div className="absolute top-40 left-[15%] w-3 h-3 rounded-full bg-gray-500/30 dark:bg-gray-400/30" style={{ animation: 'float 16s ease-in-out infinite', animationDelay: '-6s' }} />
        <div className="absolute top-8 left-[45%] w-16 h-16 rounded-full border border-gray-300/20 dark:border-gray-600/20" style={{ animation: 'float 24s ease-in-out infinite', animationDelay: '-15s' }} />
        <div className="absolute top-36 right-[20%] w-28 h-28 border border-gray-400/25 dark:border-gray-500/25 rotate-45" style={{ animation: 'float 22s ease-in-out infinite', animationDelay: '-5s' }} />

        {/* === MIDDLE SECTION === */}
        <div className="absolute top-[30%] right-[5%] w-20 h-20 rounded-full border border-gray-400/25 dark:border-gray-500/25" style={{ animation: 'float 21s ease-in-out infinite', animationDelay: '-4s' }} />
        <div className="absolute top-[35%] left-[3%] w-16 h-16 border border-gray-400/20 dark:border-gray-500/20 rotate-[30deg]" style={{ animation: 'float 20s ease-in-out infinite', animationDelay: '-8s' }} />
        <div className="absolute top-[40%] right-[35%] w-12 h-12 border border-blue-300/30 dark:border-blue-600/30 rotate-12" style={{ animation: 'float 17s ease-in-out infinite', animationDelay: '-10s' }} />
        <div className="absolute top-[45%] left-[20%] w-6 h-6 rounded-full bg-blue-400/25 dark:bg-blue-500/25" style={{ animation: 'float 18s ease-in-out infinite', animationDelay: '-12s' }} />
        <div className="absolute top-[50%] right-[15%] w-10 h-10 rounded-full border border-gray-300/25 dark:border-gray-600/25" style={{ animation: 'float 19s ease-in-out infinite', animationDelay: '-7s' }} />
        <div className="absolute top-[55%] left-[12%] w-14 h-14 border border-blue-400/20 dark:border-blue-500/20 rotate-[-18deg]" style={{ animation: 'float 21s ease-in-out infinite', animationDelay: '-9s' }} />

        {/* === BOTTOM SECTION === */}
        <div className="absolute top-[65%] right-[8%] w-24 h-24 rounded-full border border-gray-400/20 dark:border-gray-500/20" style={{ animation: 'float 22s ease-in-out infinite', animationDelay: '-3s' }} />
        <div className="absolute top-[70%] left-[5%] w-20 h-20 rounded-full border border-blue-400/20 dark:border-blue-500/20" style={{ animation: 'float 19s ease-in-out infinite', animationDelay: '-9s' }} />
        <div className="absolute top-[75%] right-[25%] w-8 h-8 border border-gray-400/25 dark:border-gray-500/25 rotate-45" style={{ animation: 'float 16s ease-in-out infinite', animationDelay: '-11s' }} />
        <div className="absolute top-[80%] left-[30%] w-5 h-5 rounded-full bg-gray-400/20 dark:bg-gray-500/20" style={{ animation: 'float 15s ease-in-out infinite', animationDelay: '-8s' }} />
        <div className="absolute top-[85%] right-[40%] w-18 h-18 rounded-full border border-blue-300/15 dark:border-blue-600/15" style={{ animation: 'float 23s ease-in-out infinite', animationDelay: '-14s' }} />
        <div className="absolute top-[90%] left-[45%] w-12 h-12 border border-gray-400/20 dark:border-gray-500/20 rotate-[22deg]" style={{ animation: 'float 20s ease-in-out infinite', animationDelay: '-6s' }} />

        {/* === SCATTERED SMALL SHAPES === */}
        <div className="absolute top-[25%] right-[45%] w-3 h-3 rounded-full bg-blue-400/30 dark:bg-blue-500/30" style={{ animation: 'float 14s ease-in-out infinite', animationDelay: '-5s' }} />
        <div className="absolute top-[60%] left-[40%] w-2 h-2 rounded-full bg-gray-500/35 dark:bg-gray-400/35" style={{ animation: 'float 13s ease-in-out infinite', animationDelay: '-10s' }} />
        <div className="absolute top-[42%] right-[50%] w-4 h-4 border border-gray-400/25 dark:border-gray-500/25 rotate-45" style={{ animation: 'float 18s ease-in-out infinite', animationDelay: '-7s' }} />
        <div className="absolute top-[72%] left-[55%] w-3 h-3 rounded-full bg-blue-400/25 dark:bg-blue-500/25" style={{ animation: 'float 16s ease-in-out infinite', animationDelay: '-12s' }} />
        <div className="absolute top-[38%] left-[48%] w-6 h-6 rounded-full border border-gray-300/20 dark:border-gray-600/20" style={{ animation: 'float 21s ease-in-out infinite', animationDelay: '-4s' }} />

        {/* === LINES === */}
        <div className="absolute top-[20%] right-[25%] w-32 h-[1px] bg-gradient-to-r from-transparent via-gray-400/35 to-transparent dark:via-gray-500/35 rotate-[20deg]" />
        <div className="absolute top-[45%] left-[10%] w-24 h-[1px] bg-gradient-to-r from-transparent via-gray-400/25 to-transparent dark:via-gray-500/25 rotate-[-25deg]" />
        <div className="absolute top-[68%] right-[18%] w-20 h-[1px] bg-gradient-to-r from-transparent via-blue-400/25 to-transparent dark:via-blue-500/25 rotate-[35deg]" />
        <div className="absolute top-[82%] left-[22%] w-28 h-[1px] bg-gradient-to-r from-transparent via-gray-400/20 to-transparent dark:via-gray-500/20 rotate-[-10deg]" />

        {/* === TRIANGLES === */}
        <div className="absolute top-[28%] left-[7%] w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[16px] border-b-gray-400/25 dark:border-b-gray-500/25 rotate-[15deg]" style={{ animation: 'float 22s ease-in-out infinite', animationDelay: '-6s' }} />
        <div className="absolute top-[58%] right-[8%] w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[12px] border-b-blue-400/25 dark:border-b-blue-500/25 rotate-[-20deg]" style={{ animation: 'float 18s ease-in-out infinite', animationDelay: '-14s' }} />
        <div className="absolute top-[78%] left-[35%] w-0 h-0 border-l-[7px] border-l-transparent border-r-[7px] border-r-transparent border-b-[12px] border-b-gray-400/20 dark:border-b-gray-500/20 rotate-[-35deg]" style={{ animation: 'float 21s ease-in-out infinite', animationDelay: '-3s' }} />

        {/* === DOTS GROUPS === */}
        <div className="absolute top-[22%] right-[32%] flex gap-2">
          <div className="w-2 h-2 rounded-full bg-gray-400/35 dark:bg-gray-500/35" />
          <div className="w-2 h-2 rounded-full bg-gray-400/45 dark:bg-gray-500/45" />
          <div className="w-2 h-2 rounded-full bg-gray-400/35 dark:bg-gray-500/35" />
        </div>
        <div className="absolute top-[52%] left-[6%] flex flex-col gap-2">
          <div className="w-2 h-2 rounded-full bg-blue-400/30 dark:bg-blue-500/30" />
          <div className="w-2 h-2 rounded-full bg-blue-400/40 dark:bg-blue-500/40" />
          <div className="w-2 h-2 rounded-full bg-blue-400/30 dark:bg-blue-500/30" />
        </div>
        <div className="absolute top-[75%] right-[35%] flex gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-gray-500/30 dark:bg-gray-400/30" />
          <div className="w-1.5 h-1.5 rounded-full bg-gray-500/35 dark:bg-gray-400/35" />
          <div className="w-1.5 h-1.5 rounded-full bg-gray-500/30 dark:bg-gray-400/30" />
        </div>

        {/* === PLUS SIGNS === */}
        <div className="absolute top-[32%] right-[38%]">
          <div className="w-5 h-[2px] bg-gray-400/35 dark:bg-gray-500/35" />
          <div className="w-[2px] h-5 bg-gray-400/35 dark:bg-gray-500/35 -mt-3 ml-[9px]" />
        </div>
        <div className="absolute top-[62%] left-[15%]">
          <div className="w-4 h-[1.5px] bg-blue-400/30 dark:bg-blue-500/30" />
          <div className="w-[1.5px] h-4 bg-blue-400/30 dark:bg-blue-500/30 -mt-2 ml-[7px]" />
        </div>
        <div className="absolute top-[88%] right-[20%] rotate-45">
          <div className="w-4 h-[1.5px] bg-gray-400/25 dark:bg-gray-500/25" />
          <div className="w-[1.5px] h-4 bg-gray-400/25 dark:bg-gray-500/25 -mt-2 ml-[7px]" />
        </div>
      </div>

      {/* Hero Section - Full Width Centered */}
      <section className="relative -mt-24 pt-24">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 md:px-8 py-12 sm:py-16 md:py-20 lg:py-24 xl:py-28">
          <div className="max-w-xl md:max-w-2xl lg:max-w-3xl space-y-3 sm:space-y-4 md:space-y-5 lg:space-y-6 animate-fade-in">
            {/* Badge */}
            <div className="inline-flex items-center gap-1.5 sm:gap-2 rounded-full bg-blue-100 dark:bg-blue-900/30 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-blue-700 dark:text-blue-400 ring-1 ring-inset ring-blue-700/10 dark:ring-blue-400/20 animate-slide-down">
              <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              Hi! It's me
            </div>

            {/* Main Heading */}
            <div className="space-y-0.5 sm:space-y-1 md:space-y-1.5 lg:space-y-2">
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl text-gray-900 dark:text-white animate-slide-up">
                Alfattah Atalarais,
              </h1>
              <div className="text-2xl font-bold sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl animate-slide-up" style={{ animationDelay: '0.1s' }}>
                <span className="text-gray-900 dark:text-white">I'm a </span>
                <TypewriterText
                  words={['Learning', 'Creative', 'Tech', 'Art']}
                  className="text-blue-600 dark:text-blue-400"
                />
              </div>
              <p className="text-2xl font-bold sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl text-gray-900 dark:text-white animate-slide-up" style={{ animationDelay: '0.15s' }}>
                Enthusiast
              </p>
              <p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-300 leading-relaxed animate-slide-up !mt-3 sm:!mt-4 md:!mt-5 lg:!mt-6 max-w-md md:max-w-lg" style={{ animationDelay: '0.2s' }}>
                Sharing experiences and interesting things I want you to know
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row flex-wrap gap-2.5 sm:gap-3 md:gap-4 animate-slide-up" style={{ animationDelay: '0.5s' }}>
              <Link
                href="/blog"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 dark:bg-blue-500 px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 text-xs sm:text-sm font-semibold text-white shadow-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-all duration-200 hover-lift"
              >
                <BookOpen className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                Browse Articles
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-white dark:bg-gray-800 px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 text-xs sm:text-sm font-semibold text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 shadow-sm transition-all duration-200 hover-lift"
              >
                About Me
                <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </Link>
            </div>

            {/* Status Indicators */}
            <div className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-4 md:gap-6 pt-2 sm:pt-3 md:pt-4 animate-slide-up" style={{ animationDelay: '0.6s' }}>
              <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                <MapPin className="h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4" />
                <span>Based in Indonesia</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                <Sparkles className="h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4" />
                <span>Open for collaboration</span>
              </div>
            </div>
          </div>

          {/* Social Links - Right Bottom */}
          <div className="hidden md:flex absolute bottom-12 md:bottom-14 lg:bottom-16 right-6 md:right-8 gap-3 md:gap-4 animate-fade-in" style={{ animationDelay: '0.8s' }}>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 md:p-2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
            >
              <Github className="h-4 w-4 md:h-5 md:w-5" />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 md:p-2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
            >
              <Linkedin className="h-4 w-4 md:h-5 md:w-5" />
            </a>
            <a
              href="mailto:hello@example.com"
              className="p-1.5 md:p-2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
            >
              <Mail className="h-4 w-4 md:h-5 md:w-5" />
            </a>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="hidden md:flex absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 flex-col items-center gap-1.5 md:gap-2 animate-fade-in" style={{ animationDelay: '1s' }}>
          <span className="text-[10px] md:text-xs text-gray-500 dark:text-gray-400">Scroll to explore</span>
          <a href="#articles" className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
            <ChevronDown className="h-5 w-5 md:h-6 md:w-6" style={{ animation: 'bounce-slow 2s ease-in-out infinite' }} />
          </a>
        </div>
      </section>

      {/* Featured Post + Recent Posts Grid */}
      <section id="articles" className="py-16 lg:py-20 relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">

          {featuredPost && (
            <div className="mb-16">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Featured</h2>
              </div>

              <FeaturedPostCard post={featuredPost} />
            </div>
          )}

          {/* Recent Posts List */}
          {recentPosts.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Recent Articles</h2>
                <Link
                  href="/blog"
                  className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                >
                  View all
                </Link>
              </div>

              <RecentPostsGrid posts={recentPosts} />
            </div>
          )}

          {/* Empty State */}
          {allPosts.length === 0 && (
            <div className="text-center py-20">
              <p className="text-gray-500 dark:text-gray-400 mb-4">Belum ada artikel tersedia.</p>
              <Link
                href="/admin/posts/new"
                className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium"
              >
                Buat artikel pertama
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Quotes Section */}
      <QuotesCarousel />

      {/* About Me CTA Section */}
      <section className="py-20 relative">
        <div className="mx-auto max-w-2xl px-6 text-center relative z-10">
          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-8 md:p-12 border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
          <span className="text-4xl mb-4 block">👋</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Hei, salam kenal!
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
            Saya {aboutData?.name || settings.owner_name || 'seseorang'} — suka ngulik hal-hal baru dan berbagi cerita lewat tulisan.
            Kalau kamu penasaran siapa di balik blog ini, yuk kenalan!
          </p>
          <Link href="/about">
            <Button className="gap-2">
              Kenalan yuk <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
