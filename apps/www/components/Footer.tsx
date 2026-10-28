import Link from 'next/link';
import {REPO_URL, VERSION} from '@/lib/docs-nav';

export default function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-[88rem] flex-col gap-4 px-4 py-10 text-[0.875rem] text-muted sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>
          ServerPatterns {VERSION}, sous licence MIT. Conçu par{' '}
          <a href="https://handcode.site" target="_blank" rel="noopener noreferrer" className="text-text hover:text-accent">
            HANCODE STUDIO
          </a>{' '}
          à Abidjan.
        </p>
        <nav aria-label="Liens de pied de page" className="flex flex-wrap gap-x-5 gap-y-2">
          <Link href="/docs" className="hover:text-text">Documentation</Link>
          <Link href="/docs/changelog" className="hover:text-text">Changelog</Link>
          <a href="/llms.txt" className="hover:text-text">llms.txt</a>
          <a href={REPO_URL} target="_blank" rel="noopener noreferrer" className="hover:text-text">GitHub</a>
        </nav>
      </div>
    </footer>
  );
}
