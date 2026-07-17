'use client';

import React, { useState, useEffect } from 'react';
import { Copy, Check } from 'lucide-react';

interface PackageManagerTabsProps {
  pnpm: string;
  npm: string;
  yarn: string;
  bun: string;
}

export default function PackageManagerTabs({ pnpm, npm, yarn, bun }: PackageManagerTabsProps) {
  const [activeTab, setActiveTab] = useState<'pnpm' | 'npm' | 'yarn' | 'bun'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('preferred-pm') as any;
      if (saved && ['pnpm', 'npm', 'yarn', 'bun'].includes(saved)) {
        return saved;
      }
    }
    return 'pnpm';
  });
  const [copied, setCopied] = useState(false);

  const handleTabChange = (tab: 'pnpm' | 'npm' | 'yarn' | 'bun') => {
    setActiveTab(tab);
    localStorage.setItem('preferred-pm', tab);
    // Custom event to sync other tabs on the same page
    window.dispatchEvent(new Event('preferred-pm-changed'));
  };

  useEffect(() => {
    const handleSync = () => {
      const saved = localStorage.getItem('preferred-pm') as any;
      if (saved && saved !== activeTab) {
        setActiveTab(saved);
      }
    };
    window.addEventListener('preferred-pm-changed', handleSync);
    return () => window.removeEventListener('preferred-pm-changed', handleSync);
  }, [activeTab]);

  const activeCommand = { pnpm, npm, yarn, bun }[activeTab];

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(activeCommand);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="border border-white/10 bg-[#121212]/50 rounded-none overflow-hidden font-mono text-xs my-6">
      
      {/* Tabs Header */}
      <div className="flex items-center justify-between px-4 bg-[#0B0B0B] border-b border-white/10 h-10 select-none">
        <div className="flex gap-4">
          {(['pnpm', 'npm', 'yarn', 'bun'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              className={`relative h-10 text-[11px] font-medium transition-colors ${
                activeTab === tab ? 'text-white' : 'text-[#8E8E8A] hover:text-white'
              }`}
            >
              {tab}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#FF6A00]" />
              )}
            </button>
          ))}
        </div>
        
        {/* Copy Button */}
        <button
          onClick={handleCopy}
          className="p-1 rounded-none hover:bg-white/5 text-white/40 hover:text-white transition flex items-center gap-1 text-[10px]"
          title="Copier la commande"
        >
          {copied ? (
            <>
              <Check size={11} className="text-green-400 stroke-[3]" />
              <span className="text-green-400">Copié</span>
            </>
          ) : (
            <>
              <Copy size={11} />
              <span>Copier</span>
            </>
          )}
        </button>
      </div>

      {/* Code Area */}
      <div className="p-4 bg-black/40 overflow-x-auto text-[#E2E2DF] min-h-[44px] flex items-center">
        <span className="text-[#FF6A00] mr-2 select-none">$</span>
        <span className="select-all">{activeCommand}</span>
      </div>

    </div>
  );
}
