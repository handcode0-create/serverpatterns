import type {ReactNode} from 'react';
import Link from 'next/link';
import {getDocLink, getDocNeighbours, REPO_URL} from '@/lib/docs-nav';

interface DocPageProps {
  /** Chemin de la page dans docs-nav.ts (ex: "/docs/quickstart") */
  href: string;
  /** Chemin du fichier source, pour le lien « Modifier sur GitHub » */
  source: string;
  /** Titre affiché, si différent du titre de navigation */
  title?: string;
  lead: ReactNode;
  children: ReactNode;
}

export default function DocPage({href, source, title, lead, children}: DocPageProps) {
  const link = getDocLink(href);
  const {prev, next} = getDocNeighbours(href);

  return (
    <article>
      <header className="mb-10 max-w-[72ch]">
        <h1 className="font-display text-[2rem] font-semibold leading-tight tracking-tight sm:text-[2.5rem]">{title ?? link.title}</h1>
        <div className="mt-4 text-[1.125rem] leading-relaxed text-muted">{lead}</div>
      </header>

      <div className="doc" data-doc-content>
        {children}
      </div>

      <footer className="mt-16 max-w-[72ch] border-t border-line pt-6">
        <div className="grid gap-3 sm:grid-cols-2">
          {prev ? (
            <Link href={prev.href} className="group rounded-[10px] border border-line px-4 py-3 hover:border-line-strong">
              <span className="block text-[0.8125rem] text-muted">Précédent</span>
              <span className="font-semibold text-text group-hover:text-accent-soft">{prev.title}</span>
            </Link>
          ) : (
            <span />
          )}
          {next && (
            <Link href={next.href} className="group rounded-[10px] border border-line px-4 py-3 text-right hover:border-line-strong">
              <span className="block text-[0.8125rem] text-muted">Suivant</span>
              <span className="font-semibold text-text group-hover:text-accent-soft">{next.title}</span>
            </Link>
          )}
        </div>
        <p className="mt-6 text-[0.875rem] text-muted">
          Une erreur sur cette page ?{' '}
          <a
            href={`${REPO_URL}/blob/main/apps/www/${source}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-text underline underline-offset-2 hover:text-accent-soft"
          >
            Modifier sur GitHub
          </a>
        </p>
      </footer>
    </article>
  );
}
