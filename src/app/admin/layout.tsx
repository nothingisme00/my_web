"use client"

import Link from 'next/link';
import { LayoutDashboard, FileText, Briefcase, LogOut, FolderOpen, Tags, Image, Settings, Menu, X } from 'lucide-react';
import { logout } from '@/lib/actions';
import { ThemeToggle } from '@/components/theme-toggle';
import { Breadcrumbs } from '@/components/admin/Breadcrumbs';
import { usePathname } from 'next/navigation';
import { clsx } from 'clsx';
import { useState, useEffect } from 'react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Close sidebar on route change
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  const NavLink = ({ href, icon: Icon, children }: { href: string; icon: React.ComponentType<{ className?: string }>; children: React.ReactNode }) => {
    // Special case for dashboard: only active when exactly /admin
    const isActive = href === '/admin' 
      ? pathname === '/admin' 
      : pathname === href || pathname.startsWith(href + '/');
    
    return (
      <Link
        href={href}
        className={clsx(
          'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
          isActive
            ? 'bg-blue-600 text-white'
            : 'text-gray-300 hover:bg-gray-800 hover:text-white'
        )}
      >
        <Icon className="h-5 w-5" />
        {children}
      </Link>
    );
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-20 bg-gray-900 dark:bg-gray-950 text-white border-b border-gray-800">
        <div className="flex items-center justify-between h-16 px-4">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 -ml-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
          
          <div className="absolute left-1/2 transform -translate-x-1/2 font-bold text-lg bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            CMS Admin
          </div>
          
          {/* Spacer for balance */}
          <div className="w-10"></div>
        </div>
      </div>

      {/* Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black/50 lg:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={clsx(
        "fixed inset-y-0 left-0 z-30 w-64 bg-gray-900 dark:bg-gray-950 text-white flex-shrink-0 border-r border-gray-800 transition-transform duration-300 ease-in-out lg:translate-x-0",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-6 border-b border-gray-800 hidden lg:block">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            CMS Admin
          </h1>
          <p className="text-xs text-gray-400 mt-1">Content Management</p>
        </div>

        <nav className="mt-6 px-4 space-y-1 overflow-y-auto h-[calc(100vh-200px)]">
          <NavLink href="/admin" icon={LayoutDashboard}>
            Dashboard
          </NavLink>
          <NavLink href="/admin/posts" icon={FileText}>
            Posts
          </NavLink>
          <NavLink href="/admin/projects" icon={Briefcase}>
            Projects
          </NavLink>
          <NavLink href="/admin/categories" icon={FolderOpen}>
            Categories
          </NavLink>
          <NavLink href="/admin/tags" icon={Tags}>
            Tags
          </NavLink>
          <NavLink href="/admin/media" icon={Image}>
            Media Library
          </NavLink>
          <NavLink href="/admin/settings" icon={Settings}>
            Settings
          </NavLink>
        </nav>

        <div className="absolute bottom-0 w-64 p-4 border-t border-gray-800 space-y-2 bg-gray-900 dark:bg-gray-950">
          <div className="flex items-center justify-between px-4 py-2">
            <span className="text-sm text-gray-400">Theme</span>
            <ThemeToggle />
          </div>
          <form action={logout} className="w-full">
            <button
              type="submit"
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-red-400 hover:bg-red-900/20 hover:text-red-300"
            >
              <LogOut className="h-5 w-5" />
              Logout
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 min-h-screen flex flex-col">
        {/* Breadcrumbs Bar */}
        <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 lg:px-8 py-4 sticky top-16 lg:top-0 z-10 mt-16 lg:mt-0">
          <Breadcrumbs />
        </header>

        {/* Page Content */}
        <div className="p-4 lg:p-8 flex-1 overflow-x-hidden">
          {children}
        </div>
      </main>
    </div>
  );
}
