import { getFeaturedPosts } from "@/lib/actions";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { QuotesCarousel } from "@/components/home/QuotesCarousel";
import { FeaturedPostsCarousel } from "@/components/home/FeaturedPostsCarousel";
import { ArticleFeed } from "@/components/home/ArticleFeed";
import { NewsletterCTA } from "@/components/home/NewsletterCTA";
import { AboutMini } from "@/components/home/AboutMini";

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
  const [allPosts, aboutData] = await Promise.all([
    getFeaturedPosts(12) as Promise<PostWithRelations[]>,
    getAboutData(),
  ]);

  // First 3 posts for carousel, next 9 for article feed
  const featuredPosts = allPosts.slice(0, 3);
  const recentPosts = allPosts.slice(3, 12);

  return (
    <div className="min-h-screen">
      {/* Featured Posts Carousel */}
      {featuredPosts.length > 0 && <FeaturedPostsCarousel posts={featuredPosts} />}

      {/* Article Feed */}
      {recentPosts.length > 0 && <ArticleFeed posts={recentPosts} />}

      {/* Empty State */}
      {allPosts.length === 0 && (
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              No articles available yet. Check back soon!
            </p>
          </div>
        </section>
      )}

      {/* Quotes Carousel */}
      <QuotesCarousel />

      {/* Newsletter CTA */}
      <NewsletterCTA />

      {/* About Me Mini */}
      <AboutMini aboutData={aboutData} />
    </div>
  );
}
