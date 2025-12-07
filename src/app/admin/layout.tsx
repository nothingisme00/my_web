"use client";

import Link from "next/link";
import {
  LayoutDashboard,
  FileText,
  Briefcase,
  LogOut,
  Image,
  Settings,
  Menu,
  X,
  UserCircle,
  Film,
  PanelLeftClose,
  PanelLeft,
} from "lucide-react";
import { logout } from "@/lib/actions";
import { ThemeToggle } from "@/components/theme-toggle";
import { ThemeProvider } from "@/components/theme-provider";
import { Breadcrumbs } from "@/components/admin/Breadcrumbs";
import { ToastContainer } from "@/components/ui/Toast";
import { useToast } from "@/hooks/useToast";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";
import { useState, useEffect } from "react";

function NavLink({
  href,
  icon: Icon,
  children,
  pathname,
  isCollapsed,
}: {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
  pathname: string;
  isCollapsed?: boolean;
}) {
  // Special case for dashboard: only active when exactly /admin
  const isActive =
    href === "/admin"
      ? pathname === "/admin"
      : pathname === href || pathname.startsWith(href + "/");

  return (
    <Link
      href={href}
      title={isCollapsed ? String(children) : undefined}
      className={clsx(
        "group relative flex items-center gap-3 rounded-xl transition-all duration-300 touch-manipulation overflow-hidden",
        isCollapsed ? "px-3 py-3 justify-center" : "px-4 py-3.5",
        isActive
          ? "bg-gradient-to-r from-blue-600 via-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/30"
          : "text-gray-300 hover:bg-gray-800/80 hover:text-white active:bg-gray-800"
      )}>
      {/* Animated background on hover */}
      {!isActive && (
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 via-purple-600/0 to-blue-600/0 group-hover:from-blue-600/10 group-hover:via-purple-600/10 group-hover:to-blue-600/10 transition-all duration-500 rounded-xl" />
      )}

      {/* Icon with animation */}
      <div
        className={clsx(
          "relative z-10 transition-all duration-300",
          isActive ? "scale-110" : "group-hover:scale-110 group-hover:rotate-6"
        )}>
        <Icon className="h-5 w-5 flex-shrink-0" />
      </div>

      {/* Text - hidden when collapsed */}
      <span
        className={clsx(
          "relative z-10 font-medium transition-all duration-300 group-hover:translate-x-0.5 whitespace-nowrap",
          isCollapsed ? "hidden" : "block"
        )}>
        {children}
      </span>

      {/* Active indicator */}
      {isActive && !isCollapsed && (
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-l-full shadow-lg" />
      )}
    </Link>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { toasts, removeToast } = useToast();

  // Close sidebar on route change (mobile only)
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsSidebarOpen(false);
  }, [pathname]);

  // Load collapsed state from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("admin-sidebar-collapsed");
    if (saved === "true") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsCollapsed(true);
    }
  }, []);

  // Save collapsed state to localStorage
  const toggleCollapse = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem("admin-sidebar-collapsed", String(newState));
  };

  // Prevent body scroll when sidebar is open on mobile
  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isSidebarOpen]);

  return (
    <html suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          storageKey="theme">
          <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950">
            {/* Overlay with smooth animation */}
            <div
              className={clsx(
                "fixed inset-0 z-20 lg:hidden backdrop-blur-sm transition-all duration-300",
                isSidebarOpen
                  ? "bg-black/60 opacity-100 pointer-events-auto"
                  : "bg-black/0 opacity-0 pointer-events-none"
              )}
              onClick={() => setIsSidebarOpen(false)}
              aria-hidden="true"
            />

            {/* Mobile Header */}
            <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-gradient-to-r from-gray-900 via-gray-900 to-gray-800 border-b border-gray-700/50 shadow-xl">
              <div className="flex items-center justify-between h-16 px-4">
                <button
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  className={clsx(
                    "relative p-2.5 rounded-xl transition-all duration-300 touch-manipulation group",
                    isSidebarOpen
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-500/50"
                      : "text-gray-400 hover:text-white hover:bg-gray-800/80"
                  )}
                  aria-label="Toggle menu"
                  aria-expanded={isSidebarOpen}>
                  <div className="relative w-6 h-6">
                    <Menu
                      className={clsx(
                        "absolute inset-0 transition-all duration-300",
                        isSidebarOpen
                          ? "opacity-0 rotate-180 scale-50"
                          : "opacity-100 rotate-0 scale-100"
                      )}
                    />
                    <X
                      className={clsx(
                        "absolute inset-0 transition-all duration-300",
                        isSidebarOpen
                          ? "opacity-100 rotate-0 scale-100"
                          : "opacity-0 -rotate-180 scale-50"
                      )}
                    />
                  </div>
                </button>

                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                    <LayoutDashboard className="h-4 w-4 text-white" />
                  </div>
                  <div className="font-bold text-lg bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                    CMS Admin
                  </div>
                </div>

                {/* Theme toggle on mobile */}
                <div className="p-1">
                  <ThemeToggle />
                </div>
              </div>
            </div>

            {/* Sidebar with smooth slide animation */}
            <aside
              className={clsx(
                "fixed top-0 left-0 h-full z-30 bg-gradient-to-b from-gray-900 via-gray-900 to-gray-950 text-white flex-shrink-0 border-r border-gray-700/50 flex flex-col backdrop-blur-xl",
                // Smooth transition for width changes
                "transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]",
                // Width based on collapsed state
                isCollapsed ? "lg:w-[72px]" : "lg:w-64",
                // Mobile width
                "w-[280px] sm:w-72",
                // Mobile/Tablet: controlled by state
                isSidebarOpen
                  ? "translate-x-0 shadow-2xl shadow-black/50"
                  : "-translate-x-full lg:translate-x-0 shadow-none lg:shadow-none"
              )}>
              {/* Gradient overlay for depth */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-transparent to-purple-600/5 pointer-events-none" />

              {/* Desktop Header - Hidden on mobile */}
              <div
                className={clsx(
                  "hidden lg:flex relative border-b border-gray-700/50 flex-shrink-0 items-center justify-between transition-all duration-500 ease-out",
                  isCollapsed ? "p-3" : "p-4"
                )}>
                {/* Hamburger Menu Toggle */}
                <button
                  onClick={toggleCollapse}
                  className="p-2 rounded-lg bg-gray-800/60 hover:bg-gray-700 border border-gray-700/50 hover:border-gray-600 transition-all duration-300 group"
                  title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}>
                  <div className="relative w-5 h-5">
                    <PanelLeft
                      className={clsx(
                        "absolute inset-0 h-5 w-5 text-gray-400 group-hover:text-white transition-all duration-300",
                        isCollapsed
                          ? "opacity-100 rotate-0 scale-100"
                          : "opacity-0 -rotate-90 scale-75"
                      )}
                    />
                    <PanelLeftClose
                      className={clsx(
                        "absolute inset-0 h-5 w-5 text-gray-400 group-hover:text-white transition-all duration-300",
                        isCollapsed
                          ? "opacity-0 rotate-90 scale-75"
                          : "opacity-100 rotate-0 scale-100"
                      )}
                    />
                  </div>
                </button>

                {/* Logo & Title - Animated */}
                <div
                  className={clsx(
                    "flex items-center gap-3 transition-all duration-500 ease-out overflow-hidden",
                    isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
                  )}>
                  <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-blue-500/30 flex-shrink-0">
                    <LayoutDashboard className="h-4 w-4 text-white" />
                  </div>
                  <div className="whitespace-nowrap">
                    <h1 className="text-lg font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                      CMS Admin
                    </h1>
                  </div>
                </div>
              </div>

              {/* Mobile Header with stagger animation */}
              <div
                className={clsx(
                  "lg:hidden relative flex items-center justify-between p-5 border-b border-gray-700/50 flex-shrink-0 transition-all duration-500",
                  isSidebarOpen
                    ? "opacity-100 translate-y-0 delay-100"
                    : "opacity-0 -translate-y-4"
                )}>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-blue-500/30 animate-pulse">
                    <LayoutDashboard className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h1 className="text-lg font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                      CMS Admin
                    </h1>
                    <p className="text-xs text-gray-400">Content Management</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsSidebarOpen(false)}
                  className="p-2 text-gray-400 hover:text-white hover:bg-red-500/20 hover:border-red-500/50 border border-gray-700/50 rounded-xl transition-all duration-300 active:scale-90 touch-manipulation group"
                  aria-label="Close menu">
                  <X className="h-5 w-5 group-hover:rotate-90 transition-transform duration-300" />
                </button>
              </div>

              {/* Scrollable Navigation with stagger */}
              <nav
                className={clsx(
                  "admin-sidebar-nav relative flex-1 py-6 space-y-2 overflow-y-auto overscroll-contain transition-all duration-300",
                  isCollapsed ? "px-2" : "px-4",
                  isSidebarOpen
                    ? "opacity-100 delay-200"
                    : "opacity-0 lg:opacity-100"
                )}>
                <NavLink
                  href="/admin"
                  icon={LayoutDashboard}
                  pathname={pathname}
                  isCollapsed={isCollapsed}>
                  Dashboard
                </NavLink>
                <NavLink
                  href="/admin/posts"
                  icon={FileText}
                  pathname={pathname}
                  isCollapsed={isCollapsed}>
                  Posts
                </NavLink>
                <NavLink
                  href="/admin/projects"
                  icon={Briefcase}
                  pathname={pathname}
                  isCollapsed={isCollapsed}>
                  Projects
                </NavLink>
                <NavLink
                  href="/admin/media"
                  icon={Image}
                  pathname={pathname}
                  isCollapsed={isCollapsed}>
                  Media Library
                </NavLink>
                <NavLink
                  href="/admin/about"
                  icon={UserCircle}
                  pathname={pathname}
                  isCollapsed={isCollapsed}>
                  About Page
                </NavLink>
                <NavLink
                  href="/admin/watchlist"
                  icon={Film}
                  pathname={pathname}
                  isCollapsed={isCollapsed}>
                  Watchlist
                </NavLink>
                <NavLink
                  href="/admin/settings"
                  icon={Settings}
                  pathname={pathname}
                  isCollapsed={isCollapsed}>
                  Settings
                </NavLink>
              </nav>

              {/* Bottom Actions with gradient border */}
              <div
                className={clsx(
                  "relative flex-shrink-0 border-t border-gray-700/50 space-y-3 bg-gradient-to-t from-gray-950 to-transparent transition-all duration-500 ease-out",
                  isCollapsed ? "p-2" : "p-4",
                  isSidebarOpen
                    ? "opacity-100 translate-y-0 delay-300"
                    : "opacity-0 lg:opacity-100 translate-y-4 lg:translate-y-0"
                )}>
                {/* Theme Toggle - Hidden on mobile (shown in header) */}
                {!isCollapsed && (
                  <div className="hidden lg:flex items-center justify-between px-4 py-2.5 bg-gray-800/50 rounded-xl border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
                      <span className="text-sm text-gray-300 font-medium">
                        Theme
                      </span>
                    </div>
                    <ThemeToggle />
                  </div>
                )}
                {isCollapsed && (
                  <div className="hidden lg:flex items-center justify-center py-2.5 bg-gray-800/50 rounded-xl border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300">
                    <ThemeToggle />
                  </div>
                )}

                {/* Logout Button */}
                <form action={logout} className="w-full">
                  <button
                    type="submit"
                    title={isCollapsed ? "Logout" : undefined}
                    className={clsx(
                      "group w-full flex items-center rounded-xl transition-all duration-300 text-red-400 hover:text-white bg-red-900/0 hover:bg-red-600 border border-red-900/30 hover:border-red-600 active:scale-95 touch-manipulation shadow-lg shadow-red-900/0 hover:shadow-red-600/30",
                      isCollapsed
                        ? "justify-center px-3 py-3"
                        : "gap-3 px-4 py-3.5"
                    )}>
                    <LogOut className="h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
                    {!isCollapsed && (
                      <span className="font-medium">Logout</span>
                    )}
                  </button>
                </form>
              </div>
            </aside>

            {/* Main Content with smooth push effect */}
            <main
              className={clsx(
                "flex-1 min-h-screen flex flex-col w-full",
                // Smooth transition matching sidebar
                "transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]",
                isCollapsed ? "lg:ml-[72px]" : "lg:ml-64"
              )}>
              {/* Breadcrumbs Bar */}
              <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 sm:px-6 lg:px-8 py-4 sticky top-16 lg:top-0 z-10 mt-16 lg:mt-0">
                <Breadcrumbs />
              </header>

              {/* Page Content */}
              <div className="p-4 sm:p-6 lg:p-8 flex-1 overflow-x-hidden">
                {children}
              </div>
            </main>
          </div>

          {/* Toast Notifications */}
          <ToastContainer toasts={toasts} onClose={removeToast} />
        </ThemeProvider>
      </body>
    </html>
  );
}
