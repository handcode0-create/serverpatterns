'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Terminal,
  Layers,
  Shield,
  Zap,
  Github,
  ExternalLink,
  Code2,
  Copy,
  Check,
  Compass,
  CornerDownRight,
  Sparkles,
  HelpCircle,
  FileCode,
  Network,
  Info,
  Lock,
  AlertCircle,
  Webhook,
  ListOrdered,
  ShieldCheck
} from 'lucide-react';
import ChaosAnimation from '@/components/ChaosAnimation';
import InteractiveTerminal from '@/components/InteractiveTerminal';
import CodeBlock from '@/components/CodeBlock';
import PackageManagerTabs from '@/components/PackageManagerTabs';
import InteractiveHorizontalTimeline from '@/components/InteractiveHorizontalTimeline';

export default function Home() {
  const [copiedInstall, setCopiedInstall] = useState(false);

  const handleCopyInstall = async () => {
    try {
      await navigator.clipboard.writeText('pnpm add @serverpatterns/core @serverpatterns/next');
      setCopiedInstall(true);
      setTimeout(() => setCopiedInstall(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <main className="relative bg-[#0B0B0B] text-[#F5F5F3] overflow-x-hidden min-h-screen">
      
      {/* HERO SECTION */}
      <section id="hero" className="relative min-h-[90vh] flex flex-col justify-center py-20 px-6 overflow-hidden">
        
        {/* Subtle Radial Gradient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#FF6A00]/5 rounded-full blur-3xl pointer-events-none z-0" />
        
        <div className="max-w-7xl mx-auto w-full relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Hero Left Content (7 cols) */}
          <div className="lg:col-span-7 text-left flex flex-col items-start">
            
            {/* Version and studio indicator */}
            <div className="flex items-center gap-2.5 mb-6 text-xs font-mono text-[#8E8E8A]">
              <span className="text-[#FF6A00] font-bold">◆</span>
              <span className="tracking-widest uppercase">HANCODE STUDIO PRESENTS</span>
              <span className="text-white/20">|</span>
              <span className="text-white font-semibold">NEXT.JS SERVERSIDE TOOLKIT</span>
            </div>

            {/* Giant display headline */}
            <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.08] mb-8 max-w-2xl">
              Arrête de <br />
              <span className="italic font-light text-[#FF6A00]">dupliquer</span> <br />
              ta couche serveur.
            </h1>

            {/* Positioning sub-paragraph */}
            <p className="font-sans text-base sm:text-xl text-[#8E8E8A] leading-relaxed max-w-xl mb-10">
              Un style standard pour tes <span className="text-white font-medium">fetch</span>, tes <span className="text-white font-medium">Route Handlers</span> et tes <span className="text-white font-medium">Server Actions</span> — avec un CLI qui génère tout en TypeScript strict.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
              <a 
                id="hero-cta-primitives"
                href="#primitives" 
                className="group flex items-center justify-center gap-2 border border-[#FF6A00] text-[#FF6A00] font-mono text-xs uppercase tracking-wider px-6 py-3.5 rounded-full transition-all duration-300 hover:bg-[#FF6A00] hover:text-black hover:shadow-[0_0_20px_rgba(255,106,0,0.2)] active:scale-95"
              >
                <span>Découvrir le bento des primitives</span>
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
              </a>
              <a 
                id="hero-cta-problem"
                href="#the-problem-split" 
                className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white font-mono text-xs uppercase tracking-wider px-6 py-3.5 rounded-full border border-white/5 transition"
              >
                <span>Voir le problème</span>
              </a>
            </div>
            
          </div>

          {/* Hero Right Floating Quickstart Card (5 cols) */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end relative">
            
            {/* Plus decoration symbols */}
            <div className="absolute -top-6 -left-6 text-white/15 font-mono text-lg select-none pointer-events-none">+</div>
            <div className="absolute -bottom-6 -right-6 text-[#FF6A00]/30 font-mono text-lg select-none pointer-events-none">+</div>
            
            {/* Floating Card container */}
            <div className="w-full max-w-[400px] bg-[#FF6A00] text-black p-6 rounded-2xl shadow-2xl relative rotate-[2deg] hover:rotate-0 transition-transform duration-500 select-none border-t border-white/20">
              
              <div className="flex items-center justify-between mb-5">
                <span className="font-mono text-[10px] font-black tracking-widest uppercase bg-black text-[#FF6A00] px-2 py-0.5 rounded">
                  QUICKSTART
                </span>
                <span className="font-mono text-xs font-bold text-black/60">
                  serverpatterns v0.1.0
                </span>
              </div>

              <h3 className="font-display text-2xl font-semibold tracking-tight leading-tight text-black mb-2">
                Installe le core. <br />Génère le reste.
              </h3>
              
              <p className="text-xs text-black/75 leading-relaxed mb-5">
                Une commande pour ajouter le moteur monadique et le générateur de patterns Next.js.
              </p>

              {/* High contrast Terminal Block inside orange card */}
              <div className="w-full mb-5 text-[#F5F5F3] overflow-hidden rounded-xl border border-black/40 shadow-inner bg-black/40">
                <PackageManagerTabs
                  pnpm="pnpm add @serverpatterns/core"
                  npm="npm install @serverpatterns/core"
                  yarn="yarn add @serverpatterns/core"
                  bun="bun add @serverpatterns/core"
                />
              </div>

              {/* Direct links in Quickstart Card */}
              <div className="flex items-center justify-between text-xs font-mono font-bold border-t border-black/10 pt-4">
                <a 
                  id="quickstart-github"
                  href="https://github.com/handcode0-create/serverpatterns" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center gap-1.5 hover:underline"
                >
                  <Github size={12} />
                  <span>handcode0-create/serverpatterns</span>
                </a>
                <a 
                  id="quickstart-docs"
                  href="/docs" 
                  className="flex items-center gap-1 hover:underline"
                >
                  <span>Docs</span>
                  <ArrowRight size={12} />
                </a>
              </div>

            </div>

          </div>

        </div>

        {/* Floating Accent Background Stars */}
        <div className="absolute top-[20%] right-[15%] text-[#FF6A00]/20 text-3xl font-light pointer-events-none select-none">✦</div>
        <div className="absolute bottom-[15%] left-[10%] text-white/5 text-4xl font-light pointer-events-none select-none">✦</div>
      </section>

      {/* CORE SIGNATURE MOMENT — CHAOS TO ORDER ANIMATION */}
      <ChaosAnimation />

      {/* DETAILED PROBLEM: ASYMMETRIC LAYOUT */}
      <section id="the-problem-split" className="py-24 px-6 border-b border-white/5 bg-[#0B0B0B]">
        <div className="max-w-7xl mx-auto">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <h2 className="font-display font-semibold text-3xl md:text-5xl text-white tracking-tight leading-tight">
                Pourquoi ta couche serveur <br />semble toujours <span className="italic font-light text-[#FF6A00]">bricolée</span>
              </h2>
            </div>
            <p className="text-sm text-[#8E8E8A] max-w-sm leading-relaxed font-mono">
              La liberté de Next.js App Router mène souvent au chaos architectural sans un cadre d&apos;équipe rigide.
            </p>
          </div>

          {/* Typographic Minimalist List (Replacing Bento Grid) */}
          <div className="mt-16 divide-y divide-white/10 border-t border-white/10">
            {/* Problem 1 */}
            <div className="py-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-3 flex items-center gap-3">
                <span className="font-mono text-[#FF6A00] font-bold text-sm">01</span>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#FF6A00] bg-[#FF6A00]/10 px-2 py-0.5 rounded">Duplication</span>
              </div>
              <div className="lg:col-span-5">
                <h3 className="font-display font-semibold text-lg md:text-xl text-white mb-3">
                  La fragmentation et la duplication des wrappers HTTP
                </h3>
                <p className="text-sm text-[#8E8E8A] leading-relaxed">
                  Chaque fichier recrée son propre mécanisme d&apos;authentification, de token refresh, et d&apos;intercepteurs réseau. Vous vous retrouvez avec des fonctions d&apos;utilitaires concurrentes et instables qui enflent à chaque commit.
                </p>
              </div>
              <div className="lg:col-span-4 flex flex-col gap-3 lg:pl-8">
                <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4 font-mono text-[10px] text-[#52524E]">
                  <div className="text-[#FF6A00]/50 mb-1">{"// Le cauchemar habituel dans 12 fichiers"}</div>
                  <div><span className="text-[#FF6A00]/80">const</span> fetchUsers = <span className="text-white/60">async</span> () =&gt; &#123;</div>
                  <div className="pl-3"><span className="text-[#FF6A00]/80">const</span> res = <span className="text-white/60">await</span> fetch(<span className="text-[#8E8E8A]">&apos;/api/users&apos;</span>)</div>
                  <div>&#125;</div>
                </div>
                <div className="font-mono text-[11px] text-red-400/90 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                  <span>Conséquence : Maintenance lourde &amp; instabilité d&apos;authentification.</span>
                </div>
              </div>
            </div>

            {/* Problem 2 */}
            <div className="py-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-3 flex items-center gap-3">
                <span className="font-mono text-[#FF6A00] font-bold text-sm">02</span>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#FF6A00] bg-[#FF6A00]/10 px-2 py-0.5 rounded">Erreurs</span>
              </div>
              <div className="lg:col-span-5">
                <h3 className="font-display font-semibold text-lg md:text-xl text-white mb-3">
                  L&apos;enfer des try/catch asynchrones
                </h3>
                <p className="text-sm text-[#8E8E8A] leading-relaxed">
                  Le code est saturé de blocs try/catch imbriqués. Parfois l&apos;erreur est avalée, parfois elle fait fuiter des logs internes d&apos;infrastructure SQL dans le navigateur client, violant la sécurité du produit.
                </p>
              </div>
              <div className="lg:col-span-4 flex flex-col justify-center lg:pl-8 h-full lg:pt-4">
                <div className="font-mono text-[11px] text-red-400/90 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                  <span>Risque : Fuites de sécurité &amp; débogage client impossible.</span>
                </div>
              </div>
            </div>

            {/* Problem 3 */}
            <div className="py-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-3 flex items-center gap-3">
                <span className="font-mono text-[#FF6A00] font-bold text-sm">03</span>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#FF6A00] bg-[#FF6A00]/10 px-2 py-0.5 rounded">Validation</span>
              </div>
              <div className="lg:col-span-5">
                <h3 className="font-display font-semibold text-lg md:text-xl text-white mb-3">
                  La validation d&apos;entrée &quot;Any&quot; déguisée
                </h3>
                <p className="text-sm text-[#8E8E8A] leading-relaxed">
                  Même si TypeScript compile, les données qui transitent via les formulaires ou le réseau ne sont jamais formellement analysées par Zod au moment de l&apos;exécution, créant des plantages silencieux en production.
                </p>
              </div>
              <div className="lg:col-span-4 flex flex-col justify-center lg:pl-8 h-full lg:pt-4">
                <div className="font-mono text-[11px] text-red-400/90 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                  <span>Risque : Plantages en production &amp; faux sentiment de sécurité.</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* THE PRIMITIVES SECTION: STICKY SCROLL SHOWCASE */}
      <section id="primitives" className="py-24 px-6 border-b border-white/5 bg-black">
        <div className="max-w-7xl mx-auto space-y-16">
          
          <div className="text-center max-w-2xl mx-auto flex flex-col items-center">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF6A00]/10 border border-[#FF6A00]/20 text-[#FF6A00] font-mono text-[10px] uppercase tracking-wider mb-4 select-none">
              <Sparkles size={11} className="animate-pulse" />
              Patterns AI-Optimized
            </div>
            <h2 className="font-display font-semibold text-3xl md:text-5xl text-white tracking-tight leading-tight mb-4">
              Primitives fondamentales pour structurer votre <span className="italic font-light text-[#FF6A00]">backend Next.js</span>
            </h2>
            <p className="text-sm text-[#8E8E8A] leading-relaxed">
              Conçues pour l&apos;ingénierie moderne, nos primitives standardisent la gestion des erreurs, l&apos;authentification et l&apos;orchestration de vos API. Parce qu&apos;elles imposent des signatures de code strictes et hautement prévisibles, vos agents IA (Cursor, Claude, Copilot) écrivent désormais un code backend irréprochable du premier coup.
            </p>
          </div>

          <InteractiveHorizontalTimeline />

        </div>
      </section>

      {/* CLACK-STYLING GENERATIVE CLI INTERACTIVE SECTION */}
      <section id="interactive-terminal" className="py-24 px-6 border-b border-white/5 bg-[#0B0B0B]">
        <div className="max-w-7xl mx-auto flex flex-col items-center">
          
          <div className="text-center max-w-2xl mb-16">
            <h2 className="font-display font-semibold text-3xl md:text-5xl text-white tracking-tight leading-tight mb-4">
              Un CLI génératif qui écrit des <span className="italic font-light text-[#FF6A00]">patterns parfaits</span>
            </h2>
            <p className="text-sm text-[#8E8E8A] leading-relaxed">
              Pas de package lourd à installer pour vos structures. Le CLI de ServerPatterns génère du code clair et modifiable directement dans votre projet.
            </p>
          </div>

          <InteractiveTerminal />

        </div>
      </section>

      {/* TARGET AUDIENCE - POUR QUI */}
      <section id="pour-qui" className="py-24 px-6 border-b border-white/5 bg-[#121212]/20">
        <div className="max-w-5xl mx-auto">
          
          <div className="text-center mb-16">
            <h2 className="font-display font-semibold text-3xl md:text-5xl text-white tracking-tight">
              Pour les équipes qui <span className="italic font-light text-[#FF6A00]">livrent vite</span>.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            
            <div className="bg-[#121212] p-8 rounded-2xl border border-white/5 relative group hover:border-[#FF6A00]/20 transition-all">
              <div className="absolute top-4 right-4 text-[#FF6A00]/30 font-mono text-xs font-bold">FREELANCES &amp; INDIES</div>
              <h3 className="font-display text-lg font-bold text-white mb-3">
                Livre tes projets en quelques jours
              </h3>
              <p className="text-xs text-[#8E8E8A] leading-relaxed">
                Ne réinvente pas la roue à chaque nouveau projet client. Lance <code className="font-mono text-[11px] text-[#FF6A00]">npx serverpatterns init</code>, crée tes routes d&apos;API, valide avec Zod, et déploie un code irréprochable et auditable dès le premier jour.
              </p>
            </div>

            <div className="bg-[#121212] p-8 rounded-2xl border border-white/5 relative group hover:border-[#FF6A00]/20 transition-all">
              <div className="absolute top-4 right-4 text-[#FF6A00]/30 font-mono text-xs font-bold">AGENCES &amp; ÉQUIPES</div>
              <h3 className="font-display text-lg font-bold text-white mb-3">
                Uniformise l&apos;architecture de tes développeurs
              </h3>
              <p className="text-xs text-[#8E8E8A] leading-relaxed">
                Finis les débats interminables sur la structure des dossiers API de Next.js, sur la façon de gérer les catch, ou d&apos;écrire les fetch. ServerPatterns impose un style unifié, lisible et performant, réduisant drastiquement le temps de relecture des PRs.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* FINAL CALL TO ACTION */}
      <section id="cta" className="relative py-32 px-6 overflow-hidden bg-black text-center">
        
        {/* Subtle grid background */}
        <div className="absolute inset-0 pointer-events-none opacity-5" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, #FF6A00 1px, transparent 0)',
          backgroundSize: '24px 24px'
        }} />

        <div className="max-w-4xl mx-auto relative z-10 flex flex-col items-center">
          
          <div className="flex items-center gap-2 mb-6">
            <Sparkles size={16} className="text-[#FF6A00] animate-pulse" />
            <span className="font-mono text-xs text-[#FF6A00] font-bold uppercase tracking-widest">
              LIVRAISON INITIALE DISPONIBLE
            </span>
          </div>

          <h2 className="font-display text-4xl sm:text-6xl font-bold tracking-tight text-white mb-6">
            Prêt à imposer <br />
            <span className="italic font-light text-[#FF6A00]">l&apos;ordre parfait</span> ?
          </h2>

          <p className="text-sm sm:text-base text-[#8E8E8A] max-w-lg mb-10 leading-relaxed">
            Libère-toi de la redondance d&apos;API. Laisse le CLI ServerPatterns structurer tes Route Handlers, tes validations et tes types en quelques secondes.
          </p>

          {/* Large Command Block with package manager tabs */}
          <div className="w-full max-w-xl mb-10 text-left border border-white/5 rounded-2xl overflow-hidden bg-[#121212]/50 p-1">
            <PackageManagerTabs
              pnpm="pnpm add @serverpatterns/core @serverpatterns/next"
              npm="npm install @serverpatterns/core @serverpatterns/next"
              yarn="yarn add @serverpatterns/core @serverpatterns/next"
              bun="bun add @serverpatterns/core @serverpatterns/next"
            />
          </div>

          <div className="flex items-center gap-6 text-xs font-mono text-[#8E8E8A]">
            <a 
              id="final-github"
              href="https://github.com/handcode0-create/serverpatterns" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-white flex items-center gap-1.5 transition"
            >
              <Github size={13} />
              <span>GitHub v0.1.0</span>
            </a>
            <span className="text-white/20">|</span>
            <a 
              id="final-studio"
              href="https://handcode.site" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-white flex items-center gap-1 transition"
            >
              <span>HANCODE STUDIO</span>
              <ExternalLink size={11} />
            </a>
          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#0B0B0B] border-t border-white/5 py-12 px-6 text-xs font-mono text-[#52524E]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img 
              src="/brand/logo.png" 
              alt="ServerPatterns Logo" 
              className="h-5 w-5 object-contain select-none opacity-60 hover:opacity-100 transition-opacity"
              referrerPolicy="no-referrer"
            />
            <span className="text-white font-medium">ServerPatterns © 2026</span>
            <span>•</span>
            <span>Distribué sous licence MIT</span>
          </div>
          
          <div className="flex items-center gap-4">
            <span>Propulsé par</span>
            <a 
              id="footer-handcode"
              href="https://handcode.site" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-[#8E8E8A] hover:text-white transition font-bold"
            >
              HANCODE STUDIO
            </a>
          </div>
        </div>
      </footer>

    </main>
  );
}
