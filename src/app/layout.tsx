import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { LayoutWrapper } from "@/components/layout/LayoutWrapper";
import { Footer } from "@/components/layout/Footer";
import { getSettings } from "@/lib/actions";

const inter = Inter({ subsets: ["latin"] });

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();

  return {
    title: {
      default: settings.site_name || "My Portfolio",
      template: `%s | ${settings.site_name || "My Portfolio"}`,
    },
    description: settings.seo_description || "Personal portfolio and blog website",
    keywords: settings.seo_keywords || undefined,
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSettings();

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <LayoutWrapper settings={settings} footer={<Footer />}>
          {children}
        </LayoutWrapper>
      </body>
    </html>
  );
}
