import { ThemeProvider } from "@/components/theme-provider";

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning className="h-full">
      <body
        suppressHydrationWarning
        className="h-full overflow-hidden bg-slate-100 dark:bg-slate-950">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          storageKey="theme">
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
