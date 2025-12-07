'use client';

import { usePathname } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { ThemeProvider } from '@/components/theme-provider';
import { ToastProvider } from '@/components/providers/ToastProvider';
import { PageTransition } from '@/components/transitions/PageTransition';
import { BackgroundEffects } from '@/components/ui/BackgroundEffects';

interface LayoutWrapperProps {
  children: React.ReactNode;
  settings?: Record<string, string>;
  footer?: React.ReactNode;
}

export function LayoutWrapper({ children, settings, footer }: LayoutWrapperProps) {
  const pathname = usePathname();

  // Check if current page is CMS or login
  const isCMSPage = pathname?.startsWith('/admin') || pathname === '/login';

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem storageKey="theme">
      {/* Global Background Effects (except on CMS/Login and Reading pages) */}
      {!isCMSPage && <BackgroundEffects />}
      
      {/* Only show Navbar/Footer for public pages */}
      {!isCMSPage && <Navbar settings={settings} />}
      
      <div className="relative z-10 flex flex-col flex-grow w-full bg-gradient-to-b from-gray-50/50 via-transparent to-gray-50/30 dark:from-gray-950/50 dark:via-transparent dark:to-gray-950/30">
        {isCMSPage ? (
          <main>{children}</main>
        ) : (
          <PageTransition>
            <main className="flex-grow pt-24">{children}</main>
          </PageTransition>
        )}
        {!isCMSPage && footer}
      </div>
      <ToastProvider />
    </ThemeProvider>
  );
}
