import type {Metadata} from 'next';
import {Manrope, JetBrains_Mono} from 'next/font/google';
import './globals.css'; // Global styles
import Header from '@/components/Header';

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'ServerPatterns — Le standard serveur pour Next.js',
  description: 'Un style standard pour tes fetch, tes Route Handlers et tes Server Actions — avec un CLI qui génère tout.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="fr" className={`${manrope.variable} ${jetbrainsMono.variable} scroll-smooth`}>
      <body suppressHydrationWarning className="bg-[#0B0B0B] text-[#F5F5F3] antialiased min-h-screen selection:bg-[#FF6A00] selection:text-black flex flex-col">
        <Header />
        <div className="flex-1">
          {children}
        </div>
      </body>
    </html>
  );
}
