'use client';

import React, {useState, useEffect, useRef} from 'react';
import {Terminal, Play, RotateCcw, ChevronRight, FileText, Check} from 'lucide-react';
import CodeBlock from './CodeBlock';

type CommandType = 'init' | 'add-api' | 'add-action';

export default function InteractiveTerminal() {
  const [activeCommand, setActiveCommand] = useState<CommandType>('init');
  const [step, setStep] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [terminalLines, setTerminalLines] = useState<string[]>([]);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [activeGeneratedTab, setActiveGeneratedTab] = useState<string>('');

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const resetSimulation = (commandOverride?: CommandType) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setIsRunning(false);
    setStep(0);
    setSelectedOption(null);
    setTerminalLines([]);
    
    const cmd = commandOverride || activeCommand;
    // Set default generated tab for each command
    if (cmd === 'init') {
      setActiveGeneratedTab('/lib/api.ts');
    } else if (cmd === 'add-api') {
      setActiveGeneratedTab('/app/api/user/route.ts');
    } else {
      setActiveGeneratedTab('/app/actions/post.ts');
    }
  };

  const changeCommand = (cmd: CommandType) => {
    setActiveCommand(cmd);
    resetSimulation(cmd);
  };

  const startSimulation = () => {
    if (isRunning) return;
    setIsRunning(true);
    setStep(0);
    setTerminalLines([]);
    runSimulationStep(0);
  };

  const runSimulationStep = (currentStep: number) => {
    setStep(currentStep);

    let delay = 1000;

    if (activeCommand === 'init') {
      switch (currentStep) {
        case 0: // Command execution
          setTerminalLines(['$ npx serverpatterns init']);
          delay = 800;
          break;
        case 1: // Clack header
          setTerminalLines(prev => [
            ...prev,
            ' ',
            ' \x1b[38;2;255;106;0m│\x1b[0m  \x1b[1mServerPatterns (v0.1.0)\x1b[0m',
            ' \x1b[38;2;255;106;0m│\x1b[0m'
          ]);
          delay = 700;
          break;
        case 2: // Prompt 1
          setTerminalLines(prev => [
            ...prev,
            ' \x1b[38;2;255;106;0m◇\x1b[0m  Où se situe ton dossier source ?',
            ' \x1b[38;2;255;106;0m│\x1b[0m  \x1b[38;2;255;106;0m●\x1b[0m ./app \x1b[30;1m(Next.js App Router)\x1b[0m',
            ' \x1b[38;2;255;106;0m│\x1b[0m  \x1b[30;1m○ ./src/app\x1b[0m',
            ' \x1b[38;2;255;106;0m│\x1b[0m  \x1b[30;1m○ ./src\x1b[0m'
          ]);
          delay = 1200;
          break;
        case 3: // Answer 1 select
          setTerminalLines(prev => [
            prev[0], prev[1], prev[2], prev[3],
            ' \x1b[38;2;255;106;0m◇\x1b[0m  Où se situe ton dossier source ?',
            ' \x1b[38;2;255;106;0m│\x1b[0m  \x1b[32m✔\x1b[0m \x1b[1m./app\x1b[0m \x1b[30;1m(Next.js App Router)\x1b[0m',
            ' \x1b[38;2;255;106;0m│\x1b[0m'
          ]);
          delay = 600;
          break;
        case 4: // Prompt 2
          setTerminalLines(prev => [
            ...prev,
            ' \x1b[38;2;255;106;0m◇\x1b[0m  Quel package manager utilises-tu ?',
            ' \x1b[38;2;255;106;0m│\x1b[0m  \x1b[30;1m○ npm\x1b[0m',
            ' \x1b[38;2;255;106;0m│\x1b[0m  \x1b[38;2;255;106;0m●\x1b[0m pnpm',
            ' \x1b[38;2;255;106;0m│\x1b[0m  \x1b[30;1m○ yarn\x1b[0m',
            ' \x1b[38;2;255;106;0m│\x1b[0m  \x1b[30;1m○ bun\x1b[0m'
          ]);
          delay = 1000;
          break;
        case 5: // Answer 2 select
          setTerminalLines(prev => [
            ...prev.slice(0, 7),
            ' \x1b[38;2;255;106;0m◇\x1b[0m  Quel package manager utilises-tu ?',
            ' \x1b[38;2;255;106;0m│\x1b[0m  \x1b[32m✔\x1b[0m \x1b[1mpnpm\x1b[0m',
            ' \x1b[38;2;255;106;0m│\x1b[0m'
          ]);
          delay = 600;
          break;
        case 6: // Setup / Progress Spinner
          setTerminalLines(prev => [
            ...prev,
            ' \x1b[38;2;255;106;0m◼\x1b[0m  Initialisation en cours... [pnpm add @serverpatterns/core]',
            ' \x1b[38;2;255;106;0m│\x1b[0m'
          ]);
          delay = 1500;
          break;
        case 7: // Generating files
          setTerminalLines(prev => [
            ...prev.slice(0, 11),
            ' \x1b[38;2;255;106;0m▲\x1b[0m  Configuration de la structure ServerPatterns :',
            ' \x1b[38;2;255;106;0m│\x1b[0m  \x1b[32m✔\x1b[0m Créé \x1b[36m/lib/api.ts\x1b[0m \x1b[30;1m(Client API de référence)\x1b[0m',
            ' \x1b[38;2;255;106;0m│\x1b[0m  \x1b[32m✔\x1b[0m Créé \x1b[36m/lib/utils/result.ts\x1b[0m \x1b[30;1m(Result pattern monadique)\x1b[0m',
            ' \x1b[38;2;255;106;0m│\x1b[0m  \x1b[32m✔\x1b[0m Mis à jour \x1b[36mpackage.json\x1b[0m \x1b[30;1mavec @serverpatterns/core\x1b[0m',
            ' \x1b[38;2;255;106;0m│\x1b[0m'
          ]);
          delay = 800;
          break;
        case 8: // Complete
          setTerminalLines(prev => [
            ...prev,
            ' \x1b[38;2;255;106;0m└\x1b[0m  \x1b[32;1mInitialisation terminée avec succès !\x1b[0m Démarre ton premier pattern avec \x1b[38;2;255;106;0mnpx serverpatterns add\x1b[0m.'
          ]);
          setIsRunning(false);
          break;
      }
    } else if (activeCommand === 'add-api') {
      switch (currentStep) {
        case 0:
          setTerminalLines(['$ npx serverpatterns add api user']);
          delay = 800;
          break;
        case 1:
          setTerminalLines(prev => [
            ...prev,
            ' ',
            ' \x1b[38;2;255;106;0m│\x1b[0m  \x1b[1mServerPatterns (v0.1.0) — Add API Route\x1b[0m',
            ' \x1b[38;2;255;106;0m│\x1b[0m'
          ]);
          delay = 700;
          break;
        case 2:
          setTerminalLines(prev => [
            ...prev,
            ' \x1b[38;2;255;106;0m◇\x1b[0m  Quel nom pour la ressource API ?',
            ' \x1b[38;2;255;106;0m│\x1b[0m  \x1b[38;2;255;106;0muser\x1b[0m',
            ' \x1b[38;2;255;106;0m│\x1b[0m'
          ]);
          delay = 800;
          break;
        case 3:
          setTerminalLines(prev => [
            ...prev,
            ' \x1b[38;2;255;106;0m◇\x1b[0m  Quelles méthodes HTTP implémenter ?',
            ' \x1b[38;2;255;106;0m│\x1b[0m  \x1b[38;2;255;106;0m◼\x1b[0m GET \x1b[30;1m(Lecture de ressource)\x1b[0m',
            ' \x1b[38;2;255;106;0m│\x1b[0m  \x1b[38;2;255;106;0m◼\x1b[0m POST \x1b[30;1m(Création/Mise à jour)\x1b[0m',
            ' \x1b[38;2;255;106;0m│\x1b[0m  \x1b[30;1m◻ PUT (Remplacement)\x1b[0m',
            ' \x1b[38;2;255;106;0m│\x1b[0m  \x1b[30;1m◻ DELETE (Suppression)\x1b[0m'
          ]);
          delay = 1400;
          break;
        case 4:
          setTerminalLines(prev => [
            ...prev.slice(0, 8),
            ' \x1b[38;2;255;106;0m◇\x1b[0m  Quelles méthodes HTTP implémenter ?',
            ' \x1b[38;2;255;106;0m│\x1b[0m  \x1b[32m✔\x1b[0m \x1b[1mGET, POST\x1b[0m',
            ' \x1b[38;2;255;106;0m│\x1b[0m'
          ]);
          delay = 600;
          break;
        case 5:
          setTerminalLines(prev => [
            ...prev,
            ' \x1b[38;2;255;106;0m◇\x1b[0m  Activer la validation Zod d\'entrées ?',
            ' \x1b[38;2;255;106;0m│\x1b[0m  \x1b[38;2;255;106;0m●\x1b[0m Oui, générer les schémas d\'entrée & types associés',
            ' \x1b[38;2;255;106;0m│\x1b[0m  \x1b[30;1m○ Non, typage standard\x1b[0m'
          ]);
          delay = 1000;
          break;
        case 6:
          setTerminalLines(prev => [
            ...prev.slice(0, 12),
            ' \x1b[38;2;255;106;0m◇\x1b[0m  Activer la validation Zod d\'entrées ?',
            ' \x1b[38;2;255;106;0m│\x1b[0m  \x1b[32m✔\x1b[0m \x1b[1mOui\x1b[0m',
            ' \x1b[38;2;255;106;0m│\x1b[0m'
          ]);
          delay = 600;
          break;
        case 7:
          setTerminalLines(prev => [
            ...prev,
            ' \x1b[38;2;255;106;0m◼\x1b[0m  Génération du pattern API...',
            ' \x1b[38;2;255;106;0m│\x1b[0m'
          ]);
          delay = 1200;
          break;
        case 8:
          setTerminalLines(prev => [
            ...prev.slice(0, 16),
            ' \x1b[38;2;255;106;0m▲\x1b[0m  Fichiers générés :',
            ' \x1b[38;2;255;106;0m│\x1b[0m  \x1b[32m✔\x1b[0m Créé \x1b[36m/app/api/user/route.ts\x1b[0m \x1b[30;1m(Route Handler GET & POST unifié)\x1b[0m',
            ' \x1b[38;2;255;106;0m│\x1b[0m  \x1b[32m✔\x1b[0m Créé \x1b[36m/lib/schemas/user.ts\x1b[0m \x1b[30;1m(Zod Validation Schemas)\x1b[0m',
            ' \x1b[38;2;255;106;0m│\x1b[0m'
          ]);
          delay = 800;
          break;
        case 9:
          setTerminalLines(prev => [
            ...prev,
            ' \x1b[38;2;255;106;0m└\x1b[0m  \x1b[32;1mGénération terminée !\x1b[0m Utilise \x1b[38;2;255;106;0mapi.get(\'/user\')\x1b[0m depuis le client Next.js.'
          ]);
          setIsRunning(false);
          break;
      }
    } else if (activeCommand === 'add-action') {
      switch (currentStep) {
        case 0:
          setTerminalLines(['$ npx serverpatterns add action createPost']);
          delay = 800;
          break;
        case 1:
          setTerminalLines(prev => [
            ...prev,
            ' ',
            ' \x1b[38;2;255;106;0m│\x1b[0m  \x1b[1mServerPatterns (v0.1.0) — Add Server Action\x1b[0m',
            ' \x1b[38;2;255;106;0m│\x1b[0m'
          ]);
          delay = 700;
          break;
        case 2:
          setTerminalLines(prev => [
            ...prev,
            ' \x1b[38;2;255;106;0m◇\x1b[0m  Quel nom pour l\'Action ?',
            ' \x1b[38;2;255;106;0m│\x1b[0m  \x1b[38;2;255;106;0mcreatePost\x1b[0m',
            ' \x1b[38;2;255;106;0m│\x1b[0m'
          ]);
          delay = 800;
          break;
        case 3:
          setTerminalLines(prev => [
            ...prev,
            ' \x1b[38;2;255;106;0m◇\x1b[0m  Où sauvegarder l\'Action ?',
            ' \x1b[38;2;255;106;0m│\x1b[0m  \x1b[38;2;255;106;0m●\x1b[0m /app/actions/post.ts \x1b[30;1m(Nouveau groupe)\x1b[0m',
            ' \x1b[38;2;255;106;0m│\x1b[0m  \x1b[30;1m○ /app/actions.ts (Fichier unique global)\x1b[0m'
          ]);
          delay = 1000;
          break;
        case 4:
          setTerminalLines(prev => [
            ...prev.slice(0, 8),
            ' \x1b[38;2;255;106;0m◇\x1b[0m  Où sauvegarder l\'Action ?',
            ' \x1b[38;2;255;106;0m│\x1b[0m  \x1b[32m✔\x1b[0m \x1b[1m/app/actions/post.ts\x1b[0m',
            ' \x1b[38;2;255;106;0m│\x1b[0m'
          ]);
          delay = 600;
          break;
        case 5:
          setTerminalLines(prev => [
            ...prev,
            ' \x1b[38;2;255;106;0m◇\x1b[0m  Générer un schéma de validation d\'entrées avec Zod ?',
            ' \x1b[38;2;255;106;0m│\x1b[0m  \x1b[38;2;255;106;0m●\x1b[0m Oui, configurer la validation d\'Action',
            ' \x1b[38;2;255;106;0m│\x1b[0m  \x1b[30;1m○ Non, FormData natif sans types\x1b[0m'
          ]);
          delay = 1000;
          break;
        case 6:
          setTerminalLines(prev => [
            ...prev.slice(0, 12),
            ' \x1b[38;2;255;106;0m◇\x1b[0m  Générer un schéma de validation d\'entrées avec Zod ?',
            ' \x1b[38;2;255;106;0m│\x1b[0m  \x1b[32m✔\x1b[0m \x1b[1mOui, avec Zod\x1b[0m',
            ' \x1b[38;2;255;106;0m│\x1b[0m'
          ]);
          delay = 600;
          break;
        case 7:
          setTerminalLines(prev => [
            ...prev,
            ' \x1b[38;2;255;106;0m◼\x1b[0m  Génération de la Server Action...',
            ' \x1b[38;2;255;106;0m│\x1b[0m'
          ]);
          delay = 1200;
          break;
        case 8:
          setTerminalLines(prev => [
            ...prev.slice(0, 16),
            ' \x1b[38;2;255;106;0m▲\x1b[0m  Fichiers générés :',
            ' \x1b[38;2;255;106;0m│\x1b[0m  \x1b[32m✔\x1b[0m Créé \x1b[36m/app/actions/post.ts\x1b[0m \x1b[30;1m(Server Action unifiée avec validation)\x1b[0m',
            ' \x1b[38;2;255;106;0m│\x1b[0m'
          ]);
          delay = 800;
          break;
        case 9:
          setTerminalLines(prev => [
            ...prev,
            ' \x1b[38;2;255;106;0m└\x1b[0m  \x1b[32;1mGénération terminée !\x1b[0m Importe \x1b[38;2;255;106;0m{ createPost }\x1b[0m dans tes composants Next.js Client.'
          ]);
          setIsRunning(false);
          break;
      }
    }

    // Trigger next step if there's one
    const maxSteps = activeCommand === 'init' ? 8 : 9;
    if (currentStep < maxSteps) {
      timerRef.current = setTimeout(() => {
        runSimulationStep(currentStep + 1);
      }, delay);
    }
  };

  // Helper to strip ANSI codes and render terminal text neatly
  const renderTerminalLine = (line: string) => {
    // Basic ANSI Color Decoder
    let html = line;
    
    // Replace Clack characters to give high-end color matches
    html = html.replace(/│/g, '<span class="text-[#FF6A00]/70">│</span>');
    html = html.replace(/◇/g, '<span class="text-[#FF6A00] font-bold">◇</span>');
    html = html.replace(/◆/g, '<span class="text-[#FF6A00] font-bold">◆</span>');
    html = html.replace(/●/g, '<span class="text-[#FF6A00]">●</span>');
    html = html.replace(/○/g, '<span class="text-[#52524E]">○</span>');
    html = html.replace(/◼/g, '<span class="text-[#FF6A00] animate-pulse">◼</span>');
    html = html.replace(/▲/g, '<span class="text-[#FFA366]">▲</span>');
    html = html.replace(/└/g, '<span class="text-[#FF6A00]/70">└</span>');
    html = html.replace(/✔/g, '<span class="text-green-500 font-bold">✔</span>');

    // Replace ANSI colors
    html = html.replace(/\x1b\[38;2;255;106;0m/g, '<span style="color: #FF6A00">');
    html = html.replace(/\x1b\[30;1m/g, '<span style="color: #52524E">');
    html = html.replace(/\x1b\[32;1m/g, '<span style="color: #22c55e; font-weight: bold;">');
    html = html.replace(/\x1b\[32m/g, '<span style="color: #22c55e">');
    html = html.replace(/\x1b\[36m/g, '<span style="color: #FFA366">');
    html = html.replace(/\x1b\[1m/g, '<span style="font-weight: bold; color: #fff">');
    html = html.replace(/\x1b\[0m/g, '</span>');

    return <div dangerouslySetInnerHTML={{__html: html}} />;
  };

  // Generated file previews for each command
  const generatedFiles: Record<string, { title: string; code: string }> = {
    '/lib/api.ts': {
      title: '/lib/api.ts (Client API Unifié)',
      code: `import { createApiClient } from '@serverpatterns/core';

// Client de référence initialisé à l'init
export const api = createApiClient({
  baseUrl: process.env.NEXT_PUBLIC_API_URL || '/api',
  headers: () => {
    // Gère dynamiquement les headers (tokens, cookies) de façon sécurisée
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    return token ? { Authorization: \`Bearer \${token}\` } : {};
  }
});`
    },
    '/lib/utils/result.ts': {
      title: '/lib/utils/result.ts (Structure Monadique Result)',
      code: `// Encapsule proprement les retours succès/erreur
export type Result<T, E = Error> =
  | { ok: true; value: T; isOk(): true; isErr(): false }
  | { ok: false; error: E; isOk(): false; isErr(): true };

export function ok<T>(value: T): Result<T, any> {
  return {
    ok: true,
    value,
    isOk: () => true,
    isErr: () => false,
  };
}

export function err<E>(error: E): Result<any, E> {
  return {
    ok: false,
    error,
    isOk: () => false,
    isErr: () => true,
  };
}`
    },
    '/app/api/user/route.ts': {
      title: '/app/api/user/route.ts (Route Handler)',
      code: `import { createGetHandler, createPostHandler } from '@serverpatterns/next';
import { userSchema, createUserSchema } from '@/lib/schemas/user';
import { db } from '@/lib/db';

// Route Handler hautement standardisé, gérant la validation
// d'entrée de manière transparente avec Zod
export const GET = createGetHandler({
  schema: userSchema,
  handler: async ({ params }) => {
    const user = await db.users.findUnique(params.id);
    return user;
  }
});

export const POST = createPostHandler({
  schema: createUserSchema,
  handler: async ({ body }) => {
    const newUser = await db.users.create(body);
    return newUser;
  }
});`
    },
    '/lib/schemas/user.ts': {
      title: '/lib/schemas/user.ts (Validation Zod)',
      code: `import { z } from 'zod';

// Schémas automatiques générés par le CLI
export const userSchema = z.object({
  id: z.string().uuid()
});

export const createUserSchema = z.object({
  email: z.string().email('Email invalide'),
  name: z.string().min(2, 'Le nom doit faire au moins 2 caractères'),
  role: z.enum(['admin', 'member']).default('member')
});

export type CreateUser = z.infer<typeof createUserSchema>;`
    },
    '/app/actions/post.ts': {
      title: '/app/actions/post.ts (Server Action)',
      code: `import { withServerAction } from '@serverpatterns/next';
import { z } from 'zod';
import { db } from '@/lib/db';

const createPostSchema = z.object({
  title: z.string().min(5, 'Le titre doit faire 5 caractères minimum'),
  content: z.string().max(1000)
});

// Server Action encapsulée dans withServerAction :
// Validation Zod de FormData intégrée, retour d'erreur typé automatique.
export const createPost = withServerAction({
  schema: createPostSchema,
  action: async ({ body, context }) => {
    // body est garanti typé et validé !
    const post = await db.posts.create({
      title: body.title,
      content: body.content,
      authorId: context.session.userId
    });
    
    return post;
  }
});`
    }
  };

  const getTabsForCommand = () => {
    if (activeCommand === 'init') {
      return ['/lib/api.ts', '/lib/utils/result.ts'];
    } else if (activeCommand === 'add-api') {
      return ['/app/api/user/route.ts', '/lib/schemas/user.ts'];
    } else {
      return ['/app/actions/post.ts'];
    }
  };

  return (
    <div id="interactive-terminal-section" className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full max-w-6xl mx-auto px-4">
      
      {/* Simulation Controls & Terminal Window (L: 6 cols) */}
      <div className="lg:col-span-6 flex flex-col gap-4">
        
        {/* Commands Selection Header */}
        <div className="flex bg-[#121212] p-1.5 rounded-xl border border-white/5 gap-1 shadow-md">
          <button
            id="cmd-select-init"
            onClick={() => changeCommand('init')}
            className={`flex-1 py-2 text-xs font-mono rounded-lg transition-all ${
              activeCommand === 'init'
                ? 'bg-[#FF6A00] text-black font-semibold'
                : 'text-[#8E8E8A] hover:bg-white/5 hover:text-white'
            }`}
          >
            init
          </button>
          <button
            id="cmd-select-add-api"
            onClick={() => changeCommand('add-api')}
            className={`flex-1 py-2 text-xs font-mono rounded-lg transition-all ${
              activeCommand === 'add-api'
                ? 'bg-[#FF6A00] text-black font-semibold'
                : 'text-[#8E8E8A] hover:bg-white/5 hover:text-white'
            }`}
          >
            add api user
          </button>
          <button
            id="cmd-select-add-action"
            onClick={() => changeCommand('add-action')}
            className={`flex-1 py-2 text-xs font-mono rounded-lg transition-all ${
              activeCommand === 'add-action'
                ? 'bg-[#FF6A00] text-black font-semibold'
                : 'text-[#8E8E8A] hover:bg-white/5 hover:text-white'
            }`}
          >
            add action
          </button>
        </div>

        {/* The CLI Window */}
        <div className="bg-[#0B0B0B] border border-white/10 rounded-2xl flex flex-col h-[380px] shadow-2xl relative overflow-hidden group">
          
          {/* Mac-like Header */}
          <div className="bg-[#141414] border-b border-white/5 px-4 py-3 flex items-center justify-between">
            <div className="flex gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500/40" />
              <span className="w-3 h-3 rounded-full bg-yellow-500/40" />
              <span className="w-3 h-3 rounded-full bg-green-500/40" />
            </div>
            <span className="text-[11px] font-mono text-[#8E8E8A] flex items-center gap-1.5">
              <Terminal size={12} className="text-[#FF6A00]" />
              clack-terminal-session
            </span>
            <div className="w-12" />
          </div>

          {/* Terminal Screen Output */}
          <div className="p-5 flex-1 font-mono text-xs md:text-sm leading-relaxed overflow-y-auto text-[#F5F5F3] flex flex-col gap-1.5 scrollbar-thin">
            {terminalLines.length === 0 && (
              <div className="text-[#52524E] flex flex-col items-center justify-center h-full gap-3">
                <Terminal size={32} className="stroke-1 text-[#FF6A00]/40 animate-pulse" />
                <span className="text-xs">Prêt pour la simulation interacte.</span>
                <button
                  id="btn-run-sim-center"
                  onClick={startSimulation}
                  className="flex items-center gap-1.5 bg-[#FF6A00] text-black font-semibold px-4 py-2 rounded-lg text-xs hover:bg-[#E05D00] transition active:scale-95 shadow-md"
                >
                  <Play size={12} fill="currentColor" />
                  Lancer la démo
                </button>
              </div>
            )}
            
            {terminalLines.map((line, idx) => (
              <div key={idx} className="animate-[fadeIn_0.15s_ease-out]">
                {renderTerminalLine(line)}
              </div>
            ))}

            {/* Simulated input typing indicator or blinking cursor */}
            {isRunning && (
              <div className="flex items-center">
                <span className="inline-block w-2 h-4 bg-[#FF6A00] animate-pulse ml-0.5" />
              </div>
            )}
          </div>

          {/* Floating Actions on terminal */}
          {terminalLines.length > 0 && (
            <div className="absolute bottom-3 right-3 flex gap-2">
              <button
                id="btn-reset-sim"
                onClick={() => resetSimulation()}
                className="bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 p-2 rounded-lg transition shadow-md"
                title="Recommencer"
              >
                <RotateCcw size={13} />
              </button>
              {!isRunning && (
                <button
                  id="btn-run-sim-again"
                  onClick={startSimulation}
                  className="bg-[#FF6A00] text-black font-semibold px-3 py-1.5 text-xs rounded-lg transition hover:bg-[#E05D00] flex items-center gap-1 shadow-md"
                >
                  <Play size={11} fill="currentColor" />
                  Relancer
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Code generated inspector (R: 6 cols) */}
      <div className="lg:col-span-6 flex flex-col gap-4">
        
        {/* Code tab list based on active simulation */}
        <div className="flex justify-between items-center px-1">
          <div className="flex gap-2">
            {getTabsForCommand().map(tabKey => {
              const file = generatedFiles[tabKey];
              const isSelected = activeGeneratedTab === tabKey;
              return (
                <button
                  key={tabKey}
                  id={`tab-select-${tabKey.replace(/[\/.]/g, '-')}`}
                  onClick={() => setActiveGeneratedTab(tabKey)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all border ${
                    isSelected
                      ? 'bg-[#121212] text-[#FF6A00] border-[#FF6A00]/20 font-medium'
                      : 'text-[#8E8E8A] border-transparent hover:text-white hover:bg-white/5'
                  }`}
                >
                  <FileText size={12} className={isSelected ? 'text-[#FF6A00]' : ''} />
                  {tabKey.split('/').pop()}
                </button>
              );
            })}
          </div>
          <span className="text-[10px] font-mono text-[#52524E] hidden sm:inline-block">
            FICHIER GÉNÉRÉ
          </span>
        </div>

        {/* Real code output box */}
        <div className="relative flex-1 min-h-[380px] flex flex-col">
          {step < (activeCommand === 'init' ? 7 : 8) && isRunning ? (
            <div className="flex-1 flex flex-col items-center justify-center bg-[#121212] rounded-2xl border border-white/5 text-center p-8 text-[#52524E] gap-3">
              <div className="w-8 h-8 rounded-full border-2 border-[#FF6A00]/20 border-t-[#FF6A00] animate-spin" />
              <span className="text-xs font-mono text-[#8E8E8A]">En attente de la génération par le CLI...</span>
            </div>
          ) : (
            <div className="flex-1 flex flex-col justify-stretch">
              <CodeBlock
                code={generatedFiles[activeGeneratedTab]?.code || ''}
                title={generatedFiles[activeGeneratedTab]?.title || 'Aperçu'}
                className="h-full flex-1 border-white/5 bg-[#121212]"
              />
              
              {/* Feature highlight card */}
              <div className="mt-4 p-4 rounded-xl border border-[#FF6A00]/10 bg-[#FF6A00]/5 flex items-start gap-3 animate-[fadeIn_0.3s_ease-out]">
                <div className="p-1 rounded-lg bg-[#FF6A00]/10 text-[#FF6A00]">
                  <Check size={14} className="stroke-[3]" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono mb-1">
                    Avantage de cette structure
                  </h4>
                  <p className="text-xs text-[#8E8E8A] leading-relaxed">
                    {activeCommand === 'init' && 
                      "Initialise un conteneur d'API centralisé. Votre code applicatif n'importe que ce client d'API, assurant des politiques de sécurité et des headers uniformes sans duplication."
                    }
                    {activeCommand === 'add-api' && 
                      "Enveloppe les requêtes avec createGetHandler / createPostHandler. Valide automatiquement l'ID en entrée via le schéma Zod. Zéro middleware verbeux à écrire."
                    }
                    {activeCommand === 'add-action' && 
                      "Le wrapper withServerAction intercepte FormData, applique le schéma de validation Zod, extrait les types complexes, et renvoie un Result sécurisé au composant client."
                    }
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
