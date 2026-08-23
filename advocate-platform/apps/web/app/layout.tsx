import type { Metadata, Viewport } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    default: `${process.env.NEXT_PUBLIC_SITE_NAME || 'Advocate Asit Kumar Mahapatra'} — Supreme Court & High Court Counsel`,
    template: `%s | ${process.env.NEXT_PUBLIC_SITE_NAME || 'Advocate Asit Kumar Mahapatra'}`,
  },
  description: 'Expert legal counsel and strategic courtroom advocacy across Criminal, Property, Family, Consumer, and Civil jurisdictions.',
  authors: [{ name: process.env.NEXT_PUBLIC_SITE_NAME || 'Advocate Asit Kumar Mahapatra' }],
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: process.env.NEXT_PUBLIC_SITE_URL,
    siteName: process.env.NEXT_PUBLIC_SITE_NAME || 'Advocate Asit Kumar Mahapatra',
  },
  twitter: {
    card: 'summary_large_image',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#ffffff',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${inter.variable} ${playfair.variable}`}>
      <body className="antialiased bg-white text-black selection:bg-black selection:text-white min-h-screen relative">{children}</body>
    </html>
  );
}
