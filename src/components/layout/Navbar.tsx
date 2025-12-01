"use client";

import { Link, usePathname } from "@/i18n/navigation";
import { useState, useEffect, useRef } from "react";
import { Menu, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { clsx } from "clsx";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { motion, AnimatePresence } from "framer-motion";

interface NavbarProps {
  settings?: {
    site_name?: string;
    owner_name?: string;
    page_blog?: string;
    page_portfolio?: string;
    page_watchlist?: string;
    page_about?: string;
  };
}

export function Navbar({ settings }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const t = useTranslations("nav");
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  const siteName = settings?.owner_name || settings?.site_name || "Alfattah";

  // Define all nav items with their visibility keys
  const allNavItems = [
    { name: t("home"), href: "/", visibilityKey: null }, // Always visible
    { name: t("blog"), href: "/blog", visibilityKey: "page_blog" },
    {
      name: t("projects"),
      href: "/portfolio",
      visibilityKey: "page_portfolio",
    },
    {
      name: t("watchlist"),
      href: "/watchlist",
      visibilityKey: "page_watchlist",
    },
    { name: t("about"), href: "/about", visibilityKey: "page_about" },
  ];

  // Filter nav items based on visibility settings
  const navItems = allNavItems.filter((item) => {
    if (!item.visibilityKey) return true; // Always show items without visibility key
    const settingValue =
      settings?.[item.visibilityKey as keyof typeof settings];
    return settingValue !== "false"; // Show if not explicitly false
  });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Click outside to close mobile menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <nav className="fixed top-4 left-0 right-0 z-50 mx-auto max-w-5xl px-4">
      <div
        className={clsx(
          "relative backdrop-blur-xl border-2 rounded-full px-6 h-16 flex items-center justify-between transition-all duration-300 ease-out",
          isScrolled
            ? "bg-white/90 dark:bg-gray-900/90 border-gray-200 dark:border-gray-700 shadow-sm"
            : "bg-white/80 dark:bg-gray-900/80 border-white/20 dark:border-gray-700/20 shadow-sm supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-gray-900/60"
        )}>
        {/* Logo */}
        <div className="flex-shrink-0">
          <Link href="/" className="group">
            <div className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold text-base w-9 h-9 flex items-center justify-center rounded-lg group-hover:bg-blue-600 dark:group-hover:bg-blue-500 group-hover:text-white transition-all duration-200 ease-out group-hover:scale-105">
              {siteName.charAt(0).toUpperCase()}
            </div>
          </Link>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.name}
                href={item.href}
                className="relative px-4 py-2 text-sm font-medium transition-colors duration-200 ease-out group">
                <span
                  className={clsx(
                    "relative z-10 transition-colors duration-200",
                    isActive
                      ? "text-blue-600 dark:text-blue-400 font-bold"
                      : "text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                  )}>
                  {item.name}
                </span>
                {isActive && (
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400 rounded-full"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* Right Side */}
        <div className="hidden md:flex items-center gap-2">
          <LanguageSwitcher />
          <ThemeToggle />
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="inline-flex items-center justify-center p-2 rounded-full text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none transition-all duration-200 ease-out">
            <span className="sr-only">Open main menu</span>
            {isOpen ? (
              <X className="block h-5 w-5" aria-hidden="true" />
            ) : (
              <Menu className="block h-5 w-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={mobileMenuRef}
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1.0] }}
            className="absolute top-20 left-4 right-4 p-4 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl md:hidden">
            <motion.div
              className="space-y-1"
              initial="closed"
              animate="open"
              variants={{
                open: {
                  transition: {
                    staggerChildren: 0.05,
                  },
                },
              }}>
              {navItems.map((item) => (
                <motion.div
                  key={item.name}
                  variants={{
                    closed: { opacity: 0, x: -20 },
                    open: { opacity: 1, x: 0 },
                  }}
                  transition={{ duration: 0.3 }}>
                  <Link
                    href={item.href}
                    className={clsx(
                      "block px-4 py-3 rounded-xl text-base font-medium transition-all duration-200 ease-out",
                      pathname === item.href
                        ? "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 font-semibold"
                        : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-white"
                    )}
                    onClick={() => setIsOpen(false)}>
                    {item.name}
                  </Link>
                </motion.div>
              ))}
            </motion.div>
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-center gap-2">
              <LanguageSwitcher />
              <ThemeToggle />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
