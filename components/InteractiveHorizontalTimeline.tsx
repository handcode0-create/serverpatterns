'use client';

import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { 
  Layers, 
  Network, 
  Webhook, 
  Lock, 
  ChevronRight, 
  Check, 
  Sparkles,
  Terminal,
  Cpu,
  ArrowRight
} from 'lucide-react';
import CodeBlock from './CodeBlock';
import Link from 'next/link';

interface TimelineItem {
  id: string;
  quarter: string;
  step: string;
  title: string;
  badge: string;
  icon: React.ReactNode;
  focus: string;
  description: string;
  code: string;
  gradient: string;
  glow: string;
}

export default function InteractiveHorizontalTimeline() {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const colRefs = useRef<(HTMLDivElement | null)[]>([]);
  const detailRefs = useRef<(HTMLDivElement | null)[]>([]);
  const inactiveRefs = useRef<(HTMLDivElement | null)[]>([]);
  const nodeRefs = useRef<(HTMLDivElement | null)[]>([]);

  const items: TimelineItem[] = [
    {
      id: 'result',
      quarter: 'Q1: Standardiser',
      step: '01',
      title: 'Result<T, E>',
      badge: 'MONADE D\'ERREUR',
      icon: <Layers size={20} />,
      focus: 'Plus de try/catch désordonnés. Un contrat de retour explicite pour que votre IA sache exactement quoi faire en cas de succès ou d\'échec.',
      description: 'Déclarez des fonctions pures et totalement prévisibles. Le type de retour force l\'appelant à traiter explicitement l\'erreur avant d\'accéder à la valeur, créant un cadre de développement ultra-robuste et auto-documenté.',
      code: `import { Result, ok, err } from '@serverpatterns/core';

// Signature propre, pas d'erreurs jetées au hasard
function divide(a: number, b: number): Result<number, Error> {
  return b === 0 
    ? err(new Error("Division par zéro impossible")) 
    : ok(a / b);
}`,
      gradient: 'from-[#FF6A00] via-[#E24E1B] to-[#7A00FF]',
      glow: 'shadow-[0_0_25px_rgba(255,106,0,0.5)] bg-[#FF6A00]'
    },
    {
      id: 'api-client',
      quarter: 'Q2: Orchestrer',
      step: '02',
      title: 'createApiClient()',
      badge: 'CLIENT HTTP TYPÉ',
      icon: <Network size={20} />,
      focus: 'Centralisation absolue des appels API externes. Donnez à votre agent IA un schéma de requête immuable.',
      description: 'Unifiez votre couche réseau. Centralisez l\'injection de tokens d\'accès, gérez les redirections globales de session, et récupérez des objets Result robustes pour chaque requête de votre application sans pollution try/catch.',
      code: `import { createApiClient } from '@serverpatterns/core';

const api = createApiClient({ baseUrl: '/api/v1' });

// L'IA comprend instantanément le type de retour
const res = await api.get<User>('/me');
if (res.isErr()) {
  console.error("Erreur récupérée :", res.error);
} else {
  renderUser(res.value);
}`,
      gradient: 'from-[#7A00FF] via-[#5F00F5] to-[#FF00AA]',
      glow: 'shadow-[0_0_25px_rgba(122,0,255,0.5)] bg-[#7A00FF]'
    },
    {
      id: 'webhook',
      quarter: 'Q3: Sécuriser',
      step: '03',
      title: 'createWebhookHandler()',
      badge: 'SÉCURITÉ EDGE-READY',
      icon: <Webhook size={20} />,
      focus: 'La réception de webhooks Stripe ou Wave à l\'abri des injections et des bugs de signature, prête à l\'emploi.',
      description: 'La validation cryptographique simplifiée à l\'extrême. Ce wrapper récupère le raw-body exact et valide les signatures HMAC (Stripe, Lemon Squeezy, GitHub) avec une compatibilité totale Edge Runtime et un traitement unifié.',
      code: `import { createWebhookHandler } from '@serverpatterns/next';

export const POST = createWebhookHandler({
  signatureHeader: 'stripe-signature',
  secret: () => process.env.STRIPE_SECRET!,
  verify: async (rawBody, signature, secret) => {
    return await verifyHmacSha256(rawBody, signature, secret);
  },
  handler: async ({ body }) => {
    await processOrder(body);
    return { status: 200, body: { received: true } };
  }
});`,
      gradient: 'from-[#FF00AA] via-[#D6007A] to-[#FF6A00]',
      glow: 'shadow-[0_0_25px_rgba(255,0,170,0.5)] bg-[#FF00AA]'
    },
    {
      id: 'auth',
      quarter: 'Q4: Verrouiller',
      step: '04',
      title: 'withAuth()',
      badge: 'MIDDLEWARE D\'ACCÈS',
      icon: <Lock size={20} />,
      focus: 'Middleware d\'authentification et de rôles (RBAC) pour blinder vos Server Actions avant que l\'IA ne génère la logique métier.',
      description: 'Sécurisez vos Server Actions et Route Handlers de manière déclarative. Validez les privilèges (RBAC/ABAC) en amont grâce à des gardes de rôles robustes avant même que votre logique métier ne démarre.',
      code: `import { withAuth } from '@serverpatterns/next';

export const deleteProject = withAuth({
  roles: ['admin'],
  authorize: async (user, input) => {
    return user.id !== input.ownerId; // Garde ABAC
  }
}, async ({ input }) => {
  return await db.delete(input.projectId);
});`,
      gradient: 'from-[#FF6A00] via-[#E24E1B] to-[#7A00FF]',
      glow: 'shadow-[0_0_25px_rgba(255,106,0,0.5)] bg-[#FF6A00]'
    }
  ];

  useEffect(() => {
    // GSAP Responsive animations
    const isMobile = window.innerWidth < 768;

    colRefs.current.forEach((col, idx) => {
      if (!col) return;
      const isHovered = hoveredIdx === idx;
      const isNoneHovered = hoveredIdx === null;

      if (isMobile) {
        // Mobile simple height/opacity adjustments
        gsap.to(col, {
          height: isNoneHovered ? 'auto' : isHovered ? 'auto' : '100px',
          duration: 0.4,
          ease: 'power2.out',
          overwrite: 'auto'
        });

        if (detailRefs.current[idx]) {
          gsap.to(detailRefs.current[idx], {
            opacity: isNoneHovered || isHovered ? 1 : 0,
            y: 0,
            height: isNoneHovered || isHovered ? 'auto' : 0,
            display: isNoneHovered || isHovered ? 'block' : 'none',
            duration: 0.4,
            ease: 'power2.out',
            overwrite: 'auto'
          });
        }

        if (inactiveRefs.current[idx]) {
          gsap.to(inactiveRefs.current[idx], {
            opacity: isNoneHovered ? 1 : isHovered ? 1 : 0.4,
            duration: 0.3,
            ease: 'power2.out',
            overwrite: 'auto'
          });
        }

        if (nodeRefs.current[idx]) {
          gsap.to(nodeRefs.current[idx], {
            scale: isHovered ? 1.3 : 1,
            backgroundColor: isHovered ? '#FF6A00' : '#262626',
            borderColor: isHovered ? '#FF9E66' : '#404040',
            duration: 0.3,
            ease: 'back.out(1.7)'
          });
        }
      } else {
        // Desktop premium horizontal accordion
        if (isNoneHovered) {
          gsap.to(col, { flexGrow: 1, duration: 0.5, ease: 'power3.out', overwrite: 'auto' });
          if (detailRefs.current[idx]) {
            gsap.to(detailRefs.current[idx], { opacity: 0, y: 15, display: 'none', duration: 0.3, ease: 'power2.out', overwrite: 'auto' });
          }
          if (inactiveRefs.current[idx]) {
            gsap.to(inactiveRefs.current[idx], { opacity: 1, y: 0, display: 'block', duration: 0.3, ease: 'power2.out', overwrite: 'auto' });
          }
          if (nodeRefs.current[idx]) {
            gsap.to(nodeRefs.current[idx], { scale: 1, backgroundColor: '#1A1A1A', borderColor: '#404040', duration: 0.3, ease: 'power2.out' });
          }
        } else if (isHovered) {
          gsap.to(col, { flexGrow: 2.8, duration: 0.6, ease: 'power3.out', overwrite: 'auto' });
          if (detailRefs.current[idx]) {
            gsap.to(detailRefs.current[idx], { opacity: 1, y: 0, display: 'block', duration: 0.4, ease: 'power3.out', delay: 0.05, overwrite: 'auto' });
          }
          if (inactiveRefs.current[idx]) {
            gsap.to(inactiveRefs.current[idx], { opacity: 0, y: -10, display: 'none', duration: 0.2, ease: 'power2.out', overwrite: 'auto' });
          }
          if (nodeRefs.current[idx]) {
            gsap.to(nodeRefs.current[idx], { scale: 1.5, backgroundColor: '#FF6A00', borderColor: '#FFFFFF', duration: 0.4, ease: 'back.out(2)' });
          }
        } else {
          gsap.to(col, { flexGrow: 0.4, duration: 0.6, ease: 'power3.out', overwrite: 'auto' });
          if (detailRefs.current[idx]) {
            gsap.to(detailRefs.current[idx], { opacity: 0, y: 15, display: 'none', duration: 0.2, ease: 'power2.out', overwrite: 'auto' });
          }
          if (inactiveRefs.current[idx]) {
            gsap.to(inactiveRefs.current[idx], { opacity: 0.3, y: 0, display: 'block', duration: 0.3, ease: 'power2.out', overwrite: 'auto' });
          }
          if (nodeRefs.current[idx]) {
            gsap.to(nodeRefs.current[idx], { scale: 0.8, backgroundColor: '#101010', borderColor: '#222222', duration: 0.4, ease: 'power2.out' });
          }
        }
      }
    });
  }, [hoveredIdx]);

  return (
    <div 
      ref={containerRef} 
      className="relative w-full overflow-hidden bg-black py-12 md:py-20 select-none"
    >
      
      {/* TIMELINE BACKGROUND LINE */}
      {/* Desktop line */}
      <div className="hidden md:block absolute top-[180px] left-[5%] right-[5%] h-[1px] bg-white/10 z-0" />
      
      {/* Mobile line */}
      <div className="block md:hidden absolute left-9 top-12 bottom-12 w-[1px] bg-white/10 z-0" />

      {/* HORIZONTAL / VERTICAL ACCORDION CONTAINER */}
      <div className="flex flex-col md:flex-row gap-6 md:gap-4 items-stretch min-h-[580px] w-full max-w-7xl mx-auto px-4 relative z-10">
        {items.map((item, idx) => {
          const isCurrentlyActive = hoveredIdx === idx;
          const isNoneActive = hoveredIdx === null;

          return (
            <div
              key={item.id}
              ref={(el) => { colRefs.current[idx] = el; }}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
              className={`relative flex-1 rounded-3xl border transition-all duration-300 overflow-hidden cursor-pointer flex flex-col justify-between p-6 md:p-8 ${
                isCurrentlyActive 
                  ? 'border-white/20 bg-gradient-to-br bg-black/60 shadow-[0_20px_50px_rgba(255,106,0,0.08)]' 
                  : 'border-white/5 bg-[#0C0C0C] hover:border-white/10'
              }`}
            >
              {/* Top border glow wrapper */}
              {isCurrentlyActive && (
                <div className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r ${item.gradient} animate-pulse`} />
              )}

              {/* TIMELINE NODE ACCENT (Fixed position for aligning with background line) */}
              {/* Desktop positioning */}
              <div className="hidden md:flex absolute top-[164px] left-1/2 -translate-x-1/2 justify-center items-center z-10">
                <div 
                  ref={(el) => { nodeRefs.current[idx] = el; }}
                  className={`w-8 h-8 rounded-full border-2 bg-[#1A1A1A] border-[#404040] transition-all flex items-center justify-center ${
                    isCurrentlyActive ? item.glow : ''
                  }`}
                >
                  <div className={`w-2.5 h-2.5 rounded-full ${isCurrentlyActive ? 'bg-white' : 'bg-transparent'}`} />
                </div>
              </div>

              {/* Mobile positioning */}
              <div className="md:hidden absolute left-[21px] top-7 z-10 flex items-center justify-center">
                <div 
                  ref={(el) => { nodeRefs.current[idx] = el; }}
                  className="w-7 h-7 rounded-full border-2 bg-[#262626] border-[#404040] transition-all flex items-center justify-center"
                >
                  <div className={`w-2 h-2 rounded-full ${isCurrentlyActive ? 'bg-white' : 'bg-transparent'}`} />
                </div>
              </div>

              {/* TOP HEADER */}
              <div className="flex justify-between items-start mb-12 md:mb-20 pl-10 md:pl-0">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono font-bold tracking-widest text-[#FF6A00] uppercase block">
                    {item.quarter}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="font-display text-2xl md:text-3xl font-black text-white">
                      {item.title}
                    </span>
                  </div>
                </div>
                <span className="text-3xl md:text-4xl font-mono font-black text-white/5 select-none tracking-tighter">
                  {item.step}
                </span>
              </div>

              {/* CENTER AREA (MIDDLE STAGE OF TIMELINE) */}
              <div className="my-auto pl-10 md:pl-0">
                {/* 1. STATE: INACTIVE REVEAL */}
                <div 
                  ref={(el) => { inactiveRefs.current[idx] = el; }}
                  className="space-y-4 md:absolute md:bottom-12 md:left-8 md:right-8"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/[0.03] border border-white/5 rounded-xl text-[#8E8E8A]">
                      {item.icon}
                    </div>
                    <span className="text-xs font-mono tracking-widest text-[#8E8E8A] uppercase">
                      {item.badge}
                    </span>
                  </div>
                  <p className="text-xs text-[#52524E] line-clamp-2 md:line-clamp-1 leading-relaxed">
                    {item.focus}
                  </p>
                </div>

                {/* 2. STATE: ACTIVE DETAIL REVEAL */}
                <div 
                  ref={(el) => { detailRefs.current[idx] = el; }}
                  className="hidden space-y-6"
                >
                  <div className="flex items-center gap-2">
                    <div className={`p-2 bg-gradient-to-r ${item.gradient} text-black rounded-xl shadow-lg`}>
                      {item.icon}
                    </div>
                    <span className="text-[10px] font-mono tracking-widest text-white uppercase font-bold bg-white/5 px-2.5 py-1 rounded-md border border-white/10">
                      {item.badge}
                    </span>
                  </div>

                  {/* Highlight text */}
                  <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 text-white/90 text-sm md:text-base leading-relaxed font-light">
                    <div className="flex items-center gap-1.5 text-[10px] font-mono font-semibold text-[#FF6A00] uppercase mb-1.5">
                      <Sparkles size={12} className="animate-pulse text-[#FF6A00]" />
                      <span>Focus Intelligence Artificielle</span>
                    </div>
                    {item.focus}
                  </div>

                  {/* Expanded Description */}
                  <p className="text-xs text-[#8E8E8A] leading-relaxed">
                    {item.description}
                  </p>

                  {/* Code Block Snippet inside the expanded pane */}
                  <div className="mt-4 border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
                    <CodeBlock 
                      code={item.code}
                      title={`${item.id}.ts`}
                    />
                  </div>
                </div>
              </div>

              {/* BOTTOM INDICATOR */}
              <div className="mt-8 border-t border-white/5 pt-4 flex items-center justify-between text-[10px] font-mono text-[#52524E] pl-10 md:pl-0">
                <span>SERVERPATTERNS v0.1.0</span>
                <Link 
                  href={`/docs/primitives/${item.id}`}
                  className="flex items-center gap-1 text-[#FF6A00] hover:text-white transition cursor-pointer z-20"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <span className="text-[9px] uppercase tracking-wider font-semibold">DÉTAILS</span>
                  <ChevronRight size={12} />
                </Link>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
