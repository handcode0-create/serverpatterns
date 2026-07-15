'use client';

import React, {useEffect, useRef, useState} from 'react';
import gsap from 'gsap';
import {ArrowRight, AlertCircle, Sparkles, CheckCircle2} from 'lucide-react';
import CodeBlock from './CodeBlock';

export default function ChaosAnimation() {
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const chaos1Ref = useRef<HTMLDivElement>(null);
  const chaos2Ref = useRef<HTMLDivElement>(null);
  const chaos3Ref = useRef<HTMLDivElement>(null);
  const cleanRef = useRef<HTMLDivElement>(null);
  const gridLinesRef = useRef<HTMLDivElement>(null);
  
  const [progress, setProgress] = useState(0);

  // Fallback / manual intersection logic + scroll listener to calculate progress
  // directly. This is extremely robust and avoids any version or mismatch conflicts with ScrollTrigger in Next.js SSR.
  useEffect(() => {
    const handleScroll = () => {
      if (!triggerRef.current) return;
      
      const rect = triggerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Calculate how far the trigger element is through the viewport
      // Start animating when the top enters 90% of screen height
      // End animating when the bottom is at 10% of screen height
      const start = windowHeight * 0.95;
      const end = windowHeight * 0.15;
      
      const totalDist = start - end;
      const currentPos = rect.top - end;
      
      let p = 1 - (currentPos / totalDist);
      p = Math.max(0, Math.min(1, p));
      
      setProgress(p);
    };

    window.addEventListener('scroll', handleScroll, {passive: true});
    window.addEventListener('resize', handleScroll);
    
    // Initial call
    setTimeout(handleScroll, 100);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  // Use GSAP to animate components based on the scroll progress
  useEffect(() => {
    if (!chaos1Ref.current || !chaos2Ref.current || !chaos3Ref.current || !cleanRef.current || !gridLinesRef.current) return;

    // We interpolate GSAP properties based on progress (0 to 1)
    // Progress 0: Max chaos
    // Progress 1: Pure clean order
    
    // Smooth progress with easing (quadratic in-out)
    const easedP = progress < 0.5 
      ? 2 * progress * progress 
      : 1 - Math.pow(-2 * progress + 2, 2) / 2;

    // Grid opacity: starts faint, becomes slightly more prominent during transition, then fades out in pure order
    const gridOpacity = easedP < 0.5 ? 0.08 + easedP * 0.24 : 0.2 - (easedP - 0.5) * 0.4;
    gsap.to(gridLinesRef.current, {
      opacity: Math.max(0.02, gridOpacity),
      duration: 0.1,
      overwrite: 'auto'
    });

    // Chaos block 1: Top-Left, manual fetch
    // Collapses to center, rotates to 0, fades out and blurs
    gsap.to(chaos1Ref.current, {
      x: gsap.utils.interpolate(-40, 0, easedP) + '%',
      y: gsap.utils.interpolate(-20, 0, easedP) + '%',
      rotation: gsap.utils.interpolate(-4, 0, easedP),
      opacity: 1 - easedP,
      filter: `blur(${easedP * 16}px)`,
      pointerEvents: easedP > 0.8 ? 'none' : 'auto',
      scale: gsap.utils.interpolate(1, 0.9, easedP),
      duration: 0.1,
      overwrite: 'auto'
    });

    // Chaos block 2: Center-Right, alert-styled API crash
    // Collapses to center, rotates to 0, fades out and blurs
    gsap.to(chaos2Ref.current, {
      x: gsap.utils.interpolate(40, 0, easedP) + '%',
      y: gsap.utils.interpolate(10, 0, easedP) + '%',
      rotation: gsap.utils.interpolate(3.5, 0, easedP),
      opacity: 1 - easedP,
      filter: `blur(${easedP * 16}px)`,
      pointerEvents: easedP > 0.8 ? 'none' : 'auto',
      scale: gsap.utils.interpolate(1, 0.85, easedP),
      duration: 0.1,
      overwrite: 'auto'
    });

    // Chaos block 3: Bottom-Left, silent try-catch block
    // Collapses to center, rotates to 0, fades out and blurs
    gsap.to(chaos3Ref.current, {
      x: gsap.utils.interpolate(-30, 0, easedP) + '%',
      y: gsap.utils.interpolate(30, 0, easedP) + '%',
      rotation: gsap.utils.interpolate(-2.5, 0, easedP),
      opacity: 1 - easedP,
      filter: `blur(${easedP * 16}px)`,
      pointerEvents: easedP > 0.8 ? 'none' : 'auto',
      scale: gsap.utils.interpolate(1, 0.9, easedP),
      duration: 0.1,
      overwrite: 'auto'
    });

    // Clean block: The unified, perfect pattern block
    // Fades in, sharpens, scales up to perfect layout
    gsap.to(cleanRef.current, {
      opacity: easedP,
      filter: `blur(${(1 - easedP) * 12}px)`,
      scale: gsap.utils.interpolate(0.9, 1, easedP),
      y: gsap.utils.interpolate(40, 0, easedP),
      pointerEvents: easedP < 0.2 ? 'none' : 'auto',
      duration: 0.1,
      overwrite: 'auto'
    });

  }, [progress]);

  const rawFetchCode1 = `// user-profile.tsx (Composant Client)
const [user, setUser] = useState(null);
const [err, setErr] = useState(null);

useEffect(() => {
  // Fetch manuel, dupliqué, sans typage ni gestion globale
  fetch('/api/user/profile', {
    headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
  })
  .then(res => {
    if (!res.ok) throw new Error('Failed: ' + res.status);
    return res.json();
  })
  .then(data => setUser(data))
  .catch(e => {
    setErr(e.message);
    console.error('Crash user-profile fetch', e);
  });
}, []);`;

  const rawFetchCode2 = `// create-post-handler.ts (Route API Next.js)
// Validation manuelle désordonnée
export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body.title || body.title.length < 5) {
      return NextResponse.json({ error: "Title too short" }, { status: 400 });
    }
    // Pas de typage, duplication de la connexion DB, aucun catch générique
    const post = await db.insert(body);
    return NextResponse.json(post);
  } catch (error) {
    // Fuite d'informations sensibles possible dans la réponse
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}`;

  const rawFetchCode3 = `// fetch-with-retry.ts (Fichier d'utilitaires maison qui enfle)
export async function fetchWithRetry(url: string, opts: any) {
  // 150 lignes d'utilitaires instables réinventant la roue
  // pour gérer les headers, les timeouts, les rafraîchissements
  // de tokens, et les cas d'erreur réseau incohérents...
  // Bientôt obsolète et impossible à maintenir.
}`;

  const cleanServerPatternsCode = `// lib/api.ts (Fichier unifié)
import { createApiClient } from '@serverpatterns/core';

// Un seul client HTTP hautement typé, résilient, standardisé
export const api = createApiClient({
  baseUrl: '/api',
  headers: () => ({
    Authorization: \`Bearer \${localStorage.getItem('token')}\`
  })
});

// usage.tsx (Retour typé Result sécurisé)
const result = await api.get<User>('/user/profile');

if (result.isErr()) {
  return <ErrorState message={result.error.message} />;
}

const user = result.value; // Garanti typé et valide !`;

  return (
    <section 
      id="moment-signature" 
      ref={triggerRef}
      className="relative min-h-[110vh] flex flex-col items-center justify-center py-20 px-4 overflow-hidden border-b border-white/5 bg-[#0B0B0B]"
    >
      {/* Background Alignment Dotted Grid */}
      <div 
        ref={gridLinesRef}
        className="absolute inset-0 z-0 pointer-events-none transition-opacity duration-300"
        style={{
          backgroundImage: `
            radial-gradient(circle at 1px 1px, rgba(255,106,0,0.15) 1px, transparent 0),
            linear-gradient(to right, rgba(255,106,0,0.02) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,106,0,0.02) 1px, transparent 1px)
          `,
          backgroundSize: '32px 32px, 96px 96px, 96px 96px',
          opacity: 0.08
        }}
      />

      {/* Decorative Plus Signs (Anchor Points) */}
      <div className="absolute top-1/4 left-10 md:left-20 text-white/10 font-mono text-xl pointer-events-none">+</div>
      <div className="absolute bottom-1/4 right-10 md:right-20 text-[#FF6A00]/20 font-mono text-xl pointer-events-none">+</div>
      <div className="absolute top-1/3 right-1/4 text-[#FF6A00]/10 font-mono text-lg pointer-events-none">+</div>
      <div className="absolute bottom-1/3 left-1/4 text-white/5 font-mono text-lg pointer-events-none">+</div>

      <div className="max-w-6xl w-full mx-auto relative z-10 flex flex-col items-center">
        
        {/* Scroll Status Header */}
        <div className="flex items-center gap-3 mb-8 bg-white/5 border border-white/10 px-4 py-1.5 rounded-full text-xs font-mono text-[#8E8E8A] shadow-inner">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF6A00] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF6A00]"></span>
          </span>
          <span>ANALYSE DE LA COUCHE SERVEUR</span>
          <span className="text-[#FF6A00]/60">|</span>
          <span className="text-white font-medium">{Math.round(progress * 100)}% CONVERGENCE</span>
        </div>

        {/* Dynamic Titles */}
        <div className="text-center max-w-2xl mb-16 px-4">
          <h2 className="font-display font-medium text-3xl md:text-5xl tracking-tight leading-tight text-white mb-4">
            {progress < 0.4 ? (
              <>
                Le coût invisible de la <span className="italic text-[#FF6A00] font-light">duplication</span>
              </>
            ) : progress < 0.85 ? (
              <>
                Unification de la <span className="text-[#FF6A00] font-semibold">complexité...</span>
              </>
            ) : (
              <>
                L&apos;ordre parfait de <span className="italic text-[#FF6A00] font-light">ServerPatterns</span>
              </>
            )}
          </h2>
          <p className="text-sm md:text-base text-[#8E8E8A] leading-relaxed">
            {progress < 0.5 ? (
              "Scroller pour assembler vos requêtes éparpillées en un seul client unifié et typé de bout en bout."
            ) : (
              "La redondance s'efface. La validation Zod, le typage strict des erreurs, et le client API fusionnent."
            )}
          </p>
        </div>

        {/* Animation Stage */}
        <div className="relative w-full max-w-4xl h-[520px] md:h-[600px] flex items-center justify-center px-2 md:px-6">
          
          {/* ================= CHAOTIC STATE (BEFORE) ================= */}
          
          {/* Chaos Block 1: client-side fetch profile */}
          <div 
            ref={chaos1Ref}
            className="absolute top-4 left-0 md:left-4 w-full max-w-[420px] z-20 group transition-shadow hover:shadow-2xl hover:shadow-[#FF6A00]/5"
          >
            <div className="bg-red-500/5 border border-red-500/10 text-red-400 text-[10px] font-mono px-3 py-1.5 rounded-t-xl flex items-center gap-2">
              <AlertCircle size={12} className="text-red-400" />
              <span>DANGER: Requête manuelle non sécurisée sans catch-all</span>
            </div>
            <CodeBlock 
              code={rawFetchCode1} 
              title="user-profile.tsx (FETCH DUPLIQUÉ)" 
              className="rounded-t-none border-red-500/10 opacity-90"
            />
          </div>

          {/* Chaos Block 2: manual API route */}
          <div 
            ref={chaos2Ref}
            className="absolute top-1/4 right-0 md:right-4 w-full max-w-[430px] z-10 group transition-shadow hover:shadow-2xl hover:shadow-[#FF6A00]/5"
          >
            <div className="bg-yellow-500/5 border border-yellow-500/10 text-yellow-400 text-[10px] font-mono px-3 py-1.5 rounded-t-xl flex items-center gap-2">
              <AlertCircle size={12} className="text-yellow-400" />
              <span>DANGER: Zod non standardisé + fuite d&apos;erreurs</span>
            </div>
            <CodeBlock 
              code={rawFetchCode2} 
              title="route.ts (VALIDATION MANUELLE)" 
              className="rounded-t-none border-yellow-500/10 opacity-90"
            />
          </div>

          {/* Chaos Block 3: generic utils bloat */}
          <div 
            ref={chaos3Ref}
            className="absolute bottom-4 left-6 md:left-12 w-full max-w-[380px] z-10 group transition-shadow hover:shadow-2xl hover:shadow-[#FF6A00]/5"
          >
            <div className="bg-orange-500/5 border border-orange-500/10 text-orange-400 text-[10px] font-mono px-3 py-1.5 rounded-t-xl flex items-center gap-2">
              <AlertCircle size={12} className="text-orange-400" />
              <span>DANGER: Redondance - 150 lignes de code utilitaire</span>
            </div>
            <CodeBlock 
              code={rawFetchCode3} 
              title="fetch-with-retry.ts (MAINTENANCE LOURDE)" 
              className="rounded-t-none border-orange-500/10 opacity-85"
            />
          </div>

          {/* ================= ORDERED STATE (AFTER) ================= */}
          <div 
            ref={cleanRef}
            className="absolute inset-0 flex items-center justify-center z-30 w-full"
            style={{ opacity: 0, pointerEvents: 'none' }}
          >
            <div className="w-full max-w-2xl relative">
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-[#FF6A00]/20 to-[#FFA366]/20 opacity-30 blur-xl pointer-events-none" />
              <div className="relative bg-black/90 rounded-2xl border-2 border-[#FF6A00]/30 shadow-2xl overflow-hidden">
                <div className="bg-[#FF6A00]/10 border-b border-[#FF6A00]/20 text-[#FF6A00] text-[11px] font-mono px-4 py-2.5 flex items-center justify-between">
                  <span className="flex items-center gap-2 font-semibold tracking-wider">
                    <CheckCircle2 size={13} className="text-[#FF6A00] animate-pulse" />
                    SOLUTION UNIFIÉE SERVERPATTERNS — CONVERGENT
                  </span>
                  <span className="text-[10px] bg-[#FF6A00]/20 text-[#FF6A00] px-2 py-0.5 rounded font-bold">STRICT & TYPÉ</span>
                </div>
                <CodeBlock 
                  code={cleanServerPatternsCode} 
                  title="lib/api.ts (STANDARD D'ARCHITECTURE)" 
                  className="border-0 rounded-t-none bg-black/40"
                />
              </div>
            </div>
          </div>

        </div>

        {/* Scroll Progress Indicator Bar */}
        <div className="mt-12 w-full max-w-lg flex flex-col items-center gap-2 px-4">
          <div className="w-full bg-[#1A1A1A] h-[2px] rounded-full overflow-hidden relative">
            <div 
              className="bg-gradient-to-r from-[#FF6A00] to-[#FFA366] h-full transition-all duration-75"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
          <div className="flex justify-between w-full text-[11px] font-mono text-[#52524E]">
            <span>LE CHAOS COURANT (0%)</span>
            <span className="text-[#FF6A00]">{progress > 0.85 ? 'CONVERGÉ (100%)' : 'SCROLLER POUR ALIGNER'}</span>
            <span>L&apos;ORDRE SERVERPATTERNS (100%)</span>
          </div>
        </div>

      </div>
    </section>
  );
}
