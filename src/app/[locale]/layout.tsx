import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { LayoutWrapper } from "@/components/layout/LayoutWrapper";
import { Footer } from "@/components/layout/Footer";
import { getSettings } from "@/lib/actions";
import { ScrollToTop } from "@/components/blog/ScrollToTop";
import { ReCaptchaProvider } from "@/components/providers/ReCaptchaProvider";
import { NavigationProvider } from "@/components/providers/NavigationProvider";
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";
import { locales } from "@/i18n/config";
import "../globals.css";

// Force dynamic rendering to ensure settings are always fresh
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

// Static metadata - no database query
export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  ),
  title: {
    default: "Hiatta",
    template: `%s | Hiatta`,
  },
  description: "Personal portfolio and blog website",
};

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

  let settings = {};
  try {
    settings = await getSettings();
  } catch (error) {
    console.error("Failed to load settings:", error);
  }

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Google+Sans+Flex:opsz,wght@6..144,1..1000&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-google-sans min-h-screen flex flex-col">
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
              <SmoothScrollProvider>
                <ScrollToTop />
                <LayoutWrapper settings={settings} footer={<Footer />}>
                  {children}
                </LayoutWrapper>
              </SmoothScrollProvider>
            </NavigationProvider>
          </ReCaptchaProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
