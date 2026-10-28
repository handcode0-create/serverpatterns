'use client';

import React, { useState, useEffect, useRef } from 'react';
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
import InteractiveTerminal from '@/components/InteractiveTerminal';
import CodeBlock from '@/components/CodeBlock';
import PackageManagerTabs from '@/components/PackageManagerTabs';

interface PrimitiveDetail {
  id: string;
  title: string;
  badge: string;
  description: string;
  focus: string;
  code: string;
}

const PRIMITIVE_DETAILS: PrimitiveDetail[] = [
  {
    id: 'result',
    title: 'Result<T, E>',
    badge: 'MONADE D\'ERREUR',
    description: 'Déclarez des fonctions pures et totalement prévisibles. Le type de retour force l\'appelant à traiter explicitement l\'erreur avant d\'accéder à la valeur, créant un cadre de développement ultra-robuste et auto-documenté.',
    focus: 'Plus de try/catch désordonnés. Un contrat de retour explicite pour que votre IA sache exactement quoi faire en cas de succès ou d\'échec.',
    code: `import { Result, ok, err } from '@serverpatterns/core';

// Signature propre, pas d'erreurs jetées au hasard
function divide(a: number, b: number): Result<number, Error> {
  return b === 0 
    ? err(new Error("Division par zéro impossible")) 
    : ok(a / b);
}`
  },
  {
    id: 'api-client',
    title: 'createApiClient()',
    badge: 'CLIENT HTTP TYPÉ',
    description: 'Unifiez votre couche réseau. Centralisez l\'injection de tokens d\'accès, gérez les redirections globales de session, et récupérez des objets Result robustes pour chaque requête de votre application sans pollution try/catch.',
    focus: 'Centralisation absolue des appels API externes. Donnez à votre agent IA un schéma de requête immuable.',
    code: `import { createApiClient, isOk } from '@serverpatterns/core';

const api = createApiClient({ baseUrl: '/api/v1' });

const result = await api.get<User>('/me');
if (isOk(result)) {
  renderUser(result.data);
} else {
  console.error("Erreur récupérée :", result.error.message);
}`
  },
  {
    id: 'webhook-handler',
    title: 'verifyHmacSignature()',
    badge: 'VÉRIFICATION DE SIGNATURE',
    description: 'Vérifie la signature HMAC-SHA256 d\'un webhook (Stripe, Wave, GitHub...) avant de faire confiance au payload. Fonction bas niveau à appeler toi-même dans un Route Handler standard — pas de wrapper magique, tu gardes le contrôle total du flux.',
    focus: 'La réception de webhooks Stripe ou Wave à l\'abri des injections et des bugs de signature, prête à l\'emploi.',
    code: `import { verifyHmacSignature } from '@serverpatterns/core';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const rawBody = await request.text();
  const verification = verifyHmacSignature({
    rawBody,
    signatureHeader: request.headers.get('stripe-signature'),
    secret: process.env.STRIPE_SECRET!,
  });

  if (!verification.valid) {
    return NextResponse.json({ error: verification.reason }, { status: 401 });
  }

  const event = JSON.parse(rawBody);
  await processOrder(event);
  return NextResponse.json({ received: true });
}`
  },
  {
    id: 'with-auth',
    title: 'withAuth()',
    badge: 'MIDDLEWARE D\'ACCÈS',
    description: 'Sécurisez vos Server Actions de manière déclarative. Validez les privilèges en amont grâce à des gardes de rôles robustes avant même que votre logique métier ne démarre.',
    focus: 'Middleware d\'authentification et de rôles (RBAC) pour blinder vos Server Actions avant que l\'IA ne génère la logique métier.',
    code: `import { z } from 'zod';
import { withAuth, ok } from '@serverpatterns/next';
import { getSession } from '@/lib/auth/session'; // fourni par le développeur

export const deleteProject = withAuth({
  getSession,
  requiredRoles: ['admin'],
  inputSchema: z.object({ projectId: z.string() }),
  action: async (input, session) => {
    return ok(await db.delete(input.projectId));
  },
});`
  }
];

