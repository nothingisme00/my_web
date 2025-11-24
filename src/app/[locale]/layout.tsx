import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { LayoutWrapper } from '@/components/layout/LayoutWrapper';
import { Footer } from '@/components/layout/Footer';
import { getSettings } from '@/lib/actions';
import { ScrollToTop } from '@/components/blog/ScrollToTop';
import { ReCaptchaProvider } from '@/components/providers/ReCaptchaProvider';
import { locales } from '@/i18n/config';
import '../globals.css';

const inter = Inter({ subsets: ['latin'] });

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const settings = await getSettings();

  return {
    title: {
      default: settings.site_name || 'My Portfolio',
      template: `%s | ${settings.site_name || 'My Portfolio'}`,
    },
    description: settings.seo_description || 'Personal portfolio and blog website',
    keywords: settings.seo_keywords || undefined,
  };
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Validate locale
  if (!locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();
  const settings = await getSettings();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <NextIntlClientProvider messages={messages}>
          <ReCaptchaProvider>
            <ScrollToTop />
            <LayoutWrapper settings={settings} footer={<Footer />}>
              {children}
            </LayoutWrapper>
          </ReCaptchaProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
