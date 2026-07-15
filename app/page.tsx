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

export default function Home() {
  const [copiedInstall, setCopiedInstall] = useState(false);

  // --- Monade division tester state ---
  const [num, setNum] = useState<string>('42');
  const [den, setDen] = useState<string>('2');
  const [resultOutput, setResultOutput] = useState<{ ok: boolean; val?: string; err?: string } | null>(null);

  // --- API Client state ---
  const [apiLoading, setApiLoading] = useState(false);
  const [apiWithToken, setApiWithToken] = useState(true);
  const [apiResponse, setApiResponse] = useState<any>(null);

  // --- Route Handlers state ---
  const [payloadType, setPayloadType] = useState<'valid' | 'invalid'>('valid');

  // --- Server Action state ---
  const [taskTitle, setTaskTitle] = useState('');
  const [taskStatus, setTaskStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [taskMessage, setTaskMessage] = useState('');

  const handleCopyInstall = async () => {
    try {
      await navigator.clipboard.writeText('pnpm add @serverpatterns/core @serverpatterns/next');
      setCopiedInstall(true);
      setTimeout(() => setCopiedInstall(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  // Run mock division
  const runDivisionTest = () => {
    const n = parseFloat(num);
    const d = parseFloat(den);
    if (isNaN(n) || isNaN(d)) {
      setResultOutput({
        ok: false,
        err: 'Erreur: Les entrées doivent être des nombres valides.'
      });
      return;
    }
    if (d === 0) {
      setResultOutput({
        ok: false,
        err: 'Erreur division par zéro: Division impossible.'
      });
      return;
    }
    setResultOutput({
      ok: true,
      val: `Division réussie: ${n} / ${d} = ${n / d}`
    });
  };

  // Run API client simulation
  const runApiSim = () => {
    setApiLoading(true);
    setApiResponse(null);
    setTimeout(() => {
      setApiLoading(false);
      if (apiWithToken) {
        setApiResponse({
          ok: true,
          status: 200,
          data: {
            user: { id: 'usr_9x2', name: 'Alex Johnson', role: 'architect' },
            meta: { tokenType: 'Bearer', refreshed: false }
          }
        });
      } else {
        setApiResponse({
          ok: false,
          status: 401,
          error: {
            message: 'Requête non autorisée. Jeton de sécurité manquant ou invalide.',
            code: 'AUTH_REQUIRED'
          }
        });
      }
    }, 1200);
  };

  // Run Server Action Validation
  const submitServerActionSim = (e: React.FormEvent) => {
    e.preventDefault();
    if (taskTitle.trim().length < 3) {
      setTaskStatus('error');
      setTaskMessage('Zod validation failed: "title" must be at least 3 characters. Action rejected on the server.');
    } else {
      setTaskStatus('success');
      setTaskMessage(`Success! Task "${taskTitle}" successfully stored type-safely. returned state: Result.ok({ id: "tsk_82x" })`);
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
                  href="https://github.com/hancode-studio/serverpatterns" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center gap-1.5 hover:underline"
                >
                  <Github size={12} />
                  <span>hancode/serverpatterns</span>
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

          {/* Asymmetric Problem Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* Major Pain Point (Left - lg:col-span-7) */}
            <div className="lg:col-span-7 flex flex-col justify-between bg-white/[0.02] border border-white/5 rounded-2xl p-8 relative overflow-hidden group hover:border-[#FF6A00]/20 transition-all duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF6A00]/5 rounded-full blur-2xl pointer-events-none" />
              
              <div>
                <div className="flex items-center gap-2 text-xs font-mono text-[#FF6A00] mb-4">
                  <span className="font-bold">▲</span>
                  <span>DUPLICATION DU CHEMIN DE FER</span>
                </div>
                <h3 className="font-display font-bold text-2xl text-white mb-4">
                  La fragmentation et la duplication des wrappers HTTP
                </h3>
                <p className="text-sm text-[#8E8E8A] leading-relaxed mb-6">
                  Chaque fichier recrée son propre mécanisme d&apos;authentification, de token refresh, et d&apos;intercepteurs réseau. Vous vous retrouvez avec des fonctions d&apos;utilitaires concurrentes et instables qui enflent à chaque commit.
                </p>

                {/* Styled dirty code illustration */}
                <div className="bg-black/40 border border-white/5 rounded-xl p-4 font-mono text-[10px] text-[#52524E] mb-6">
                  <div className="text-[#FF6A00]/50">{"// Le cauchemar habituel dans 12 fichiers différents"}</div>
                  <div><span className="text-red-500/80">const</span> fetchUsers = <span className="text-[#8E8E8A]">async</span> () =&gt; &#123;</div>
                  <div className="pl-4"><span className="text-red-500/80">try</span> &#123;</div>
                  <div className="pl-8"><span className="text-red-500/80">const</span> res = <span className="text-red-500/80">await</span> fetch(<span className="text-[#8E8E8A]">&apos;/api/users&apos;</span>, &#123; <span className="text-[#FF6A00]/70">headers: ...</span> &#125;)</div>
                  <div className="pl-8"><span className="text-[#FF6A00]/50">{"// Oh wait, comment on rafraîchit le token ici déjà ?"}</span></div>
                  <div className="pl-4">&#125; <span className="text-red-500/80">catch</span> (err) &#123; <span className="text-red-500/80">throw</span> err; &#125;</div>
                  <div>&#125;</div>
                </div>
              </div>

              <div className="font-mono text-xs text-[#E2E2DF] bg-white/5 px-3 py-2 rounded-lg border border-white/5 w-fit mt-auto">
                <span className="text-red-500 font-bold">Conséquence :</span> Maintenance lourde &amp; instabilité d&apos;authentification.
              </div>
            </div>

            {/* Compact Pain Points (Right - lg:col-span-5 - Vertical stack) */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              
              {/* Problem 2 */}
              <div className="bg-white/[0.01] border border-white/5 rounded-2xl p-6 flex flex-col justify-between hover:border-[#FF6A00]/20 transition-all duration-300">
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono text-[#FF6A00] mb-3">
                    <span className="font-bold">▲</span>
                    <span>INCOHÉRENCE DES ERREURS</span>
                  </div>
                  <h4 className="font-display font-semibold text-lg text-white mb-2">
                    L&apos;enfer des try/catch asynchrones
                  </h4>
                  <p className="text-xs text-[#8E8E8A] leading-relaxed">
                    Le code est saturé de blocs try/catch imbriqués. Parfois l&apos;erreur est avalée, parfois elle fait fuiter des logs internes d&apos;infrastructure SQL dans le navigateur client, violant la sécurité du produit.
                  </p>
                </div>
                <div className="mt-4 font-mono text-[10px] text-[#52524E] border-t border-white/5 pt-3">
                  <span className="text-red-500/80">RISQUE:</span> Fuites de sécurité &amp; débogage client impossible.
                </div>
              </div>

              {/* Problem 3 */}
              <div className="bg-white/[0.01] border border-white/5 rounded-2xl p-6 flex flex-col justify-between hover:border-[#FF6A00]/20 transition-all duration-300">
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono text-[#FF6A00] mb-3">
                    <span className="font-bold">▲</span>
                    <span>TYPAGE SILENCIEUSEMENT FAUX</span>
                  </div>
                  <h4 className="font-display font-semibold text-lg text-white mb-2">
                    La validation d&apos;entrée &quot;Any&quot; déguisée
                  </h4>
                  <p className="text-xs text-[#8E8E8A] leading-relaxed">
                    Même si TypeScript compile, les données qui transitent via les formulaires ou le réseau ne sont jamais formellement analysées par Zod au moment de l&apos;exécution, créant des plantages silencieux en production.
                  </p>
                </div>
                <div className="mt-4 font-mono text-[10px] text-[#52524E] border-t border-white/5 pt-3">
                  <span className="text-red-500/80">RISQUE:</span> Plantages en production &amp; faux sentiment de sécurité.
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* THE PRIMITIVES SECTION: ASYMMETRIC INTERACTIVE BENTO GRID */}
      <section id="primitives" className="py-24 px-6 border-b border-white/5 bg-[#121212]/30">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="font-display font-semibold text-3xl md:text-5xl text-white tracking-tight leading-tight mb-4">
              Six abstractions pour imposer <span className="italic font-light text-[#FF6A00]">l&apos;ordre strict</span>
            </h2>
            <p className="text-sm text-[#8E8E8A] leading-relaxed">
              Inspiré des plus beaux bento-grids fonctionnels : clique, saisis des valeurs et teste en direct comment ServerPatterns élimine le désordre de ta couche Next.js.
            </p>
          </div>

          {/* Bento Grid layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* CARD 1: Result<T, E> (LARGE CARD - col-span-8) */}
            <div className="lg:col-span-8 bg-[#121212] border border-white/5 rounded-2xl p-6 flex flex-col justify-between group hover:border-[#FF6A00]/20 transition-all duration-300">
              
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                
                {/* Info (7 cols) */}
                <div className="md:col-span-7 space-y-4">
                  <div className="inline-flex p-2.5 rounded-xl bg-[#FF6A00]/10 text-[#FF6A00]">
                    <Layers size={18} />
                  </div>
                  <h3 className="font-display text-xl font-bold text-white flex items-center gap-2">
                    Result&lt;T, E&gt;
                    <span className="text-xs font-mono px-2 py-0.5 bg-white/5 rounded border border-white/5 text-[#8E8E8A]">Monade</span>
                  </h3>
                  <p className="text-xs text-[#8E8E8A] leading-relaxed">
                    La fondation du kit. Au lieu de lever des exceptions incontrôlables, chaque fonction renvoie soit un succès typé, soit une erreur. Le typage de l&apos;erreur est forcé et résolu via des méthodes fonctionnelles explicites.
                  </p>
                  
                  <div className="font-mono text-[10px] text-[#52524E]">
                    <span className="text-green-500 font-bold">✓</span> .isOk() ou .isErr() pour bifurquer sans try/catch.
                  </div>
                </div>

                {/* Mini Live Demo Widget (5 cols) */}
                <div className="md:col-span-5 bg-black/40 border border-white/5 p-4 rounded-xl flex flex-col gap-3 font-mono text-xs">
                  <div className="text-[#FF6A00] font-bold text-[11px] border-b border-white/5 pb-2 uppercase tracking-wider flex items-center justify-between">
                    <span>Monade Division Tester</span>
                    <span className="h-1.5 w-1.5 bg-green-500 rounded-full animate-ping" />
                  </div>
                  
                  <div className="flex gap-2 items-center">
                    <div className="flex-1">
                      <label className="text-[9px] text-[#52524E] block mb-1">Numerateur</label>
                      <input 
                        type="text" 
                        value={num} 
                        onChange={(e) => setNum(e.target.value)}
                        className="w-full bg-[#1A1A1A] border border-white/10 rounded px-2 py-1 text-white text-center focus:outline-none focus:border-[#FF6A00]"
                      />
                    </div>
                    <span className="text-[#8E8E8A] pt-4">/</span>
                    <div className="flex-1">
                      <label className="text-[9px] text-[#52524E] block mb-1">Dénominateur</label>
                      <input 
                        type="text" 
                        value={den} 
                        onChange={(e) => setDen(e.target.value)}
                        className="w-full bg-[#1A1A1A] border border-white/10 rounded px-2 py-1 text-white text-center focus:outline-none focus:border-[#FF6A00]"
                      />
                    </div>
                  </div>

                  <button 
                    onClick={runDivisionTest}
                    className="w-full bg-[#FF6A00] hover:bg-[#E05D00] text-black font-semibold py-1.5 rounded transition text-[11px]"
                  >
                    Exécuter division
                  </button>

                  {resultOutput && (
                    <div className={`p-2.5 rounded text-[10px] leading-tight border transition-all ${
                      resultOutput.ok 
                        ? 'bg-green-500/10 text-green-400 border-green-500/20' 
                        : 'bg-red-500/10 text-red-400 border-red-500/20'
                    }`}>
                      <div className="font-bold mb-1">
                        {resultOutput.ok ? 'Result.ok(value)' : 'Result.err(error)'} :
                      </div>
                      <div className="truncate">{resultOutput.ok ? resultOutput.val : resultOutput.err}</div>
                    </div>
                  )}
                </div>

              </div>

              {/* Minified real code view below inside the card */}
              <div className="mt-6 border-t border-white/5 pt-4">
                <CodeBlock 
                  code={`import { Result, ok, err } from '@serverpatterns/core';

// Signature propre, pas d'erreurs jetées au hasard
const divide = (a: number, b: number): Result<number, Error> => 
  b === 0 ? err(new Error("Div par 0")) : ok(a / b);`}
                  title="src/lib/math.ts"
                />
              </div>

            </div>

            {/* CARD 2: createApiClient() (SMALL CARD - col-span-4) */}
            <div className="lg:col-span-4 bg-[#121212] border border-white/5 rounded-2xl p-6 flex flex-col justify-between group hover:border-[#FF6A00]/20 transition-all duration-300">
              
              <div className="space-y-4">
                <div className="inline-flex p-2.5 rounded-xl bg-[#FF6A00]/10 text-[#FF6A00]">
                  <Network size={18} />
                </div>
                <h3 className="font-display text-xl font-bold text-white flex items-center gap-2">
                  createApiClient()
                </h3>
                <p className="text-xs text-[#8E8E8A] leading-relaxed">
                  Le client d&apos;API standardisé de bout en bout. Il centralise tes headers d&apos;authentification et intercepte les requêtes réseau pour te retourner des types Result unifiés sans try/catch.
                </p>

                {/* API Interactive Simulator */}
                <div className="bg-black/40 border border-white/5 p-4 rounded-xl flex flex-col gap-3 font-mono text-xs">
                  <div className="flex items-center justify-between text-[10px] text-[#8E8E8A]">
                    <span>Mock API Console</span>
                    <div className="flex items-center gap-1.5">
                      <label className="text-[9px] text-[#52524E]">Auth Token</label>
                      <input 
                        type="checkbox" 
                        checked={apiWithToken} 
                        onChange={() => setApiWithToken(!apiWithToken)}
                        className="rounded accent-[#FF6A00] cursor-pointer"
                      />
                    </div>
                  </div>

                  <button 
                    onClick={runApiSim}
                    disabled={apiLoading}
                    className="w-full border border-white/10 hover:border-[#FF6A00]/40 text-white py-1.5 rounded transition text-[11px] disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {apiLoading ? (
                      <span className="w-2.5 h-2.5 border-2 border-[#FF6A00]/20 border-t-[#FF6A00] rounded-full animate-spin" />
                    ) : (
                      <span>api.get&lt;User&gt;(&apos;/profile&apos;)</span>
                    )}
                  </button>

                  {apiResponse && (
                    <div className={`p-2 rounded text-[9px] leading-tight font-mono border ${
                      apiResponse.ok ? 'bg-green-500/10 border-green-500/20 text-[#E2E2DF]' : 'bg-red-500/10 border-red-500/20 text-red-300'
                    }`}>
                      <div className="font-bold flex justify-between mb-1">
                        <span>HTTP {apiResponse.status}</span>
                        <span className={apiResponse.ok ? 'text-green-400' : 'text-red-400'}>
                          {apiResponse.ok ? 'SUCCESS' : 'FAILURE'}
                        </span>
                      </div>
                      <pre className="overflow-x-auto text-[8px] whitespace-pre-wrap">
                        {JSON.stringify(apiResponse.ok ? apiResponse.data : apiResponse.error, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6 border-t border-white/5 pt-4">
                <CodeBlock 
                  code={`const api = createApiClient({ baseUrl: '/api' });
const res = await api.get<User>('/profile');
if (res.isErr()) return showToast(res.error);
render(res.value);`}
                  title="src/lib/api.ts"
                />
              </div>

            </div>

            {/* CARD 3: createGetHandler / createPostHandler (MEDIUM CARD - col-span-6) */}
            <div className="lg:col-span-6 bg-[#121212] border border-white/5 rounded-2xl p-6 flex flex-col justify-between group hover:border-[#FF6A00]/20 transition-all duration-300">
              
              <div className="space-y-4">
                <div className="inline-flex p-2.5 rounded-xl bg-[#FF6A00]/10 text-[#FF6A00]">
                  <Shield size={18} />
                </div>
                <h3 className="font-display text-xl font-bold text-white">
                  createGetHandler() &amp; createPostHandler()
                </h3>
                <p className="text-xs text-[#8E8E8A] leading-relaxed">
                  Sécurise tes routes HTTP Next.js à l&apos;aide d&apos;un validateur d&apos;entrée transparent et intégré. Le wrapper intercepte la requête, applique le schéma Zod, rejette proprement en amont les données fausses et évite les try/catch verbeux.
                </p>

                {/* Interactive validation simulator */}
                <div className="bg-black/40 border border-white/5 p-4 rounded-xl flex flex-col gap-3 font-mono text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-[#8E8E8A]">Test Validation Payload</span>
                    <div className="flex gap-1.5 bg-[#1A1A1A] p-0.5 rounded border border-white/5">
                      <button 
                        onClick={() => setPayloadType('valid')}
                        className={`px-2 py-0.5 rounded text-[9px] ${payloadType === 'valid' ? 'bg-[#FF6A00] text-black font-semibold' : 'text-[#8E8E8A]'}`}
                      >
                        Valide
                      </button>
                      <button 
                        onClick={() => setPayloadType('invalid')}
                        className={`px-2 py-0.5 rounded text-[9px] ${payloadType === 'invalid' ? 'bg-red-500 text-white font-semibold' : 'text-[#8E8E8A]'}`}
                      >
                        Invalide
                      </button>
                    </div>
                  </div>

                  <div className="bg-black/60 p-2.5 rounded text-[10px] text-[#8E8E8A] border border-white/5">
                    {payloadType === 'valid' ? (
                      <div>
                        <div className="text-green-400 font-bold mb-1">{"// Données reçues conformes"}</div>
                        <span className="text-[#E2E2DF]">body :</span> &#123; email: <span className="text-[#FFA366]">&quot;smith@hancode.site&quot;</span> &#125;
                        <div className="mt-2 text-green-500/80">&gt; Route Handler s&apos;exécute et retourne 200 OK</div>
                      </div>
                    ) : (
                      <div>
                        <div className="text-red-400 font-bold mb-1">{"// Erreur Zod interceptée"}</div>
                        <span className="text-red-300">HTTP 400 Bad Request</span>
                        <pre className="text-[8px] mt-1 text-red-300/80">
                          {`{
  "success": false,
  "error": "Email invalide (invalid_string)"
}`}
                        </pre>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-6 border-t border-white/5 pt-4">
                <CodeBlock 
                  code={`export const POST = createPostHandler({
  schema: z.object({ email: z.string().email() }),
  handler: async ({ body }) => {
    return await db.users.register(body.email);
  }
});`}
                  title="src/app/api/register/route.ts"
                />
              </div>

            </div>

            {/* CARD 4: withServerAction (MEDIUM CARD - col-span-6) */}
            <div className="lg:col-span-6 bg-[#121212] border border-white/5 rounded-2xl p-6 flex flex-col justify-between group hover:border-[#FF6A00]/20 transition-all duration-300">
              
              <div className="space-y-4">
                <div className="inline-flex p-2.5 rounded-xl bg-[#FF6A00]/10 text-[#FF6A00]">
                  <Zap size={18} />
                </div>
                <h3 className="font-display text-xl font-bold text-white">
                  withServerAction()
                </h3>
                <p className="text-xs text-[#8E8E8A] leading-relaxed">
                  Les Server Actions de Next.js contournent la validation par défaut. Ce wrapper garantit que tes actions reçoivent des arguments entièrement analysés et sécurisés par Zod, tout en transmettant des objets Result propres à ton UI.
                </p>

                {/* Form Simulation */}
                <form onSubmit={submitServerActionSim} className="bg-black/40 border border-white/5 p-4 rounded-xl flex flex-col gap-2.5 font-mono text-xs">
                  <div className="text-[10px] text-[#8E8E8A] border-b border-white/5 pb-1 flex items-center justify-between">
                    <span>Créer une tâche sécurisée</span>
                    <Lock size={10} className="text-[#FF6A00]" />
                  </div>
                  
                  <div>
                    <input 
                      type="text" 
                      placeholder="Nom de la tâche..." 
                      value={taskTitle}
                      onChange={(e) => setTaskTitle(e.target.value)}
                      className="w-full bg-[#1A1A1A] border border-white/10 rounded px-2.5 py-1 text-white text-xs focus:outline-none focus:border-[#FF6A00]"
                    />
                    <span className="text-[8px] text-[#52524E] mt-1 block">Min. 3 caractères pour valider Zod</span>
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-[#FF6A00] text-black font-semibold py-1 rounded text-[11px] hover:bg-[#E05D00] transition"
                  >
                    Lancer Server Action
                  </button>

                  {taskStatus !== 'idle' && (
                    <div className={`p-2 rounded text-[9px] leading-tight border flex items-start gap-1.5 ${
                      taskStatus === 'success' 
                        ? 'bg-green-500/10 border-green-500/20 text-green-400' 
                        : 'bg-red-500/10 border-red-500/20 text-red-400'
                    }`}>
                      {taskStatus === 'success' ? <Check size={11} className="mt-0.5 shrink-0" /> : <AlertCircle size={11} className="mt-0.5 shrink-0" />}
                      <span>{taskMessage}</span>
                    </div>
                  )}
                </form>
              </div>

              <div className="mt-6 border-t border-white/5 pt-4">
                <CodeBlock 
                  code={`export const createTask = withServerAction({
  schema: z.object({ title: z.string().min(3) }),
  action: async ({ body }) => {
    return await db.tasks.save({ title: body.title });
  }
});`}
                  title="src/app/actions/tasks.ts"
                />
              </div>

            </div>

            {/* CARD 5: createWebhookHandler (MEDIUM CARD - col-span-6) */}
            <div className="lg:col-span-6 bg-[#121212] border border-white/5 rounded-2xl p-6 flex flex-col justify-between group hover:border-[#FF6A00]/20 transition-all duration-300">
              
              <div className="space-y-4">
                <div className="inline-flex p-2.5 rounded-xl bg-[#FF6A00]/10 text-[#FF6A00]">
                  <Webhook size={18} />
                </div>
                <h3 className="font-display text-xl font-bold text-white">
                  createWebhookHandler()
                </h3>
                <p className="text-xs text-[#8E8E8A] leading-relaxed">
                  Gère et valide les webhooks Stripe, Lemon Squeezy ou GitHub de façon sécurisée et compatible Edge Runtime. Ce wrapper extrait le corps brut exact pour auditer cryptographiquement la signature HMAC-SHA256 en arrière-plan.
                </p>

                <div className="bg-black/40 border border-white/5 p-4 rounded-xl flex flex-col gap-2 font-mono text-xs text-[#8E8E8A]">
                  <div className="text-[10px] text-white font-semibold flex items-center justify-between border-b border-white/5 pb-1.5">
                    <span>Validation Web Crypto API</span>
                    <span className="text-[9px] text-[#FF6A00]">Fast &amp; Edge-Ready</span>
                  </div>
                  <div className="text-[11px] leading-relaxed">
                    <span className="text-green-400">✓</span> Lecture du <code className="text-white text-[10px]">rawBody</code> à l&apos;exécution<br />
                    <span className="text-green-400">✓</span> Compatibilité totale Vercel Edge &amp; Cloudflare Workers<br />
                    <span className="text-green-400">✓</span> Gestion des erreurs automatisée avec codes HTTP standards
                  </div>
                </div>
              </div>

              <div className="mt-6 border-t border-white/5 pt-4">
                <CodeBlock 
                  code={`export const POST = createWebhookHandler({
  signatureHeader: 'stripe-signature',
  secret: () => process.env.STRIPE_SECRET!,
  verify: async (rawBody, signature, secret) => {
    return await verifyHmacSha256Signature(rawBody, signature, secret);
  },
  handler: async ({ body }) => {
    return { status: 200, body: { received: true } };
  }
});`}
                  title="src/app/api/webhooks/stripe/route.ts"
                />
                <div className="mt-3 flex justify-end">
                  <Link 
                    href="/docs/primitives/webhook"
                    className="text-[10px] font-mono uppercase tracking-wider text-[#FF6A00] hover:text-white transition flex items-center gap-1"
                  >
                    Documentation complète ↳
                  </Link>
                </div>
              </div>

            </div>

            {/* CARD 6: withAuth (MEDIUM CARD - col-span-6) */}
            <div className="lg:col-span-6 bg-[#121212] border border-white/5 rounded-2xl p-6 flex flex-col justify-between group hover:border-[#FF6A00]/20 transition-all duration-300">
              
              <div className="space-y-4">
                <div className="inline-flex p-2.5 rounded-xl bg-[#FF6A00]/10 text-[#FF6A00]">
                  <Lock size={18} />
                </div>
                <h3 className="font-display text-xl font-bold text-white">
                  withAuth()
                </h3>
                <p className="text-xs text-[#8E8E8A] leading-relaxed">
                  Bâtis un middleware d&apos;authentification et d&apos;autorisation de niveau entreprise (RBAC/ABAC). Encapsule tes Server Actions ou tes fonctions serveur pour valider les privilèges d&apos;accès en amont.
                </p>

                <div className="bg-black/40 border border-white/5 p-4 rounded-xl flex flex-col gap-2 font-mono text-xs text-[#8E8E8A]">
                  <div className="text-[10px] text-white font-semibold flex items-center justify-between border-b border-white/5 pb-1.5">
                    <span>Middleware d&apos;Autorisation</span>
                    <span className="text-[9px] text-[#FF6A00]">RBAC &amp; ABAC</span>
                  </div>
                  <div className="text-[11px] leading-relaxed">
                    <span className="text-green-400">✓</span> Résolveur global de session configurable<br />
                    <span className="text-green-400">✓</span> Contrôle par rôles (<code className="text-white text-[10px]">roles: [&apos;admin&apos;]</code>)<br />
                    <span className="text-green-400">✓</span> Autorisation fine contextuelle par rapport à l&apos;input
                  </div>
                </div>
              </div>

              <div className="mt-6 border-t border-[#FF6A00]/10 pt-4">
                <CodeBlock 
                  code={`export const deleteUser = withAuth({
  roles: ['admin'],
  authorize: async (user, input) => {
    return user.id !== input.targetUserId;
  }
}, async ({ input, user }) => {
  return await db.users.delete(input.targetUserId);
});`}
                  title="src/app/actions/admin.ts"
                />
                <div className="mt-3 flex justify-end">
                  <Link 
                    href="/docs/primitives/auth"
                    className="text-[10px] font-mono uppercase tracking-wider text-[#FF6A00] hover:text-white transition flex items-center gap-1"
                  >
                    Documentation complète ↳
                  </Link>
                </div>
              </div>

            </div>

          </div>

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
              href="https://github.com/hancode-studio/serverpatterns" 
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
