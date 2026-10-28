'use client';

import {useState} from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {usePathname} from 'next/navigation';
import {Github, Menu, X} from 'lucide-react';
import {docsNav, REPO_URL} from '@/lib/docs-nav';

const PRIMARY = [
  {href: '/docs', label: 'Documentation', match: (p: string) => p.startsWith('/docs') && !p.startsWith('/docs/primitives') && !p.startsWith('/docs/cli')},
  {href: '/docs/primitives/result', label: 'Primitives', match: (p: string) => p.startsWith('/docs/primitives')},
  {href: '/docs/cli/setup', label: 'CLI', match: (p: string) => p.startsWith('/docs/cli')},
];

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-ink/90 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-[88rem] items-center gap-6 px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5 rounded-md" aria-label="ServerPatterns, accueil">
          <Image src="/brand/logo.png" alt="" width={26} height={26} priority />
          <span className="font-display text-[1.0625rem] font-semibold tracking-tight">ServerPatterns</span>
        </Link>

        <nav aria-label="Navigation principale" className="hidden items-center gap-1 md:flex">
          {PRIMARY.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={item.match(pathname) ? 'page' : undefined}
              className={`rounded-md px-3 py-1.5 text-[0.9375rem] transition-colors ${
                item.match(pathname) ? 'text-text' : 'text-muted hover:text-text'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <a
            href={REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-md border border-line px-3 py-1.5 text-[0.9375rem] text-muted transition-colors hover:border-line-strong hover:text-text"
          >
            <Github size={16} aria-hidden />
            <span className="hidden sm:inline">GitHub</span>
          </a>
          <button
            type="button"
            className="rounded-md p-2 text-muted hover:text-text md:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {open && (
        <nav id="mobile-nav" aria-label="Documentation" className="max-h-[calc(100dvh-3.5rem)] overflow-y-auto border-t border-line bg-ink px-4 pb-8 pt-4 md:hidden">
          {docsNav.map((group) => (
            <div key={group.title} className="mb-5">
              <p className="mb-1.5 text-[0.8125rem] font-semibold text-muted">{group.title}</p>
              <ul>
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={() => setOpen(false)}
                      aria-current={pathname === link.href ? 'page' : undefined}
                      className={`block rounded-md px-2 py-1.5 ${pathname === link.href ? 'bg-raised text-text' : 'text-[#D6D3CC]'}`}
                    >
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      )}
    </header>
  );
}
