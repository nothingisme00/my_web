import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'My Portfolio',
  description: 'Full Stack Developer Portfolio',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
