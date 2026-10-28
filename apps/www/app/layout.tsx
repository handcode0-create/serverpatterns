import type {Metadata, Viewport} from 'next';
import {JetBrains_Mono, Manrope} from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import NpmNotice from '@/components/NpmNotice';

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://serverpatterns.vercel.app'),
  title: {
    default: 'ServerPatterns : une couche serveur standard pour Next.js',
    template: '%s · ServerPatterns',
  },
  description:
    'Clients API, Route Handlers et Server Actions écrits de la même façon dans tous tes projets Next.js App Router, avec un CLI qui génère le code.',
  openGraph: {
    title: 'ServerPatterns',
    description: 'Une couche serveur standard pour Next.js App Router, avec un CLI qui génère le code.',
    url: 'https://serverpatterns.vercel.app',
    siteName: 'ServerPatterns',
    locale: 'fr_FR',
    type: 'website',
  },
  icons: {icon: '/brand/logo.png'},
};

export const viewport: Viewport = {
  themeColor: '#0B0B0B',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="fr" className={`${manrope.variable} ${jetbrainsMono.variable}`}>
      <body className="flex min-h-screen flex-col antialiased">
        <a
          href="#contenu"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-accent focus:px-3 focus:py-2 focus:text-ink"
        >
          Aller au contenu
        </a>
        <NpmNotice />
        <Header />
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
