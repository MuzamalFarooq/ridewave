import { Inter, Outfit } from 'next/font/google';
import './globals.css';
import Providers from '@/components/shared/Providers';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });

export const metadata = {
  title: {
    default: 'RideWave — Premium AI-Powered Ride Booking Platform',
    template: '%s | RideWave',
  },
  description:
    'Book safe, affordable rides with verified drivers. Real-time GPS tracking, live chat, and instant booking on RideWave — your premium travel companion.',
  keywords: [
    'ride booking',
    'carpool',
    'ride sharing',
    'travel',
    'BlaBlaCar',
    'Uber',
    'Pakistan rides',
    'cheap rides',
    'safe travel',
  ],
  authors: [{ name: 'RideWave' }],
  creator: 'RideWave',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_APP_URL,
    title: 'RideWave — Premium AI-Powered Ride Booking Platform',
    description: 'Book safe, affordable rides with verified drivers. Real-time GPS tracking, live chat, and instant booking.',
    siteName: 'RideWave',
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_APP_URL}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: 'RideWave',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RideWave — Premium AI-Powered Ride Booking',
    description: 'Book safe, affordable rides with verified drivers.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  manifest: '/manifest.json',
};

export const viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#6366f1' },
    { media: '(prefers-color-scheme: dark)', color: '#1a1a2e' },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body className={`${inter.variable} ${outfit.variable} font-inter antialiased`}>
        <Providers>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: 'var(--toast-bg)',
                color: 'var(--toast-color)',
                borderRadius: '12px',
                border: '1px solid var(--toast-border)',
                padding: '12px 16px',
                fontSize: '14px',
                fontFamily: 'var(--font-inter)',
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
