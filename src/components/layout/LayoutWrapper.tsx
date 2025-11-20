'use client';

import { usePathname } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ThemeProvider } from '@/components/theme-provider';
import { ToastProvider } from '@/components/providers/ToastProvider';

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Check if current page is CMS or login
  const isCMSPage = pathname?.startsWith('/admin') || pathname === '/login';

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      {/* Only show Navbar/Footer for public pages */}
      {!isCMSPage && <Navbar />}
      <main className={isCMSPage ? '' : 'flex-grow'}>{children}</main>
      {!isCMSPage && <Footer />}
      <ToastProvider />
    </ThemeProvider>
  );
}
