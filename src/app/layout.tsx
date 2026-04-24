import { Analytics } from '@vercel/analytics/next';
import type { Metadata } from 'next';
import type { Viewport } from 'next';
import { Montserrat, Ephesis } from 'next/font/google';
import '@green-world/styles.css';
import 'react-toastify/dist/ReactToastify.css';

export const viewport: Viewport = {
  themeColor: '#266041'
};

export const metadata: Metadata = {
  metadataBase: new URL('https://www.zelenisvet.rs'),
  title: {
    template: '%s | Zeleni Svet',
    default: 'Online Cveće i Biljke | Zeleni Svet | Kupovina Cveća Srbija'
  },
  description:
    'Kupite cveće online na Zelenom Svetu – marketplace za online cvećare u Srbiji. Saksijsko cveće, rezano cveće i baštenski asortiman uz dostavu.',
  keywords: [
    'online cveće',
    'online cvećara',
    'kupovina cveća',
    'kupovina cveća online',
    'naruči cveće online',
    'dostava cveća beograd',
    'cvećara srbija',
    'cvećare srbija',
    'rasadnici srbija',
    'saksijsko cveće',
    'rezano cveće',
    'zeleni svet',
    'marketplace cveća',
    'baštovanstvo'
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true }
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-48.png', sizes: '48x48', type: 'image/png' },
      {
        url: '/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png'
      },
      {
        url: '/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png'
      }
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }
    ]
  },
  manifest: '/manifest.json',
  applicationName: 'Zeleni Svet',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Zeleni Svet'
  },
  formatDetection: {
    telephone: false
  },
  other: {
    'theme-color': '#266041',
    'mobile-web-app-capable': 'yes'
  },
  openGraph: {
    type: 'website',
    siteName: 'Zeleni Svet',
    locale: 'sr_RS',
    title: 'Online Cveće i Biljke | Zeleni Svet | Kupovina Cveća Srbija',
    description:
      'Kupite cveće online na Zelenom Svetu – vodećem marketplace-u za online cvećare i kupovinu cveća u Srbiji. Saksijsko cveće, rezano cveće i baštenski asortiman uz dostavu.',
    images: [
      {
        url: '/zeleni-svet-yellow-transparent.png',
        width: 1200,
        height: 630,
        alt: 'Zeleni Svet – online cveće i cvećare Srbija'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Online Cveće i Biljke | Zeleni Svet | Kupovina Cveća Srbija',
    description:
      'Kupite cveće online na Zelenom Svetu – vodećem marketplace-u za online cvećare i kupovinu cveća u Srbiji. Saksijsko cveće, rezano cveće i baštenski asortiman uz dostavu.',
    images: ['/zeleni-svet-yellow-transparent.png']
  }
};

const montserrat = Montserrat({
  subsets: ['latin', 'cyrillic', 'latin-ext', 'cyrillic-ext'],
  display: 'swap',
  variable: '--font-montserrat'
});

const ephesis = Ephesis({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-ephesis'
});

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sr">
      <head>
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link
          rel="preconnect"
          href="https://green-world-images.s3.eu-west-1.amazonaws.com"
        />
      </head>
      <body className={`${montserrat.variable} ${ephesis.variable}`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
