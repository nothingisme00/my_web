'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, Github, Linkedin, Twitter } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { clsx } from 'clsx';
import { Button } from '@/components/ui/Button';
import { ThemeToggle } from '@/components/theme-toggle';

const navItems = [
  { name: 'Home', href: '/' },
  { name: 'Blog', href: '/blog' },
  { name: 'Portfolio', href: '/portfolio' },
  { name: 'About', href: '/about' },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <nav className="fixed top-4 left-0 right-0 z-50 mx-auto max-w-5xl px-4">
      <div className="relative bg-white/80 backdrop-blur-xl border border-white/20 shadow-lg shadow-gray-200/20 rounded-full px-6 h-16 flex items-center justify-between supports-[backdrop-filter]:bg-white/60">
        
        {/* Logo */}
        <div className="flex-shrink-0">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-gray-900 text-white font-bold text-lg w-8 h-8 flex items-center justify-center rounded-lg group-hover:bg-blue-600 transition-colors">
              D
            </div>
            <span className="font-bold text-lg tracking-tight text-gray-900 group-hover:text-blue-600 transition-colors hidden sm:block">DevAditya</span>
          </Link>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={clsx(
                'px-4 py-2 text-sm font-medium rounded-full transition-all duration-200',
                pathname === item.href
                  ? 'bg-gray-100 text-gray-900'
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
              )}
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Right Side (Socials/CTA) */}
        <div className="hidden md:flex items-center gap-3">
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-900 transition-colors">
            <Github className="w-5 h-5" />
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-600 transition-colors">
            <Linkedin className="w-5 h-5" />
          </a>
          <div className="h-4 w-px bg-gray-200 mx-1"></div>
          <ThemeToggle />
          <Link href="/login">
             <Button variant="ghost" size="sm" className="text-xs font-medium text-gray-500 hover:text-gray-900">Admin</Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="inline-flex items-center justify-center p-2 rounded-full text-gray-500 hover:text-gray-900 hover:bg-gray-100 focus:outline-none"
          >
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
      {isOpen && (
        <div className="absolute top-20 left-4 right-4 p-4 bg-white/90 backdrop-blur-xl border border-gray-100 rounded-2xl shadow-xl md:hidden animate-in slide-in-from-top-5 fade-in duration-200">
          <div className="space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={clsx(
                  'block px-4 py-3 rounded-xl text-base font-medium transition-colors',
                  pathname === item.href
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                )}
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100 flex justify-center gap-6">
            <a href="#" className="text-gray-400 hover:text-gray-900"><Github className="w-5 h-5" /></a>
            <a href="#" className="text-gray-400 hover:text-blue-600"><Linkedin className="w-5 h-5" /></a>
            <a href="#" className="text-gray-400 hover:text-blue-400"><Twitter className="w-5 h-5" /></a>
          </div>
        </div>
      )}
    </nav>
  );
}
