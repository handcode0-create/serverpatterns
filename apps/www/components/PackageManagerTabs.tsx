'use client';

import {useEffect, useState} from 'react';
import {Check, Copy} from 'lucide-react';

import type {PackageManager as Manager} from '@/lib/commands';

const MANAGERS: Manager[] = ['npm', 'pnpm', 'yarn', 'bun'];
const STORAGE_KEY = 'serverpatterns:package-manager';
const SYNC_EVENT = 'serverpatterns:package-manager-changed';

interface PackageManagerTabsProps {
  /** Commande par gestionnaire. Les gestionnaires absents ne sont pas proposés. */
  commands: Partial<Record<Manager, string>>;
  label?: string;
}

export default function PackageManagerTabs({commands, label = 'Gestionnaire de paquets'}: PackageManagerTabsProps) {
  const available = MANAGERS.filter((manager) => commands[manager]);
  // Valeur stable au rendu serveur ; la préférence enregistrée est appliquée après hydratation.
  const [active, setActive] = useState<Manager>(available[0] ?? 'npm');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const apply = () => {
      try {
        const saved = localStorage.getItem(STORAGE_KEY) as Manager | null;
        if (saved && commands[saved]) setActive(saved);
      } catch {
        // stockage indisponible : on garde la valeur par défaut
      }
    };
    apply();
    window.addEventListener(SYNC_EVENT, apply);
    return () => window.removeEventListener(SYNC_EVENT, apply);
  }, [commands]);

  function choose(manager: Manager) {
    setActive(manager);
    try {
      localStorage.setItem(STORAGE_KEY, manager);
    } catch {
      // ignoré
    }
    window.dispatchEvent(new Event(SYNC_EVENT));
  }

  const command = commands[active] ?? '';

  async function copy() {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // ignoré
    }
  }

  return (
    <div className="overflow-hidden rounded-[10px] border border-line bg-surface">
      <div className="flex items-center justify-between gap-2 border-b border-line pl-2 pr-2">
        <div role="tablist" aria-label={label} className="flex">
          {available.map((manager) => (
            <button
              key={manager}
              type="button"
              role="tab"
              aria-selected={active === manager}
              onClick={() => choose(manager)}
              className={`relative px-2.5 py-2 font-mono text-[0.8125rem] transition-colors ${
                active === manager ? 'text-text' : 'text-muted hover:text-text'
              }`}
            >
              {manager}
              {active === manager && <span className="absolute inset-x-2.5 bottom-0 h-0.5 rounded-full bg-accent" />}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={copy}
          className="flex items-center gap-1.5 rounded-md px-2 py-1 text-[0.8125rem] text-muted transition-colors hover:bg-raised hover:text-text"
          aria-label={copied ? 'Commande copiée' : 'Copier la commande'}
        >
          {copied ? <Check size={14} className="text-ok" /> : <Copy size={14} />}
          <span>{copied ? 'Copié' : 'Copier'}</span>
        </button>
      </div>
      <div className="overflow-x-auto px-4 py-3 font-mono text-[0.875rem]">
        <span className="select-none text-muted">$ </span>
        <span className="whitespace-pre text-text">{command}</span>
      </div>
    </div>
  );
}
