'use client';

import { usePathname } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { ThemeProvider } from '@/components/theme-provider';
import { ToastProvider } from '@/components/providers/ToastProvider';
import { PageTransition } from '@/components/transitions/PageTransition';

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
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      {/* Only show Navbar/Footer for public pages */}
      {!isCMSPage && <Navbar settings={settings} />}
      {isCMSPage ? (
        <main>{children}</main>
      ) : (
        <PageTransition>
          <main className="flex-grow pt-24">{children}</main>
        </PageTransition>
      )}
      {!isCMSPage && footer}
      <ToastProvider />
    </ThemeProvider>
  );
}
