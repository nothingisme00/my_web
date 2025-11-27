import { ThemeProvider } from '@/components/theme-provider';

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem storageKey="theme">
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
