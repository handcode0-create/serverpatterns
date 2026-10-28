import {REPO_URL} from '@/lib/docs-nav';

/** Bandeau d'état : tant que les packages ne sont pas sur npm, les commandes d'installation échouent. */
export default function NpmNotice() {
  return (
    <div className="border-b border-accent/30 bg-accent/[0.08] px-4 py-2 text-center text-[0.875rem] text-[#F3E3D6]">
      <span className="sm:hidden">Bientôt sur npm.</span>
      <span className="hidden sm:inline">
        Bientôt sur npm : les packages <code className="font-mono text-[0.8125rem]">@serverpatterns/*</code> ne sont pas
        encore publiés, les commandes d’installation fonctionneront dès la publication.
      </span>{' '}
      <a href={`${REPO_URL}#tester-le-cli-en-local-sans-publier-sur-npm`} className="whitespace-nowrap font-semibold text-accent-soft underline underline-offset-2 hover:text-accent">
        Essayer depuis GitHub
      </a>
    </div>
  );
}
