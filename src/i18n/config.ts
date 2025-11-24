export const locales = ['en', 'id'] as const;
export const defaultLocale = 'en' as const;

export type Locale = (typeof locales)[number];

export const localeNames: Record<Locale, string> = {
  en: 'English',
  id: 'Indonesia',
};

export const localeFlags: Record<Locale, string> = {
  en: '🇬🇧',
  id: '🇮🇩',
};
