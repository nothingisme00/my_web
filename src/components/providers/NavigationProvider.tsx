'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

export function NavigationProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const previousPathnameRef = useRef(pathname);

  useEffect(() => {
    // Detect locale change
    const getPathWithoutLocale = (path: string) => {
      return path.replace(/^\/(en|id)/, '') || '/';
    };

    const prevPath = getPathWithoutLocale(previousPathnameRef.current);
    const currentPath = getPathWithoutLocale(pathname);
    const isLocaleChange = prevPath === currentPath && previousPathnameRef.current !== pathname;

    if (isLocaleChange) {
      // Add class to disable all transitions
      document.documentElement.classList.add('no-transitions');

      // Remove class after a short delay
      const timer = setTimeout(() => {
        document.documentElement.classList.remove('no-transitions');
      }, 100);

      previousPathnameRef.current = pathname;
      return () => clearTimeout(timer);
    }

    previousPathnameRef.current = pathname;
  }, [pathname]);

  return <>{children}</>;
}
