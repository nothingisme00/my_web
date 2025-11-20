import Link from 'next/link';
import { getDashboardStats } from '@/lib/actions';
import { Button } from '@/components/ui/Button';
import { FileText, Briefcase, FolderOpen, Tags, Plus, TrendingUp } from 'lucide-react';

export default async function AdminDashboard() {
  const stats = await getDashboardStats();

  const statCards = [
    {
      title: 'Total Posts',
      value: stats.postsCount,
      icon: FileText,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30',
    },
    {
      title: 'Total Projects',
      value: stats.projectsCount,
      icon: Briefcase,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-100 dark:bg-purple-900/30',
    },
    {
      title: 'Categories',
      value: stats.categoriesCount,
      icon: FolderOpen,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-100 dark:bg-green-900/30',
    },
    {
      title: 'Tags',
      value: stats.tagsCount,
      icon: Tags,
      color: 'text-orange-600 dark:text-orange-400',
      bgColor: 'bg-orange-100 dark:bg-orange-900/30',
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400">Welcome back! Here's an overview of your content.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.title}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
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
            stats.recentPosts.map((post) => (
              <div key={post.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-medium text-gray-900 dark:text-white truncate">
                      {post.title}
                    </h3>
                    <div className="flex items-center gap-3 mt-2">
                      {post.category && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                          {post.category.name}
                        </span>
                      )}
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(post.createdAt).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                  </div>
                  <Link href={`/admin/posts/${post.id}/edit`}>
                    <Button variant="ghost" size="sm">
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
    </div>
  );
}
