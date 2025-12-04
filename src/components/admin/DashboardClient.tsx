"use client";

import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { StripeHoverWrapper } from "@/components/animations/StripeCard";
import {
  FileText,
  Briefcase,
  FolderOpen,
  Plus,
  TrendingUp,
  Eye,
  LucideIcon,
} from "lucide-react";

// Icon mapping
const iconMap: Record<string, LucideIcon> = {
  FileText,
  Briefcase,
  FolderOpen,
  TrendingUp,
};

// Accent color classes mapping
const accentColors: Record<
  string,
  { bg: string; border: string; icon: string; iconBg: string }
> = {
  indigo: {
    bg: "bg-indigo-50/80 dark:bg-indigo-950/30",
    border: "border-l-indigo-500",
    icon: "text-indigo-600 dark:text-indigo-400",
    iconBg: "bg-indigo-100 dark:bg-indigo-900/50",
  },
  violet: {
    bg: "bg-violet-50/80 dark:bg-violet-950/30",
    border: "border-l-violet-500",
    icon: "text-violet-600 dark:text-violet-400",
    iconBg: "bg-violet-100 dark:bg-violet-900/50",
  },
  emerald: {
    bg: "bg-emerald-50/80 dark:bg-emerald-950/30",
    border: "border-l-emerald-500",
    icon: "text-emerald-600 dark:text-emerald-400",
    iconBg: "bg-emerald-100 dark:bg-emerald-900/50",
  },
  amber: {
    bg: "bg-amber-50/80 dark:bg-amber-950/30",
    border: "border-l-amber-500",
    icon: "text-amber-600 dark:text-amber-400",
    iconBg: "bg-amber-100 dark:bg-amber-900/50",
  },
};

interface StatCard {
  title: string;
  value: number | string;
  icon: string;
  accentColor: string;
}

interface Post {
  id: string;
  title: string;
  views: number;
  createdAt: Date;
  category?: { name: string } | null;
}

interface Project {
  id: string;
  title: string;
  techStack?: string | null;
}

interface DashboardClientProps {
  statCards: StatCard[];
  recentPosts: Post[];
  recentProjects: Project[];
  popularPosts: Post[];
}

// Animation variants
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

