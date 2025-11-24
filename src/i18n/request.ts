import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales } from './config';

export default getRequestConfig(async ({ requestLocale }) => {
  // Await the requestLocale parameter (required for Next.js 15)
  let locale = await requestLocale;

  // Validate that the incoming locale parameter is valid
  if (!locale || !locales.includes(locale as any)) {
    notFound();
  }

  const messages = await import(`./messages/${locale}.json`).then((module) => module.default);

  return {
    locale,      // CRITICAL: Must return the locale
    messages,
  };
});