export default function Home() {
  const [copiedInstall, setCopiedInstall] = useState(false);
  const [activePrimitive, setActivePrimitive] = useState<string>('result');

  const handleCopyInstall = async () => {
    try {
      await navigator.clipboard.writeText('pnpm add @serverpatterns/core @serverpatterns/next');
      setCopiedInstall(true);
      setTimeout(() => setCopiedInstall(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  const selectedPrimitive = PRIMITIVE_DETAILS.find(p => p.id === activePrimitive) || PRIMITIVE_DETAILS[0];

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

      {/* SWISS GRID SECTION: THE CRITIQUE & SYSTEM PRIMITIVES */}
      <section id="unified-experience-container" className="relative w-full border-b border-white/10 bg-[#0B0B0B] scroll-mt-20 py-24 px-6 md:px-12">
        
        {/* Subtle architectural background line accents */}
        <div className="absolute inset-0 pointer-events-none z-0" style={{
          backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.02) 1px, transparent 1px)',
          backgroundSize: 'calc((100% - 24px * 11) / 12 + 24px) 100%'
        }} />

        <div className="max-w-7xl mx-auto relative z-10 flex flex-col gap-24 md:gap-32">
          
          {/* SUB-SECTION 1: CONSTAT DE TERRAIN */}
          <div id="the-problem-split" className="scroll-mt-24">
            
            {/* Header block aligned left */}
            <div className="mb-16">
              <span className="font-mono text-swiss-xs text-[#FF6A00] tracking-widest uppercase block mb-4 leading-[16px]">
                ◆ CONSTAT DE TERRAIN
              </span>
              <h2 className="font-display font-semibold text-swiss-xl md:text-swiss-xxl text-white tracking-tight leading-[56px] mb-4">
                Pourquoi ta couche serveur <br />semble toujours <span className="italic font-light text-[#FF6A00]">bricolée</span>
              </h2>
              <p className="text-swiss-sm text-[#8E8E8A] leading-[24px] font-mono max-w-2xl">
                La liberté de Next.js App Router mène souvent au chaos architectural sans un cadre d&apos;équipe rigide.
              </p>
            </div>

            {/* Swiss 12-Column Grid Rows */}
            <div className="border-t border-white/10 divide-y divide-white/10">
              
              {/* Problem 1 */}
              <div className="py-8 grid grid-cols-12 gap-y-6 md:gap-x-6 items-start">
                {/* Number (2 cols) */}
                <div className="col-span-12 md:col-span-2">
                  <div className="font-display font-semibold text-swiss-xxl leading-[56px] text-[#FF6A00] select-none">
                    01
                  </div>
                  <span className="text-swiss-xs font-mono uppercase tracking-widest text-[#FF6A00] bg-[#FF6A00]/10 px-2 py-1 inline-block mt-2">
                    Duplication
                  </span>
                </div>

                {/* Title + Description (6 cols) */}
                <div className="col-span-12 md:col-span-6 flex flex-col justify-start">
                  <h3 className="font-display font-semibold text-swiss-md leading-[32px] text-white mb-4">
                    La fragmentation et la duplication des wrappers HTTP
                  </h3>
                  <p className="text-swiss-sm text-[#8E8E8A] leading-[24px]">
                    Chaque fichier recrée son propre mécanisme d&apos;authentification, de token refresh, et d&apos;intercepteurs réseau. Vous vous retrouvez avec des fonctions d&apos;utilitaires concurrentes et instables qui enflent à chaque commit.
                  </p>
                </div>

                {/* Code + Consequence (4 cols) */}
                <div className="col-span-12 md:col-span-4 flex flex-col gap-4">
                  <div className="bg-white/[0.02] border border-white/10 p-4 font-mono text-swiss-xs text-[#8E8E8A] rounded-none">
                    <div className="text-[#FF6A00]/50 mb-2">{"// Le cauchemar dans 12 fichiers"}</div>
                    <div><span className="text-[#FF6A00]">const</span> fetchUsers = <span className="text-white/60">async</span> () =&gt; &#123;</div>
                    <div className="pl-4"><span className="text-[#FF6A00]">const</span> res = <span className="text-white/60">await</span> fetch(<span className="text-white/80">&apos;/api/user/profile&apos;</span>);</div>
                    <div>&#125;</div>
                  </div>
                  <div className="font-mono text-swiss-xs text-red-400 leading-[16px] flex items-start gap-2.5">
                    <span className="w-2 h-2 rounded-none bg-red-500 mt-1 shrink-0" />
                    <span>Conséquence : Maintenance lourde &amp; instabilité d&apos;authentification.</span>
                  </div>
                </div>
              </div>

              {/* Problem 2 */}
              <div className="py-8 grid grid-cols-12 gap-y-6 md:gap-x-6 items-start">
                {/* Number (2 cols) */}
                <div className="col-span-12 md:col-span-2">
                  <div className="font-display font-semibold text-swiss-xxl leading-[56px] text-[#FF6A00] select-none">
                    02
                  </div>
                  <span className="text-swiss-xs font-mono uppercase tracking-widest text-[#FF6A00] bg-[#FF6A00]/10 px-2 py-1 inline-block mt-2">
                    Erreurs
                  </span>
                </div>

                {/* Title + Description (6 cols) */}
                <div className="col-span-12 md:col-span-6 flex flex-col justify-start">
                  <h3 className="font-display font-semibold text-swiss-md leading-[32px] text-white mb-4">
                    L&apos;enfer des try/catch asynchrones
                  </h3>
                  <p className="text-swiss-sm text-[#8E8E8A] leading-[24px]">
                    Le code est saturé de blocs try/catch imbriqués. Parfois l&apos;erreur est avalée silencieusement, parfois elle fait fuiter des logs internes d&apos;infrastructure SQL directement dans le navigateur du client, violant la sécurité du produit.
                  </p>
                </div>

                {/* Code + Consequence (4 cols) */}
                <div className="col-span-12 md:col-span-4 flex flex-col gap-4">
                  <div className="bg-white/[0.02] border border-white/10 p-4 font-mono text-swiss-xs text-[#8E8E8A] rounded-none">
                    <div className="text-[#FF6A00]/50 mb-2">{"// Erreurs non centralisées"}</div>
                    <div><span className="text-[#FF6A00]">try</span> &#123;</div>
                    <div className="pl-4"><span className="text-white/60">await</span> db.execute(query);</div>
                    <div>&#125; <span className="text-[#FF6A00]">catch</span> (e) &#123;</div>
                    <div className="pl-4"><span className="text-[#FF6A00]">return</span> &#123; error: e.message &#125;;</div>
                    <div>&#125;</div>
                  </div>
                  <div className="font-mono text-swiss-xs text-red-400 leading-[16px] flex items-start gap-2.5">
                    <span className="w-2 h-2 rounded-none bg-red-500 mt-1 shrink-0" />
                    <span>Risque : Fuites de sécurité majeures &amp; débogage impossible.</span>
                  </div>
                </div>
              </div>

              {/* Problem 3 */}
              <div className="py-8 grid grid-cols-12 gap-y-6 md:gap-x-6 items-start">
                {/* Number (2 cols) */}
                <div className="col-span-12 md:col-span-2">
                  <div className="font-display font-semibold text-swiss-xxl leading-[56px] text-[#FF6A00] select-none">
                    02
                  </div>
                  <span className="text-swiss-xs font-mono uppercase tracking-widest text-[#FF6A00] bg-[#FF6A00]/10 px-2 py-1 inline-block mt-2">
                    Validation
                  </span>
                </div>

                {/* Title + Description (6 cols) */}
                <div className="col-span-12 md:col-span-6 flex flex-col justify-start">
                  <h3 className="font-display font-semibold text-swiss-md leading-[32px] text-white mb-4">
                    La validation d&apos;entrée &quot;Any&quot; déguisée
                  </h3>
                  <p className="text-swiss-sm text-[#8E8E8A] leading-[24px]">
                    Même si TypeScript compile, les données qui transitent via les formulaires ou le réseau ne sont jamais formellement validées par un schéma au moment de l&apos;exécution, créant des plantages silencieux et impossibles à retracer.
                  </p>
                </div>

                {/* Code + Consequence (4 cols) */}
                <div className="col-span-12 md:col-span-4 flex flex-col gap-4">
                  <div className="bg-white/[0.02] border border-white/10 p-4 font-mono text-swiss-xs text-[#8E8E8A] rounded-none">
                    <div className="text-[#FF6A00]/50 mb-2">{"// Zéro sécurité runtime"}</div>
                    <div><span className="text-[#FF6A00]">const</span> body = <span className="text-white/60">await</span> req.json();</div>
                    <div className="text-[#52524E]">{"// body est implicitement 'any'"}</div>
                    <div><span className="text-white/60">await</span> saveUser(body);</div>
                  </div>
                  <div className="font-mono text-swiss-xs text-red-400 leading-[16px] flex items-start gap-2.5">
                    <span className="w-2 h-2 rounded-none bg-red-500 mt-1 shrink-0" />
                    <span>Risque : Plantages en production &amp; faux sentiment de sécurité.</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* SUB-SECTION 2: PRIMITIVES FONDAMENTALES */}
          <div id="primitives" className="scroll-mt-24 border-t border-white/10 pt-24">
            
            {/* Header block aligned left */}
            <div className="mb-16">
              <span className="font-mono text-swiss-xs text-[#FF6A00] tracking-widest uppercase block mb-4 leading-[16px]">
                ◆ L&apos;ALTERNATIVE STANDARD
              </span>
              <h2 className="font-display font-semibold text-swiss-xl md:text-swiss-xxl text-white tracking-tight leading-[56px] mb-4">
                Primitives fondamentales pour ton <span className="italic font-light text-[#FF6A00]">backend Next.js</span>
              </h2>
              <p className="text-swiss-sm text-[#8E8E8A] leading-[24px] max-w-3xl">
                Conçues pour l&apos;ingénierie moderne, nos primitives standardisent la gestion des erreurs, l&apos;authentification et l&apos;orchestration de vos API. Parce qu&apos;elles ont des signatures de code strictes et hautement prévisibles, vos agents IA (Cursor, Claude, Copilot) écrivent désormais un code backend irréprochable du premier coup.
              </p>
            </div>

            {/* Swiss 12-Column Layout for tabs & showcase */}
            <div className="grid grid-cols-12 gap-y-12 md:gap-x-6 items-start">
              
              {/* Left Selector Panel (4 cols) */}
              <div className="col-span-12 md:col-span-4 flex flex-col gap-6">
                
                <div className="flex flex-col border-l border-white/10">
                  {PRIMITIVE_DETAILS.map((prim) => {
                    const isSelected = activePrimitive === prim.id;
                    return (
                      <button
                        key={prim.id}
                        onClick={() => setActivePrimitive(prim.id)}
                        className={`w-full text-left py-4 px-6 border-l-2 font-mono text-swiss-xs md:text-swiss-sm uppercase tracking-wider transition-all ${
                          isSelected
                            ? 'border-[#FF6A00] bg-[#FF6A00]/5 text-white'
                            : 'border-transparent bg-transparent text-[#8E8E8A] hover:border-white/20 hover:text-white'
                        }`}
                      >
                        {prim.title.split('(')[0]}
                      </button>
                    );
                  })}
                </div>

                {/* Footnote indicating remaining primitives */}
                <div className="pt-6 border-t border-white/10">
                  <Link 
                    id="more-primitives-link"
                    href="/docs" 
                    className="group inline-flex items-center gap-2.5 font-mono text-swiss-xs text-[#FF6A00] hover:text-[#E05D00] transition-colors"
                  >
                    <span>+ 6 autres primitives</span>
                    <span className="group-hover:translate-x-1 transition-transform">→ voir la référence complète</span>
                  </Link>
                </div>

              </div>

              {/* Right Detail Pane (8 cols) */}
              <div className="col-span-12 md:col-span-8 flex flex-col gap-6 border border-white/10 p-8 bg-[#121212]/30 rounded-none relative">
                
                {/* Meta details */}
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <span className="text-swiss-xs font-mono text-[#FF6A00] uppercase tracking-wider">
                    {selectedPrimitive.badge}
                  </span>
                  <span className="font-mono text-swiss-xs text-[#8E8E8A]">
                    PRIMITIVE 0{PRIMITIVE_DETAILS.findIndex(p => p.id === selectedPrimitive.id) + 1}
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-display font-semibold text-swiss-lg md:text-swiss-xl text-white tracking-tight leading-[48px]">
                  {selectedPrimitive.title}
                </h3>

                {/* Description */}
                <p className="text-swiss-sm text-[#8E8E8A] leading-[24px]">
                  {selectedPrimitive.description}
                </p>

                {/* Core Concept Left-Accent Border block */}
                <div className="border-l-2 border-[#FF6A00] pl-6 py-2 text-swiss-xs text-[#FF6A00] font-mono leading-[16px] uppercase tracking-wider">
                  <span className="font-bold mr-2.5">✦ CONCEPT CLÉ :</span>
                  {selectedPrimitive.focus}
                </div>

                {/* Code Container - No rounded corners */}
                <div className="border border-white/10 rounded-none overflow-hidden bg-black/40">
                  <CodeBlock 
                    code={selectedPrimitive.code} 
                    language="typescript" 
                    title={selectedPrimitive.id === 'result' ? 'types.ts' : 'api-route.ts'} 
                  />
                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* CLACK-STYLING GENERATIVE CLI INTERACTIVE SECTION */}
      <section id="interactive-terminal" className="relative w-full border-b border-white/10 bg-[#0B0B0B] py-24 px-6 md:px-12 scroll-mt-20">
        <div className="max-w-7xl mx-auto flex flex-col gap-16 relative z-10">
          
          {/* Header block aligned left */}
          <div>
            <span className="font-mono text-swiss-xs text-[#FF6A00] tracking-widest uppercase block mb-4 leading-[16px]">
              ◆ GESTION GÉNÉRATIVE
            </span>
            <h2 className="font-display font-semibold text-swiss-xl md:text-swiss-xxl text-white tracking-tight leading-[56px] mb-4">
              Un CLI génératif qui écrit des <br />
              <span className="italic font-light text-[#FF6A00]">patterns parfaits</span>
            </h2>
            <p className="text-swiss-sm text-[#8E8E8A] leading-[24px] max-w-3xl">
              Pas de package lourd ou d&apos;abstraction superflue dans vos structures. Le CLI de ServerPatterns génère du code clair, modifiable, et conforme aux meilleures pratiques directement au cœur de votre codebase.
            </p>
          </div>

          <InteractiveTerminal />

        </div>
      </section>

      {/* TARGET AUDIENCE - POUR QUI */}
      <section id="pour-qui" className="relative w-full border-b border-white/10 bg-[#121212]/20 py-24 px-6 md:px-12 scroll-mt-20">
        <div className="max-w-7xl mx-auto flex flex-col gap-16 relative z-10">
          
          {/* Header block aligned left */}
          <div>
            <span className="font-mono text-swiss-xs text-[#FF6A00] tracking-widest uppercase block mb-4 leading-[16px]">
              ◆ PROFIL CIBLE
            </span>
            <h2 className="font-display font-semibold text-swiss-xl md:text-swiss-xxl text-white tracking-tight leading-[56px] mb-4">
              Pour les équipes qui <br />
              <span className="italic font-light text-[#FF6A00]">livrent vite</span>
            </h2>
            <p className="text-swiss-sm text-[#8E8E8A] leading-[24px] max-w-3xl">
              ServerPatterns s&apos;adapte aux exigences des développeurs indépendants comme des équipes d&apos;ingénierie les plus rigoureuses.
            </p>
          </div>

          {/* 12-column layout cards */}
          <div className="grid grid-cols-12 gap-y-8 md:gap-x-6">
            
            {/* Card 1 (6 cols) */}
            <div className="col-span-12 md:col-span-6 border border-white/10 p-8 bg-[#121212]/40 rounded-none relative">
              <span className="font-mono text-swiss-xs text-[#FF6A00] tracking-widest uppercase block mb-6">
                {"// INDIVIDUELS & INDIES"}
              </span>
              <h3 className="font-display font-semibold text-swiss-md leading-[32px] text-white mb-4">
                Livre tes projets en quelques jours
              </h3>
              <p className="text-swiss-sm text-[#8E8E8A] leading-[24px]">
                Ne réinvente pas la roue à chaque nouveau projet client. Lance <code className="font-mono text-swiss-xs text-[#FF6A00]">npx serverpatterns init</code>, crée tes routes d&apos;API, valide avec Zod, et déploie un code irréprochable et auditable dès le premier jour.
              </p>
            </div>

            {/* Card 2 (6 cols) */}
            <div className="col-span-12 md:col-span-6 border border-white/10 p-8 bg-[#121212]/40 rounded-none relative">
              <span className="font-mono text-swiss-xs text-[#FF6A00] tracking-widest uppercase block mb-6">
                {"// AGENCES & ÉQUIPES"}
              </span>
              <h3 className="font-display font-semibold text-swiss-md leading-[32px] text-white mb-4">
                Uniformise l&apos;architecture de tes développeurs
              </h3>
              <p className="text-swiss-sm text-[#8E8E8A] leading-[24px]">
                Finis les débats interminables sur la structure des dossiers API de Next.js, sur la façon de gérer les catch, ou d&apos;écrire les fetch. ServerPatterns impose un style unifié, lisible et performant, réduisant drastiquement le temps de relecture des PRs.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* FINAL CALL TO ACTION */}
      <section id="cta" className="relative w-full py-24 px-6 md:px-12 bg-black border-b border-white/10 animate-[fadeIn_0.5s_ease-out]">
        
        {/* Strictly no background dot/grid pattern here to avoid background clutter as requested */}

        <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-12 gap-y-12 lg:gap-x-12 items-center">
          
          {/* Left Block (7 cols) */}
          <div className="col-span-12 lg:col-span-7 flex flex-col items-start text-left">
            
            <div className="flex items-center gap-2 mb-6">
              <Sparkles size={16} className="text-[#FF6A00]" />
              <span className="font-mono text-swiss-xs text-[#FF6A00] tracking-widest uppercase font-bold leading-[16px]">
                ◆ LIVRAISON INITIALE DISPONIBLE
              </span>
            </div>

            <h2 className="font-display text-swiss-xl md:text-swiss-xxl font-semibold tracking-tight text-white leading-[56px] mb-6">
              Prêt à imposer <br />
              <span className="italic font-light text-[#FF6A00]">l&apos;ordre parfait</span> ?
            </h2>

            <p className="text-swiss-sm text-[#8E8E8A] leading-[24px] max-w-xl mb-10">
              Libère-toi de la redondance d&apos;API. Laisse le CLI ServerPatterns structurer tes Route Handlers, tes validations et tes types en quelques secondes.
            </p>

            <div className="flex flex-wrap items-center gap-x-8 gap-y-4 text-swiss-xs font-mono text-[#8E8E8A]">
              <a 
                id="final-github"
                href="https://github.com/handcode0-create/serverpatterns" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-white flex items-center gap-2 transition-colors"
              >
                <Github size={14} />
                <span>GitHub v0.1.0</span>
              </a>
              <span className="text-white/10 hidden sm:inline">|</span>
              <a 
                id="final-studio"
                href="https://handcode.site" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-white flex items-center gap-1.5 transition-colors"
              >
                <span>HANCODE STUDIO</span>
                <ExternalLink size={12} />
              </a>
            </div>

          </div>

          {/* Right Block (5 cols) */}
          <div className="col-span-12 lg:col-span-5 w-full">
            <div className="border border-white/10 bg-[#121212]/30 p-1 rounded-none">
              <PackageManagerTabs
                pnpm="pnpm add @serverpatterns/core @serverpatterns/next"
                npm="npm install @serverpatterns/core @serverpatterns/next"
                yarn="yarn add @serverpatterns/core @serverpatterns/next"
                bun="bun add @serverpatterns/core @serverpatterns/next"
              />
            </div>
          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#0B0B0B] border-t border-white/10 py-16 px-6 md:px-12 text-swiss-xs font-mono text-[#52524E]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-8">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
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
