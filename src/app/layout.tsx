"use client"

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ThemeProvider } from "@/components/theme-provider";
import { ToastProvider } from "@/components/providers/ToastProvider";
import { usePathname } from "next/navigation";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  
  // Check if current page is CMS or login
  const isCMSPage = pathname?.startsWith('/admin') || pathname === '/login';

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
        >
          {/* Only show Navbar/Footer for public pages */}
          {!isCMSPage && <Navbar />}
          <main className={isCMSPage ? '' : 'flex-grow'}>
            {children}
          </main>
          {!isCMSPage && <Footer />}
          <ToastProvider />
        </ThemeProvider>
      </body>
    </html>
  );
}
