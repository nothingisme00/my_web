'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { useTransition, useState, useEffect } from 'react';
import { locales, type Locale } from '@/i18n/config';

export function LanguageSwitcher() {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [optimisticLocale, setOptimisticLocale] = useState<Locale>(locale);

  // Sync optimistic state when actual locale changes (e.g. navigation completes)
  useEffect(() => {
    setOptimisticLocale(locale);
  }, [locale]);

  const handleLocaleChange = (newLocale: Locale) => {
    if (newLocale === optimisticLocale) return;

    // Optimistic update
    setOptimisticLocale(newLocale);

    // Save preference to localStorage
    localStorage.setItem('preferred-locale', newLocale);

    startTransition(() => {
      // Replace current locale in pathname with new locale
      const segments = pathname.split('/');
      const currentLocaleIndex = segments.findIndex(segment => locales.includes(segment as Locale));

      if (currentLocaleIndex !== -1) {
        segments[currentLocaleIndex] = newLocale;
      } else {
        // If no locale in path, insert at beginning (after empty string from leading /)
        segments.splice(1, 0, newLocale);
      }

      const newPath = segments.join('/');
      router.replace(newPath);
    });
  };

  // Calculate the active index for sliding animation
  const activeIndex = locales.indexOf(optimisticLocale);

  return (
    <div className="relative flex items-center p-1 rounded-full bg-gray-200/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700">
      {/* Sliding background indicator */}
      <div
        className="absolute top-1 left-1 w-12 h-7 bg-white dark:bg-gray-700 rounded-full shadow-sm transition-transform duration-300 ease-out pointer-events-none"
        style={{
          transform: `translateX(${activeIndex * 48}px)`, // 48px = w-12
        }}
      />
      
      {/* Language buttons */}
      {locales.map((loc) => (
        <button
          key={loc}
          type="button"
          onClick={() => handleLocaleChange(loc)}
          disabled={isPending}
          className={`
            relative flex items-center justify-center w-12 h-7 text-xs font-bold rounded-full transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-blue-500
            ${loc === optimisticLocale 
              ? 'text-blue-600 dark:text-blue-400' 
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
            }
          `}
        >
          <span className="relative z-10">{loc.toUpperCase()}</span>
        </button>
      ))}
    </div>
  );
}
