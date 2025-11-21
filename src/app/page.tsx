import Link from "next/link";
import { ArrowRight, Clock, Eye, Sparkles, BookOpen, ChevronDown, Github, Linkedin, Mail, MapPin } from "lucide-react";
import { getFeaturedPosts, getCategories } from "@/lib/actions";
import { formatDate, formatViewCount } from "@/lib/utils";
import { Prisma } from "@prisma/client";
import { HeroCarousel } from "@/components/home/HeroCarousel";
import { TypewriterText } from "@/components/home/TypewriterText";

type PostWithRelations = Prisma.PostGetPayload<{
  include: {
    category: true;
    tags: true;
  }
}>;

export default async function Home() {
  const allPosts = await getFeaturedPosts(9) as PostWithRelations[];
  const categories = await getCategories();

  // Separate featured (first post) and recent posts
  const featuredPost = allPosts[0];
  const recentPosts = allPosts.slice(1, 7);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Hero Section - Full Width Centered */}
      <section className="relative overflow-hidden border-b border-gray-200 dark:border-gray-800">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
          <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] dark:opacity-[0.05]" />
        </div>

        {/* Geometric Shapes - Entire Hero */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none hidden lg:block">
          {/* === RIGHT SIDE === */}
          {/* Large circle outline */}
          <div
            className="absolute top-20 right-[10%] w-40 h-40 rounded-full border border-gray-300/20 dark:border-gray-600/20"
            style={{ animation: 'float 25s ease-in-out infinite' }}
          />
          {/* Medium circle */}
          <div
            className="absolute top-48 right-[30%] w-24 h-24 rounded-full border border-blue-400/15 dark:border-blue-500/15"
            style={{ animation: 'float 20s ease-in-out infinite', animationDelay: '-8s' }}
          />
          {/* Small filled circle */}
          <div
            className="absolute top-32 right-[8%] w-4 h-4 rounded-full bg-blue-500/25 dark:bg-blue-400/25"
            style={{ animation: 'float 15s ease-in-out infinite', animationDelay: '-3s' }}
          />
          {/* Tiny circle */}
          <div
            className="absolute top-72 right-[15%] w-2 h-2 rounded-full bg-gray-500/30 dark:bg-gray-400/30"
            style={{ animation: 'float 18s ease-in-out infinite', animationDelay: '-12s' }}
          />
          {/* Extra circle right bottom */}
          <div
            className="absolute bottom-24 right-[5%] w-20 h-20 rounded-full border border-gray-400/15 dark:border-gray-500/15"
            style={{ animation: 'float 21s ease-in-out infinite', animationDelay: '-4s' }}
          />
          {/* Rotated square large */}
          <div
            className="absolute top-36 right-[20%] w-28 h-28 border border-gray-400/15 dark:border-gray-500/15 rotate-45"
            style={{ animation: 'float 22s ease-in-out infinite', animationDelay: '-5s' }}
          />
          {/* Rotated square small */}
          <div
            className="absolute top-64 right-[35%] w-12 h-12 border border-blue-300/20 dark:border-blue-600/20 rotate-12"
            style={{ animation: 'float 17s ease-in-out infinite', animationDelay: '-10s' }}
          />
          {/* Rectangle */}
          <div
            className="absolute top-80 right-[12%] w-16 h-8 border border-gray-300/20 dark:border-gray-600/20 rotate-[-8deg]"
            style={{ animation: 'float 19s ease-in-out infinite', animationDelay: '-7s' }}
          />

          {/* === LEFT SIDE === */}
          {/* Large circle left */}
          <div
            className="absolute top-16 left-[8%] w-32 h-32 rounded-full border border-gray-300/15 dark:border-gray-600/15"
            style={{ animation: 'float 23s ease-in-out infinite', animationDelay: '-2s' }}
          />
          {/* Medium circle left */}
          <div
            className="absolute bottom-32 left-[5%] w-20 h-20 rounded-full border border-blue-400/10 dark:border-blue-500/10"
            style={{ animation: 'float 19s ease-in-out infinite', animationDelay: '-9s' }}
          />
          {/* Small filled circle left */}
          <div
            className="absolute top-40 left-[15%] w-3 h-3 rounded-full bg-gray-500/20 dark:bg-gray-400/20"
            style={{ animation: 'float 16s ease-in-out infinite', animationDelay: '-6s' }}
          />
          {/* Tiny circle left bottom */}
          <div
            className="absolute bottom-48 left-[12%] w-2 h-2 rounded-full bg-blue-400/25 dark:bg-blue-500/25"
            style={{ animation: 'float 14s ease-in-out infinite', animationDelay: '-11s' }}
          />
          {/* Square left */}
          <div
            className="absolute top-56 left-[3%] w-16 h-16 border border-gray-400/10 dark:border-gray-500/10 rotate-[30deg]"
            style={{ animation: 'float 20s ease-in-out infinite', animationDelay: '-8s' }}
          />
          {/* Rectangle left */}
          <div
            className="absolute bottom-40 left-[18%] w-12 h-6 border border-blue-300/15 dark:border-blue-600/15 rotate-[-12deg]"
            style={{ animation: 'float 18s ease-in-out infinite', animationDelay: '-3s' }}
          />

          {/* === CENTER/TOP === */}
          {/* Circle top center */}
          <div
            className="absolute top-8 left-[45%] w-16 h-16 rounded-full border border-gray-300/10 dark:border-gray-600/10"
            style={{ animation: 'float 24s ease-in-out infinite', animationDelay: '-15s' }}
          />
          {/* Small circle top */}
          <div
            className="absolute top-24 left-[55%] w-3 h-3 rounded-full bg-gray-400/20 dark:bg-gray-500/20"
            style={{ animation: 'float 17s ease-in-out infinite', animationDelay: '-7s' }}
          />

          {/* === BOTTOM === */}
          {/* Circle bottom center */}
          <div
            className="absolute bottom-16 left-[40%] w-24 h-24 rounded-full border border-gray-400/10 dark:border-gray-500/10"
            style={{ animation: 'float 21s ease-in-out infinite', animationDelay: '-13s' }}
          />
          {/* Small circle bottom */}
          <div
            className="absolute bottom-28 left-[60%] w-4 h-4 rounded-full bg-blue-400/15 dark:bg-blue-500/15"
            style={{ animation: 'float 16s ease-in-out infinite', animationDelay: '-5s' }}
          />

          {/* === LINES === */}
          <div className="absolute top-56 right-[25%] w-32 h-[1px] bg-gradient-to-r from-transparent via-gray-400/25 to-transparent dark:via-gray-500/25 rotate-[20deg]" />
          <div className="absolute top-44 right-[5%] w-20 h-[1px] bg-gradient-to-r from-transparent via-blue-400/20 to-transparent dark:via-blue-500/20 rotate-[-15deg]" />
          <div className="absolute top-88 right-[28%] w-16 h-[1px] bg-gradient-to-r from-transparent via-gray-500/20 to-transparent dark:via-gray-400/20 rotate-[45deg]" />
          <div className="absolute top-32 left-[10%] w-24 h-[1px] bg-gradient-to-r from-transparent via-gray-400/15 to-transparent dark:via-gray-500/15 rotate-[-25deg]" />
          <div className="absolute bottom-36 left-[8%] w-20 h-[1px] bg-gradient-to-r from-transparent via-blue-400/15 to-transparent dark:via-blue-500/15 rotate-[35deg]" />
          <div className="absolute bottom-20 right-[40%] w-28 h-[1px] bg-gradient-to-r from-transparent via-gray-400/15 to-transparent dark:via-gray-500/15 rotate-[-10deg]" />

          {/* === DOTS === */}
          <div className="absolute top-28 right-[32%] flex gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-gray-400/25 dark:bg-gray-500/25" />
            <div className="w-1.5 h-1.5 rounded-full bg-gray-400/35 dark:bg-gray-500/35" />
            <div className="w-1.5 h-1.5 rounded-full bg-gray-400/25 dark:bg-gray-500/25" />
          </div>
          <div className="absolute top-60 right-[6%] flex flex-col gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-400/20 dark:bg-blue-500/20" />
            <div className="w-1.5 h-1.5 rounded-full bg-blue-400/30 dark:bg-blue-500/30" />
            <div className="w-1.5 h-1.5 rounded-full bg-blue-400/20 dark:bg-blue-500/20" />
          </div>
          <div className="absolute bottom-44 left-[6%] flex gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-gray-400/20 dark:bg-gray-500/20" />
            <div className="w-1.5 h-1.5 rounded-full bg-gray-400/25 dark:bg-gray-500/25" />
            <div className="w-1.5 h-1.5 rounded-full bg-gray-400/20 dark:bg-gray-500/20" />
          </div>
          <div className="absolute top-48 left-[20%] flex flex-col gap-1.5">
            <div className="w-1 h-1 rounded-full bg-blue-400/15 dark:bg-blue-500/15" />
            <div className="w-1 h-1 rounded-full bg-blue-400/25 dark:bg-blue-500/25" />
          </div>
          <div className="absolute bottom-32 right-[35%] flex gap-1.5">
            <div className="w-1 h-1 rounded-full bg-gray-500/20 dark:bg-gray-400/20" />
            <div className="w-1 h-1 rounded-full bg-gray-500/25 dark:bg-gray-400/25" />
            <div className="w-1 h-1 rounded-full bg-gray-500/20 dark:bg-gray-400/20" />
          </div>

          {/* === PLUS & CROSS === */}
          <div className="absolute top-52 right-[38%]">
            <div className="w-4 h-[1px] bg-gray-400/25 dark:bg-gray-500/25" />
            <div className="w-[1px] h-4 bg-gray-400/25 dark:bg-gray-500/25 -mt-2 ml-[7px]" />
          </div>
          <div className="absolute top-76 right-[22%] rotate-45">
            <div className="w-3 h-[1px] bg-blue-400/20 dark:bg-blue-500/20" />
            <div className="w-[1px] h-3 bg-blue-400/20 dark:bg-blue-500/20 -mt-1.5 ml-[5px]" />
          </div>
          <div className="absolute bottom-52 left-[15%]">
            <div className="w-3 h-[1px] bg-gray-400/20 dark:bg-gray-500/20" />
            <div className="w-[1px] h-3 bg-gray-400/20 dark:bg-gray-500/20 -mt-1.5 ml-[5px]" />
          </div>
          <div className="absolute top-20 left-[25%] rotate-45">
            <div className="w-2.5 h-[1px] bg-blue-400/15 dark:bg-blue-500/15" />
            <div className="w-[1px] h-2.5 bg-blue-400/15 dark:bg-blue-500/15 -mt-1 ml-[4px]" />
          </div>

          {/* === TRIANGLES (using borders) === */}
          <div className="absolute top-64 left-[7%] w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[14px] border-b-gray-400/15 dark:border-b-gray-500/15 rotate-[15deg]"
            style={{ animation: 'float 22s ease-in-out infinite', animationDelay: '-6s' }}
          />
          <div className="absolute bottom-48 right-[8%] w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[10px] border-b-blue-400/15 dark:border-b-blue-500/15 rotate-[-20deg]"
            style={{ animation: 'float 18s ease-in-out infinite', animationDelay: '-14s' }}
          />
          <div className="absolute top-36 right-[42%] w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-b-[9px] border-b-gray-400/10 dark:border-b-gray-500/10 rotate-[45deg]"
            style={{ animation: 'float 19s ease-in-out infinite', animationDelay: '-9s' }}
          />
          <div className="absolute bottom-24 left-[35%] w-0 h-0 border-l-[7px] border-l-transparent border-r-[7px] border-r-transparent border-b-[12px] border-b-blue-400/10 dark:border-b-blue-500/10 rotate-[-35deg]"
            style={{ animation: 'float 21s ease-in-out infinite', animationDelay: '-3s' }}
          />

          {/* === EXTRA CIRCLES === */}
          <div className="absolute top-12 right-[38%] w-6 h-6 rounded-full border border-gray-400/15 dark:border-gray-500/15"
            style={{ animation: 'float 16s ease-in-out infinite', animationDelay: '-2s' }}
          />
          <div className="absolute top-44 right-[48%] w-10 h-10 rounded-full border border-blue-300/10 dark:border-blue-600/10"
            style={{ animation: 'float 23s ease-in-out infinite', animationDelay: '-11s' }}
          />
          <div className="absolute bottom-56 right-[18%] w-14 h-14 rounded-full border border-gray-300/15 dark:border-gray-600/15"
            style={{ animation: 'float 20s ease-in-out infinite', animationDelay: '-7s' }}
          />
          <div className="absolute top-80 left-[28%] w-8 h-8 rounded-full border border-blue-400/10 dark:border-blue-500/10"
            style={{ animation: 'float 18s ease-in-out infinite', animationDelay: '-15s' }}
          />
          <div className="absolute bottom-64 left-[42%] w-5 h-5 rounded-full bg-gray-400/10 dark:bg-gray-500/10"
            style={{ animation: 'float 15s ease-in-out infinite', animationDelay: '-8s' }}
          />
          <div className="absolute top-28 left-[38%] w-3 h-3 rounded-full bg-blue-400/15 dark:bg-blue-500/15"
            style={{ animation: 'float 17s ease-in-out infinite', animationDelay: '-4s' }}
          />
          <div className="absolute bottom-40 right-[48%] w-2 h-2 rounded-full bg-gray-500/20 dark:bg-gray-400/20"
            style={{ animation: 'float 14s ease-in-out infinite', animationDelay: '-10s' }}
          />
          <div className="absolute top-60 left-[48%] w-12 h-12 rounded-full border border-gray-400/8 dark:border-gray-500/8"
            style={{ animation: 'float 24s ease-in-out infinite', animationDelay: '-16s' }}
          />

          {/* === EXTRA SQUARES === */}
          <div className="absolute top-16 right-[45%] w-10 h-10 border border-gray-300/10 dark:border-gray-600/10 rotate-[22deg]"
            style={{ animation: 'float 21s ease-in-out infinite', animationDelay: '-5s' }}
          />
          <div className="absolute bottom-28 left-[25%] w-8 h-8 border border-blue-400/10 dark:border-blue-500/10 rotate-[-18deg]"
            style={{ animation: 'float 19s ease-in-out infinite', animationDelay: '-12s' }}
          />
          <div className="absolute top-72 right-[45%] w-6 h-6 border border-gray-400/12 dark:border-gray-500/12 rotate-[60deg]"
            style={{ animation: 'float 17s ease-in-out infinite', animationDelay: '-8s' }}
          />
          <div className="absolute bottom-52 right-[28%] w-14 h-14 border border-blue-300/8 dark:border-blue-600/8 rotate-[15deg]"
            style={{ animation: 'float 22s ease-in-out infinite', animationDelay: '-1s' }}
          />

          {/* === EXTRA LINES === */}
          <div className="absolute top-20 left-[42%] w-16 h-[1px] bg-gradient-to-r from-transparent via-gray-400/20 to-transparent dark:via-gray-500/20 rotate-[55deg]" />
          <div className="absolute top-68 right-[38%] w-20 h-[1px] bg-gradient-to-r from-transparent via-blue-400/15 to-transparent dark:via-blue-500/15 rotate-[-30deg]" />
          <div className="absolute bottom-60 left-[30%] w-14 h-[1px] bg-gradient-to-r from-transparent via-gray-500/15 to-transparent dark:via-gray-400/15 rotate-[70deg]" />
          <div className="absolute top-48 left-[5%] w-18 h-[1px] bg-gradient-to-r from-transparent via-blue-400/10 to-transparent dark:via-blue-500/10 rotate-[-45deg]" />
          <div className="absolute bottom-20 left-[22%] w-12 h-[1px] bg-gradient-to-r from-transparent via-gray-400/15 to-transparent dark:via-gray-500/15 rotate-[25deg]" />
          <div className="absolute top-36 right-[8%] w-10 h-[1px] bg-gradient-to-r from-transparent via-gray-500/12 to-transparent dark:via-gray-400/12 rotate-[-60deg]" />

          {/* === EXTRA DOTS === */}
          <div className="absolute top-16 left-[32%] flex gap-1">
            <div className="w-1 h-1 rounded-full bg-gray-400/20 dark:bg-gray-500/20" />
            <div className="w-1 h-1 rounded-full bg-gray-400/15 dark:bg-gray-500/15" />
          </div>
          <div className="absolute bottom-36 right-[42%] flex flex-col gap-1">
            <div className="w-1 h-1 rounded-full bg-blue-400/15 dark:bg-blue-500/15" />
            <div className="w-1 h-1 rounded-full bg-blue-400/20 dark:bg-blue-500/20" />
            <div className="w-1 h-1 rounded-full bg-blue-400/15 dark:bg-blue-500/15" />
          </div>
          <div className="absolute top-52 right-[12%] flex gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-gray-500/15 dark:bg-gray-400/15" />
            <div className="w-1.5 h-1.5 rounded-full bg-gray-500/20 dark:bg-gray-400/20" />
          </div>
          <div className="absolute bottom-24 left-[48%] flex gap-1">
            <div className="w-1 h-1 rounded-full bg-blue-400/18 dark:bg-blue-500/18" />
            <div className="w-1 h-1 rounded-full bg-blue-400/12 dark:bg-blue-500/12" />
            <div className="w-1 h-1 rounded-full bg-blue-400/18 dark:bg-blue-500/18" />
          </div>
          <div className="absolute top-40 right-[28%] flex flex-col gap-1">
            <div className="w-1 h-1 rounded-full bg-gray-400/15 dark:bg-gray-500/15" />
            <div className="w-1 h-1 rounded-full bg-gray-400/20 dark:bg-gray-500/20" />
          </div>

          {/* === EXTRA PLUS/CROSS === */}
          <div className="absolute top-24 right-[48%]">
            <div className="w-3 h-[1px] bg-gray-400/15 dark:bg-gray-500/15" />
            <div className="w-[1px] h-3 bg-gray-400/15 dark:bg-gray-500/15 -mt-1.5 ml-[5px]" />
          </div>
          <div className="absolute bottom-44 left-[38%] rotate-45">
            <div className="w-2.5 h-[1px] bg-blue-400/12 dark:bg-blue-500/12" />
            <div className="w-[1px] h-2.5 bg-blue-400/12 dark:bg-blue-500/12 -mt-1 ml-[4px]" />
          </div>
          <div className="absolute top-68 left-[12%]">
            <div className="w-2 h-[1px] bg-gray-500/15 dark:bg-gray-400/15" />
            <div className="w-[1px] h-2 bg-gray-500/15 dark:bg-gray-400/15 -mt-1 ml-[3px]" />
          </div>
          <div className="absolute bottom-56 right-[32%] rotate-[30deg]">
            <div className="w-3 h-[1px] bg-blue-400/10 dark:bg-blue-500/10" />
            <div className="w-[1px] h-3 bg-blue-400/10 dark:bg-blue-500/10 -mt-1.5 ml-[5px]" />
          </div>

          {/* === RINGS (double circles) === */}
          <div className="absolute top-32 right-[52%]">
            <div className="w-8 h-8 rounded-full border border-gray-400/10 dark:border-gray-500/10" />
            <div className="w-5 h-5 rounded-full border border-gray-400/15 dark:border-gray-500/15 absolute top-1.5 left-1.5" />
          </div>
          <div className="absolute bottom-36 left-[8%]">
            <div className="w-10 h-10 rounded-full border border-blue-400/8 dark:border-blue-500/8" />
            <div className="w-6 h-6 rounded-full border border-blue-400/12 dark:border-blue-500/12 absolute top-2 left-2" />
          </div>

          {/* === DIAMONDS === */}
          <div className="absolute top-56 right-[55%] w-4 h-4 border border-gray-400/15 dark:border-gray-500/15 rotate-45"
            style={{ animation: 'float 18s ease-in-out infinite', animationDelay: '-7s' }}
          />
          <div className="absolute bottom-32 right-[15%] w-3 h-3 border border-blue-400/12 dark:border-blue-500/12 rotate-45"
            style={{ animation: 'float 16s ease-in-out infinite', animationDelay: '-11s' }}
          />
          <div className="absolute top-44 left-[28%] w-5 h-5 border border-gray-300/10 dark:border-gray-600/10 rotate-45"
            style={{ animation: 'float 20s ease-in-out infinite', animationDelay: '-3s' }}
          />
        </div>

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
      <section id="articles" className="py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">

          {featuredPost && (
            <div className="mb-16">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Featured</h2>
              </div>

              {/* Large Featured Post */}
              <Link href={`/blog/${featuredPost.slug}`} className="group">
                <article className="grid lg:grid-cols-2 gap-8 lg:gap-12 border border-gray-200 dark:border-gray-800 rounded-2xl p-8 lg:p-10 hover:border-blue-200 dark:hover:border-blue-900/50 hover:shadow-lg transition-all duration-200">

                  {/* Image */}
                  {featuredPost.image && (
                    <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800">
                      <img
                        src={featuredPost.image}
                        alt={featuredPost.title}
                        className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-103"
                      />
                    </div>
                  )}

                  {/* Content */}
                  <div className="flex flex-col justify-center space-y-4">
                    {featuredPost.category && (
                      <span className="inline-flex items-center w-fit rounded-full bg-blue-50 dark:bg-blue-900/30 px-3 py-1 text-xs font-medium text-blue-700 dark:text-blue-400 ring-1 ring-inset ring-blue-700/10 dark:ring-blue-400/20">
                        {featuredPost.category.name}
                      </span>
                    )}

                    <h3 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-tight">
                      {featuredPost.title}
                    </h3>

                    <p className="text-lg text-gray-600 dark:text-gray-300 line-clamp-3">
                      {featuredPost.excerpt || ""}
                    </p>

                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 pt-2">
                      <time dateTime={featuredPost.publishedAt?.toISOString() || featuredPost.createdAt.toISOString()}>
                        {formatDate(featuredPost.publishedAt || featuredPost.createdAt, 'id-ID')}
                      </time>
                      <span>·</span>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{featuredPost.readingTime} min read</span>
                      </div>
                      {featuredPost.views > 0 && (
                        <>
                          <span>·</span>
                          <div className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            <span>{formatViewCount(featuredPost.views)} views</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </article>
              </Link>
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

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {recentPosts.map((post) => (
                  <Link key={post.id} href={`/blog/${post.slug}`} className="group">
                    <article className="flex flex-col h-full">
                      {/* Image */}
                      {post.image && (
                        <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800 mb-4">
                          <img
                            src={post.image}
                            alt={post.title}
                            className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-103"
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
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
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

      {/* Categories Section */}
      {categories.length > 0 && (
        <section className="py-16 lg:py-20 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-800">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Browse by Category</h2>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Temukan artikel berdasarkan topik yang Anda minati
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-3">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/blog/category/${category.slug}`}
                  className="inline-flex items-center gap-2 rounded-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:border-blue-500 dark:hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200"
                >
                  {category.name}
                  <span className="inline-flex items-center justify-center w-5 h-5 text-xs rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                    {category._count?.posts || 0}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Subtle About CTA */}
      <section className="py-16 border-t border-gray-100 dark:border-gray-800">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            Ingin tahu lebih banyak tentang saya?{' '}
            <Link
              href="/about"
              className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
            >
              Lihat profil dan portfolio saya →
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}
