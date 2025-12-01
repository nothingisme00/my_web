import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { LayoutWrapper } from "@/components/layout/LayoutWrapper";
import { Footer } from "@/components/layout/Footer";
import { getSettings } from "@/lib/actions";
import { ScrollToTop } from "@/components/blog/ScrollToTop";
import { ReCaptchaProvider } from "@/components/providers/ReCaptchaProvider";
import { NavigationProvider } from "@/components/providers/NavigationProvider";
import { locales } from "@/i18n/config";
import "../globals.css";

const inter = Inter({ subsets: ["latin"] });

// Force dynamic rendering to ensure settings are always fresh
export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  await params; // Consume params to avoid unused warning if linter is strict about awaiting
  const settings = await getSettings();

  return {
    metadataBase: new URL(
      process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
    ),
    title: {
      default: settings.site_name || "My Portfolio",
      template: `%s | ${settings.site_name || "My Portfolio"}`,
    },
    description:
      settings.seo_description || "Personal portfolio and blog website",
    keywords: settings.seo_keywords || undefined,
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Validate locale
  if (!locales.includes(locale as (typeof locales)[number])) {
    notFound();
  }

  const messages = await getMessages();
  const settings = await getSettings();

  return (
    <html lang={locale} suppressHydrationWarning>
      <head />
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  var supportDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches === true;
                  if (!theme && supportDarkMode) theme = 'dark';
                  if (!theme) theme = 'light';
                  if (theme === 'dark') {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
        <NextIntlClientProvider messages={messages}>
          <ReCaptchaProvider>
            <NavigationProvider>
              <ScrollToTop />
              <LayoutWrapper settings={settings} footer={<Footer />}>
                {children}
              </LayoutWrapper>
            </NavigationProvider>
          </ReCaptchaProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
