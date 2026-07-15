'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, Code, Terminal, Github, Star, Sparkles, Milestone } from 'lucide-react';

interface HeadingItem {
  id: string;
  text: string;
  level: number;
}

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [headings, setHeadings] = useState<HeadingItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');

  const isActive = (path: string) => {
    if (path === '/docs') {
      return pathname === '/docs';
    }
    return pathname === path;
  };

  // Automatically scan the central column for H2 & H3 tags to build the Table of Contents
  useEffect(() => {
    // Wait for the DOM to render
    const timer = setTimeout(() => {
      const contentEl = document.querySelector('.docs-content');
      if (!contentEl) return;

      const headingEls = Array.from(contentEl.querySelectorAll('h2, h3'));
      const items = headingEls.map((el, index) => {
        if (!el.id) {
          const text = el.textContent || '';
          el.id = text
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '') // Remove accents
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '') || `heading-${index}`;
        }
        return {
          id: el.id,
          text: el.textContent || '',
          level: el.tagName === 'H2' ? 2 : 3,
        };
      });
      setHeadings(items);

      // Setup intersection observer to highlight active heading on scroll
      const observer = new IntersectionObserver(
        (entries) => {
          const visible = entries.filter((e) => e.isIntersecting);
          if (visible.length > 0) {
            // Sort by top coordinate to find the uppermost visible heading
            const sorted = visible.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
            setActiveId(sorted[0].target.id);
          }
        },
        { rootMargin: '-100px 0px -40%', threshold: 0.1 }
      );

      headingEls.forEach((el) => observer.observe(el));

      return () => {
        observer.disconnect();
      };
    }, 150);

    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 flex-1 w-full">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-12 items-start">
        
        {/* =======================================================
            COL 1: LEFT NAVIGATION SIDEBAR (3 cols on lg)
           ======================================================= */}
        <aside className="lg:col-span-3 sticky top-28 self-start space-y-8 font-mono text-xs select-none">
          
          {/* Group 1: Sections */}
          <div>
            <h4 className="text-[#8E8E8A] font-bold uppercase tracking-wider text-[10px] mb-4 flex items-center gap-1.5 px-3">
              <BookOpen size={12} className="text-[#FF6A00]" />
              <span>Sections</span>
            </h4>
            <ul className="space-y-1">
              {[
                { name: 'Introduction', path: '/docs' },
                { name: 'Installation', path: '/docs/installation' },
                { name: 'Quickstart (10m)', path: '/docs/quickstart' },
                { name: 'Agents IA 🤖', path: '/docs/ai-agents' },
                { name: 'Changelog', path: '/docs/changelog' },
              ].map((item) => {
                const active = isActive(item.path);
                return (
                  <li key={item.path}>
                    <Link
                      href={item.path}
                      className={`flex items-center h-8 px-3 rounded-lg transition-all ${
                        active
                          ? 'bg-[#FF6A00]/10 text-[#FF6A00] font-semibold border-l-2 border-[#FF6A00] rounded-l-none'
                          : 'text-[#8E8E8A] hover:text-white hover:bg-white/[0.02]'
                      }`}
                    >
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Group 2: Référence CLI */}
          <div>
            <h4 className="text-[#8E8E8A] font-bold uppercase tracking-wider text-[10px] mb-4 flex items-center gap-1.5 px-3">
              <Terminal size={12} className="text-[#FF6A00]" />
              <span>Référence CLI</span>
            </h4>
            <ul className="space-y-1">
              {[
                { name: 'serverpatterns init', path: '/docs/cli/init' },
                { name: 'serverpatterns add api', path: '/docs/cli/add-api' },
                { name: 'serverpatterns add action', path: '/docs/cli/add-action' },
                { name: 'Configuration', path: '/docs/cli/configuration' },
                { name: 'Changelog CLI', path: '/docs/cli/changelog' },
              ].map((item) => {
                const active = isActive(item.path);
                return (
                  <li key={item.path}>
                    <Link
                      href={item.path}
                      className={`flex items-center h-8 px-3 rounded-lg transition-all ${
                        active
                          ? 'bg-[#FF6A00]/10 text-[#FF6A00] font-semibold border-l-2 border-[#FF6A00] rounded-l-none'
                          : 'text-[#8E8E8A] hover:text-white hover:bg-white/[0.02]'
                      }`}
                    >
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Group 3: Primitives */}
          <div>
            <h4 className="text-[#8E8E8A] font-bold uppercase tracking-wider text-[10px] mb-4 flex items-center gap-1.5 px-3">
              <Code size={12} className="text-[#FF6A00]" />
              <span>Primitives</span>
            </h4>
            <ul className="space-y-1">
              {[
                { name: 'Result<T, E>', path: '/docs/primitives/result' },
                { name: 'createApiClient()', path: '/docs/primitives/api-client' },
                { name: 'createGetHandler()', path: '/docs/primitives/get-post-handler' },
                { name: 'withServerAction()', path: '/docs/primitives/server-action' },
              ].map((item) => {
                const active = isActive(item.path);
                return (
                  <li key={item.path}>
                    <Link
                      href={item.path}
                      className={`flex items-center h-8 px-3 rounded-lg transition-all ${
                        active
                          ? 'bg-[#FF6A00]/10 text-[#FF6A00] font-semibold border-l-2 border-[#FF6A00] rounded-l-none'
                          : 'text-[#8E8E8A] hover:text-white hover:bg-white/[0.02]'
                      }`}
                    >
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

        </aside>

        {/* =======================================================
            COL 2: CENTRAL CONTENT (6 cols on lg/xl)
           ======================================================= */}
        <main className="lg:col-span-6 xl:col-span-6 bg-white/[0.01] border border-white/5 rounded-2xl p-6 sm:p-10 relative overflow-hidden min-h-[60vh]">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF6A00]/5 rounded-full blur-[100px] pointer-events-none" />
          <div className="docs-content prose prose-invert max-w-none prose-xs sm:prose-sm">
            {children}
          </div>
        </main>

        {/* =======================================================
            COL 3: RIGHT CONTEXTUAL SIDEBAR (3 cols on lg)
           ======================================================= */}
        <aside className="lg:col-span-3 sticky top-28 self-start space-y-8 select-none">
          
          {/* On this page (Table of Contents) */}
          {headings.length > 0 && (
            <div className="space-y-3 font-mono">
              <h4 className="text-[#F5F5F3] font-bold text-[10px] uppercase tracking-wider border-b border-white/5 pb-2">
                Sur cette page
              </h4>
              <nav className="space-y-2 text-[11px] leading-relaxed">
                {headings.map((heading) => (
                  <a
                    key={heading.id}
                    href={`#${heading.id}`}
                    className={`block transition-all hover:text-white ${
                      heading.level === 3 ? 'pl-3 border-l border-white/5' : ''
                    } ${
                      activeId === heading.id
                        ? 'text-[#FF6A00] font-semibold'
                        : 'text-[#8E8E8A]'
                    }`}
                  >
                    {heading.text}
                  </a>
                ))}
              </nav>
            </div>
          )}

          {/* GitHub Promo Card */}
          <div className="bg-[#121212] border border-white/5 p-5 rounded-2xl relative overflow-hidden group hover:border-[#FF6A00]/20 transition-all duration-300">
            <div className="absolute top-0 right-0 w-20 h-20 bg-[#FF6A00]/5 rounded-full blur-xl pointer-events-none" />
            <div className="flex items-center gap-2 mb-3">
              <Star size={13} className="text-[#FF6A00] fill-[#FF6A00]" />
              <span className="font-mono text-[9px] font-bold text-[#FF6A00] tracking-wider uppercase">
                GitHub Community
              </span>
            </div>
            <h5 className="font-display font-bold text-sm text-white mb-2 leading-tight">
              Soutiens ServerPatterns
            </h5>
            <p className="text-[11px] text-[#8E8E8A] leading-relaxed mb-4">
              Aide-nous à propager des standards serveur sains. Donne-nous une étoile sur GitHub !
            </p>
            <a
              id="docs-github-star-button"
              href="https://github.com/hancode-studio/serverpatterns"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full bg-white/5 hover:bg-white/10 text-white font-mono text-[10px] uppercase tracking-wider py-2 rounded-lg border border-white/10 transition hover:border-[#FF6A00]/30"
            >
              <Github size={12} />
              <span>Donner un Star</span>
            </a>
          </div>

        </aside>

      </div>
    </div>
  );
}
