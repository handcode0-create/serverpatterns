'use client';

import {useState} from 'react';
import {Check, Copy} from 'lucide-react';

interface CodeBlockProps {
  code: string;
  /** Nom de fichier affiché en en-tête (ex: "app/api/users/route.ts") */
  title?: string;
  /** "ts" (défaut), "json", "bash" ou "text" : règle la coloration */
  language?: 'ts' | 'json' | 'bash' | 'text';
  className?: string;
  /** Retour à la ligne au lieu du défilement horizontal (JSON court, texte) */
  wrap?: boolean;
}

const KEYWORDS =
  'import|export|default|from|as|const|let|var|function|return|async|await|if|else|switch|case|break|try|catch|finally|throw|new|type|interface|extends|implements|typeof|keyof|satisfies|in|of|void|null|undefined|true|false';

const TOKEN = new RegExp(
  [
    '(?<comment>\\/\\/[^\\n]*|\\/\\*[\\s\\S]*?\\*\\/|#[^\\n]*(?=\\n|$))',
    '(?<string>"(?:\\\\.|[^"\\\\])*"|\'(?:\\\\.|[^\'\\\\])*\'|`(?:\\\\.|[^`\\\\])*`)',
    `(?<keyword>\\b(?:${KEYWORDS})\\b)`,
    '(?<type>\\b[A-Z][A-Za-z0-9_]*\\b)',
    '(?<fn>\\b[a-zA-Z_$][\\w$]*(?=\\s*[(<]))',
    '(?<number>\\b\\d[\\d_]*(?:\\.\\d+)?\\b)',
    '(?<punct>[{}()[\\];,.:=<>!?&|+\\-*/%]+)',
  ].join('|'),
  'g'
);

function escapeHtml(text: string) {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export function highlight(code: string, language: CodeBlockProps['language']) {
  if (language === 'text') return escapeHtml(code);
  let html = '';
  let last = 0;
  for (const match of code.matchAll(TOKEN)) {
    const index = match.index ?? 0;
    html += escapeHtml(code.slice(last, index));
    const groups = match.groups ?? {};
    const kind = Object.keys(groups).find((key) => groups[key] !== undefined);
    // En bash, # n'est un commentaire qu'en début de ligne ; en TS/JSON, # n'existe pas.
    const isHashComment = kind === 'comment' && match[0].startsWith('#');
    const isSlashComment = kind === 'comment' && match[0].startsWith('//');
    const effective =
      (isHashComment && language !== 'bash') || (isSlashComment && language === 'bash') ? undefined : kind;
    html += effective ? `<span class="tok-${effective}">${escapeHtml(match[0])}</span>` : escapeHtml(match[0]);
    last = index + match[0].length;
  }
  return html + escapeHtml(code.slice(last));
}

export default function CodeBlock({code, title, language = 'ts', className = '', wrap = false}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const source = code.replace(/\n+$/, '');

  async function copy() {
    try {
      await navigator.clipboard.writeText(source);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Presse-papiers indisponible (contexte non sécurisé) : rien à faire.
    }
  }

  return (
    <figure className={`not-prose overflow-hidden rounded-[10px] border border-line bg-surface ${className}`}>
      <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-2">
        <figcaption className="truncate font-mono text-[0.8125rem] text-muted">
          {title ?? (language === 'bash' ? 'Terminal' : 'Exemple')}
        </figcaption>
        <button
          type="button"
          onClick={copy}
          className="flex shrink-0 items-center gap-1.5 rounded-md px-2 py-1 text-[0.8125rem] text-muted transition-colors hover:bg-raised hover:text-text"
          aria-label={copied ? 'Code copié' : 'Copier le code'}
        >
          {copied ? <Check size={14} className="text-ok" /> : <Copy size={14} />}
          <span>{copied ? 'Copié' : 'Copier'}</span>
        </button>
      </div>
      <pre className={`${wrap ? 'whitespace-pre-wrap break-words' : 'overflow-x-auto'} px-4 py-4 text-[0.8125rem] leading-[1.7] text-text sm:text-[0.875rem]`}>
        <code dangerouslySetInnerHTML={{__html: highlight(source, language)}} />
      </pre>
    </figure>
  );
}
