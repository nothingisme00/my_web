'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { useState, useTransition } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Languages, Check } from 'lucide-react';
import { locales, localeNames, localeFlags, type Locale } from '@/i18n/config';

export function LanguageSwitcher() {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);

  const handleLocaleChange = (newLocale: Locale) => {
    if (newLocale === locale) {
      setIsOpen(false);
      return;
    }

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
      setIsOpen(false);
    });
  };

  return (
    <div className="relative">
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isPending}
        className="flex items-center gap-2 px-3 py-2 rounded-lg
                   bg-gray-100 dark:bg-gray-800
                   hover:bg-gray-200 dark:hover:bg-gray-700
                   transition-colors duration-200
                   disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Change language"
        aria-expanded={isOpen}
      >
        <Languages className="w-4 h-4 text-gray-600 dark:text-gray-400" />
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {localeFlags[locale]} {localeNames[locale]}
        </span>
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-40"
            />

            {/* Menu */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 mt-2 w-48 py-2 rounded-lg shadow-lg
                         bg-white dark:bg-gray-800
                         border border-gray-200 dark:border-gray-700
                         z-50"
            >
              {locales.map((loc) => (
                <button
                  key={loc}
                  onClick={() => handleLocaleChange(loc)}
                  disabled={isPending}
                  className={`w-full flex items-center justify-between px-4 py-2.5
                    hover:bg-gray-100 dark:hover:bg-gray-700
                    transition-colors duration-150
                    disabled:opacity-50 disabled:cursor-not-allowed
                    ${loc === locale ? 'bg-gray-50 dark:bg-gray-750' : ''}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{localeFlags[loc]}</span>
                    <span className={`text-sm font-medium
                      ${loc === locale
                        ? 'text-blue-600 dark:text-blue-400'
                        : 'text-gray-700 dark:text-gray-300'
                      }`}>
                      {localeNames[loc]}
                    </span>
                  </div>
                  {loc === locale && (
                    <Check className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  )}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