export function DashboardClient({
  statCards,
  recentPosts,
  recentProjects,
  popularPosts,
}: DashboardClientProps) {
  return (
    <motion.div
      className="space-y-8"
      initial="hidden"
      animate="visible"
      variants={containerVariants}>
      {/* Header */}
      <motion.div variants={itemVariants}>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Dashboard
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Welcome back! Here&apos;s an overview of your content.
        </p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
        variants={containerVariants}>
        {statCards.map((stat) => {
          const Icon = iconMap[stat.icon] || FileText;
          const colors = accentColors[stat.accentColor] || accentColors.indigo;

          return (
            <motion.div key={stat.title} variants={itemVariants}>
              <StripeHoverWrapper className="h-full">
                <div
                  className={`relative p-6 rounded-xl border-l-4 ${colors.border} ${colors.bg} border border-gray-200/50 dark:border-gray-700/50 shadow-sm hover:shadow-md transition-shadow duration-300 h-full`}>
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                        {stat.title}
                      </p>
                      <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2 tabular-nums">
                        {stat.value}
                      </p>
                    </div>
                    <div
                      className={`p-3 rounded-xl ${colors.iconBg} transition-transform duration-200`}>
                      <Icon className={`h-6 w-6 ${colors.icon}`} />
                    </div>
                  </div>
                </div>
              </StripeHoverWrapper>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        variants={cardVariants}
        className="bg-white dark:bg-gray-800/80 backdrop-blur-sm p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700/50">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Plus className="h-5 w-5 text-indigo-500" />
          Quick Actions
        </h2>
        <div className="flex flex-wrap gap-3">
          <Link href="/admin/posts/new">
            <Button className="gap-2">
              <Plus className="h-4 w-4" /> New Post
            </Button>
          </Link>
          <Link href="/admin/projects/new">
            <Button variant="secondary" className="gap-2">
              <Plus className="h-4 w-4" /> New Project
            </Button>
          </Link>
          <Link href="/admin/categories/new">
            <Button variant="outline" className="gap-2">
              <Plus className="h-4 w-4" /> New Category
            </Button>
          </Link>
          <Link href="/admin/tags/new">
            <Button variant="outline" className="gap-2">
              <Plus className="h-4 w-4" /> New Tag
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* Two Column Layout for Recent Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Posts */}
        <motion.div
          variants={cardVariants}
          className="bg-white dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-sm border border-gray-200 dark:border-gray-700/50 overflow-hidden">
          <div className="p-5 border-b border-gray-100 dark:border-gray-700/50">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <FileText className="h-4 w-4 text-indigo-500" />
                Recent Posts
              </h2>
              <Link
                href="/admin/posts"
                className="text-sm text-indigo-600 dark:text-indigo-400 font-medium px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors">
                View all
              </Link>
            </div>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-gray-700/50">
            {recentPosts.length > 0 ? (
              recentPosts.slice(0, 5).map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-4 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/20 transition-all duration-200 border-l-2 border-l-transparent hover:border-l-indigo-500">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white line-clamp-1">
                        {post.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-1.5">
                        {post.category && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300">
                            {post.category.name}
                          </span>
                        )}
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(post.createdAt).toLocaleDateString(
                            "id-ID",
                            {
                              day: "numeric",
                              month: "short",
                            }
                          )}
                        </span>
                      </div>
                    </div>
                    <Link href={`/admin/posts/${post.id}/edit`}>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs h-7 px-2.5 text-indigo-600 border-indigo-200 bg-indigo-50/50 hover:bg-indigo-100 hover:border-indigo-300 dark:text-indigo-400 dark:border-indigo-800 dark:bg-indigo-900/20 dark:hover:bg-indigo-900/40">
                        Edit
                      </Button>
                    </Link>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="p-12 text-center text-gray-500 dark:text-gray-400">
                <FileText className="h-12 w-12 mx-auto mb-3 opacity-30" />
                <p className="text-sm">
                  No posts yet. Create your first post to get started!
                </p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Recent Projects */}
        <motion.div
          variants={cardVariants}
          className="bg-white dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-sm border border-gray-200 dark:border-gray-700/50 overflow-hidden">
          <div className="p-5 border-b border-gray-100 dark:border-gray-700/50">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-violet-500" />
                Recent Projects
              </h2>
              <Link
                href="/admin/projects"
                className="text-sm text-violet-600 dark:text-violet-400 font-medium px-3 py-1.5 rounded-lg bg-violet-50 dark:bg-violet-900/30 hover:bg-violet-100 dark:hover:bg-violet-900/50 transition-colors">
                View all
              </Link>
            </div>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-gray-700/50">
            {recentProjects.length > 0 ? (
              recentProjects.slice(0, 5).map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-4 hover:bg-violet-50/50 dark:hover:bg-violet-950/20 transition-all duration-200 border-l-2 border-l-transparent hover:border-l-violet-500">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white line-clamp-1">
                        {project.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-1.5">
                        {project.techStack && (
                          <span className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
                            {project.techStack
                              .split(",")
                              .slice(0, 2)
                              .join(", ")}
                          </span>
                        )}
                      </div>
                    </div>
                    <Link href={`/admin/projects/${project.id}/edit`}>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs h-7 px-2.5 text-violet-600 border-violet-200 bg-violet-50/50 hover:bg-violet-100 hover:border-violet-300 dark:text-violet-400 dark:border-violet-800 dark:bg-violet-900/20 dark:hover:bg-violet-900/40">
                        Edit
                      </Button>
                    </Link>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="p-12 text-center text-gray-500 dark:text-gray-400">
                <Briefcase className="h-12 w-12 mx-auto mb-3 opacity-30" />
                <p className="text-sm">
                  No projects yet. Create your first project!
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Popular Posts by Views */}
      {popularPosts.length > 0 && popularPosts.some((p) => p.views > 0) && (
        <motion.div
          variants={cardVariants}
          className="bg-white dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-sm border border-gray-200 dark:border-gray-700/50 overflow-hidden">
          <div className="p-5 border-b border-gray-100 dark:border-gray-700/50">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-emerald-500" />
              <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                Popular Posts
              </h2>
            </div>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-gray-700/50">
            {popularPosts
              .filter((p) => p.views > 0)
              .map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-4 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20 transition-all duration-200 border-l-2 border-l-transparent hover:border-l-emerald-500">
                  <div className="flex items-center gap-4">
                    <div className="shrink-0 w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center">
                      <span className="text-sm font-bold text-emerald-700 dark:text-emerald-400">
                        {index + 1}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white line-clamp-1">
                        {post.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Eye className="h-3 w-3 text-gray-400" />
                        <span className="text-xs text-gray-600 dark:text-gray-400">
                          {post.views.toLocaleString()} views
                        </span>
                      </div>
                    </div>
                    <Link href={`/admin/posts/${post.id}/edit`}>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs h-7 px-2.5 text-emerald-600 border-emerald-200 bg-emerald-50/50 hover:bg-emerald-100 hover:border-emerald-300 dark:text-emerald-400 dark:border-emerald-800 dark:bg-emerald-900/20 dark:hover:bg-emerald-900/40">
                        Edit
                      </Button>
                    </Link>
                  </div>
                </motion.div>
              ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
