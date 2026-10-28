'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Github } from 'lucide-react';

export default function Header() {
  const pathname = usePathname();

  const isLinkActive = (path: string) => {
    if (path === '/') {
      return pathname === '/';
    }
    if (path === '/docs') {
      return (
        pathname === '/docs' ||
        pathname.startsWith('/docs/installation') ||
        pathname.startsWith('/docs/quickstart') ||
        pathname.startsWith('/docs/changelog')
      );
    }
    return pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-50 bg-[#0B0B0B]/80 backdrop-blur-md border-b border-white/5 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <img 
            src="/brand/logo.png" 
            alt="ServerPatterns Logo" 
            className="h-7 w-7 object-contain select-none transition-transform group-hover:scale-105"
            referrerPolicy="no-referrer"
          />
          <span className="font-display font-semibold tracking-tight text-white text-lg transition-colors group-hover:text-[#FF6A00]">
            ServerPatterns
          </span>
          <span className="text-[9px] font-mono font-bold bg-[#FF6A00]/10 text-[#FF6A00] border border-[#FF6A00]/20 px-2 py-0.5 rounded uppercase tracking-wider hidden sm:inline-block">
            v0.1.0
          </span>
        </Link>

        <nav className="flex items-center gap-4 sm:gap-8 text-xs font-mono">
          <Link 
            href="/docs" 
            className={`transition ${
              isLinkActive('/docs') ? 'text-[#FF6A00] font-medium' : 'text-[#8E8E8A] hover:text-white'
            }`}
          >
            Docs
          </Link>
          <Link 
            href="/docs/primitives/result" 
            className={`transition ${
              isLinkActive('/docs/primitives') ? 'text-[#FF6A00] font-medium' : 'text-[#8E8E8A] hover:text-white'
            }`}
          >
            Primitives
          </Link>
          <Link 
            href="/docs/cli" 
            className={`transition ${
              isLinkActive('/docs/cli') ? 'text-[#FF6A00] font-medium' : 'text-[#8E8E8A] hover:text-white'
            }`}
          >
            CLI
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <a 
            id="header-github-link"
            href="https://github.com/handcode0-create/serverpatterns" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-[#FF6A00]/30 text-white/90 px-3 py-1.5 rounded-lg text-xs font-mono transition"
          >
            <Github size={13} className="text-[#FF6A00]" />
            <span className="hidden sm:inline">GitHub</span>
          </a>
        </div>
      </div>
    </header>
  );
}
