import Link from 'next/link';
import { getDashboardStats, getProjects } from '@/lib/actions';
import { Button } from '@/components/ui/Button';
import { FileText, Briefcase, FolderOpen, Tags, Plus, TrendingUp, Eye, ExternalLink } from 'lucide-react';

export default async function AdminDashboard() {
  const [stats, recentProjects] = await Promise.all([
    getDashboardStats(),
    getProjects(),
  ]);

  // Calculate total views from all posts
  const totalViews = stats.recentPosts.reduce((sum, post) => sum + post.views, 0);

  // Get popular posts (sorted by views)
  const popularPosts = [...stats.recentPosts]
    .sort((a, b) => b.views - a.views)
    .slice(0, 5);

  const statCards = [
    {
      title: 'Total Posts',
      value: stats.postsCount,
      icon: FileText,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/30',
      borderColor: 'border-blue-200 dark:border-blue-800',
    },
    {
      title: 'Total Projects',
      value: stats.projectsCount,
      icon: Briefcase,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-900/30',
      borderColor: 'border-purple-200 dark:border-purple-800',
    },
    {
      title: 'Total Views',
      value: totalViews.toLocaleString(),
      icon: TrendingUp,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-900/30',
      borderColor: 'border-green-200 dark:border-green-800',
    },
    {
      title: 'Categories',
      value: stats.categoriesCount,
      icon: FolderOpen,
      color: 'text-orange-600 dark:text-orange-400',
      bgColor: 'bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-900/30',
      borderColor: 'border-orange-200 dark:border-orange-800',
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400">Welcome back! Here&apos;s an overview of your content.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.title}
              className={`group relative p-6 rounded-xl shadow-sm border-2 ${stat.borderColor} hover:shadow-lg transition-all duration-200 hover:-translate-y-1 overflow-hidden ${stat.bgColor}`}
            >
              {/* Background Icon Watermark */}
              <div className="absolute -right-4 -bottom-4 opacity-5 dark:opacity-10">
                <Icon className="h-32 w-32" />
              </div>

              <div className="relative flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-400">
                    {stat.title}
                  </p>
                  <p className="text-4xl font-bold text-gray-900 dark:text-white mt-3 tabular-nums">
                    {stat.value}
                  </p>
                </div>
                <div className={`p-4 rounded-2xl bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm group-hover:scale-110 transition-transform duration-200 shadow-lg`}>
                  <Icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
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
            <Button variant="secondary" className="gap-2">
              <Plus className="h-4 w-4" /> New Category
            </Button>
          </Link>
          <Link href="/admin/tags/new">
            <Button variant="secondary" className="gap-2">
              <Plus className="h-4 w-4" /> New Tag
            </Button>
          </Link>
        </div>
      </div>

      {/* Two Column Layout for Recent Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Posts */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Posts</h2>
              <Link href="/admin/posts" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                View all
              </Link>
            </div>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {stats.recentPosts.length > 0 ? (
              stats.recentPosts.slice(0, 5).map((post) => (
                <div key={post.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white line-clamp-1">
                        {post.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-1.5">
                        {post.category && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                            {post.category.name}
                          </span>
                        )}
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(post.createdAt).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                          })}
                        </span>
                      </div>
                    </div>
                    <Link href={`/admin/posts/${post.id}/edit`}>
                      <Button variant="ghost" size="sm" className="text-xs">
                        Edit
                      </Button>
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-12 text-center text-gray-500 dark:text-gray-400">
                <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No posts yet. Create your first post to get started!</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Projects */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Projects</h2>
              <Link href="/admin/projects" className="text-sm text-purple-600 dark:text-purple-400 hover:underline">
                View all
              </Link>
            </div>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {recentProjects.length > 0 ? (
              recentProjects.slice(0, 5).map((project) => (
                <div key={project.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white line-clamp-1">
                        {project.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-1.5">
                        {project.techStack && (
                          <span className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
                            {project.techStack.split(',').slice(0, 2).join(', ')}
                          </span>
                        )}
                      </div>
                    </div>
                    <Link href={`/admin/projects/${project.id}/edit`}>
                      <Button variant="ghost" size="sm" className="text-xs">
                        Edit
                      </Button>
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-12 text-center text-gray-500 dark:text-gray-400">
                <Briefcase className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No projects yet. Create your first project!</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Popular Posts by Views */}
      {popularPosts.length > 0 && popularPosts.some(p => p.views > 0) && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Popular Posts</h2>
            </div>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {popularPosts.filter(p => p.views > 0).map((post, index) => (
              <div key={post.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/30 flex items-center justify-center">
                    <span className="text-sm font-bold text-green-700 dark:text-green-400">
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
                    <Button variant="ghost" size="sm" className="text-xs">
                      Edit
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
