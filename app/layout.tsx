import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/Providers';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    default: 'ProductHub — Discover & Manage Products',
    template: '%s | ProductHub',
  },
  description:
    'Browse, search, and manage thousands of products across dozens of categories. Built with Next.js, Redux Toolkit, and RTK Query.',
  keywords: ['products', 'e-commerce', 'shopping', 'catalog'],
  authors: [{ name: 'ProductHub' }],
  openGraph: {
    type: 'website',
    title: 'ProductHub',
    description: 'Discover & manage products with a modern, responsive interface.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-950 text-white min-h-screen`}
      >
        {/* Wrap the entire app with the Redux Provider */}
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
