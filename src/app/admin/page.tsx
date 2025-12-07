import { getDashboardStats, getProjects } from "@/lib/actions";
import { DashboardClient } from "@/components/admin/DashboardClient";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [stats, recentProjects] = await Promise.all([
    getDashboardStats(),
    getProjects(),
  ]);

  // Calculate total views from all posts
  const totalViews = stats.recentPosts.reduce(
    (sum, post) => sum + post.views,
    0
  );

  // Get popular posts (sorted by views)
  const popularPosts = [...stats.recentPosts]
    .sort((a, b) => b.views - a.views)
    .slice(0, 5);

  const statCards = [
    {
      title: "Total Posts",
      value: stats.postsCount,
      icon: "FileText",
      accentColor: "indigo",
    },
    {
      title: "Total Projects",
      value: stats.projectsCount,
      icon: "Briefcase",
      accentColor: "violet",
    },
    {
      title: "Total Views",
      value: totalViews.toLocaleString(),
      icon: "TrendingUp",
      accentColor: "emerald",
    },
    {
      title: "Categories",
      value: stats.categoriesCount,
      icon: "FolderOpen",
      accentColor: "amber",
    },
  ];

  return (
    <DashboardClient
      statCards={statCards}
      recentPosts={stats.recentPosts}
      recentProjects={recentProjects}
      popularPosts={popularPosts}
    />
  );
}
