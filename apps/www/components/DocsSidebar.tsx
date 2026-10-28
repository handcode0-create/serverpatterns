'use client';

import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {docsNav} from '@/lib/docs-nav';

export default function DocsSidebar() {
  const pathname = usePathname();
  return (
    <nav aria-label="Documentation" className="text-[0.9375rem]">
      {docsNav.map((group) => (
        <div key={group.title} className="mb-7">
          <p className="mb-2 px-2 font-display text-[0.875rem] font-semibold text-text">{group.title}</p>
          <ul className="space-y-0.5 border-l border-line">
            {group.links.map((link) => {
              const active = pathname === link.href;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={active ? 'page' : undefined}
                    className={`-ml-px block border-l py-1 pl-3 pr-2 transition-colors ${
                      active ? 'border-accent text-text' : 'border-transparent text-muted hover:border-line-strong hover:text-text'
                    }`}
                  >
                    {link.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
