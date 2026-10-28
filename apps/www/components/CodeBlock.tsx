'use client';

import React, {useState} from 'react';
import {Copy, Check} from 'lucide-react';

interface CodeBlockProps {
  code: string;
  language?: string;
  title?: string;
  className?: string;
}

// Token categories for syntax highlighting:
// keywords: #FF6A00 (orange)
// functions: #FFA366 (light orange)
// types: #E2E2DF (off-white)
// strings: #8E8E8A (medium grey)
// comments: #52524E (dark grey)
// operators: #7A7A75 (grey-grey)
// variables/ident: #F5F5F3 (warm white)

export default function CodeBlock({code, title, className = ''}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code.trim());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const highlight = (rawCode: string) => {
    const tokenRegex = new RegExp(
      [
        // Comments
        `(?<comment>\\/\\/[^\\n]*|\\/\\*[\\s\\S]*?\\*\\/)`,
        // Strings
        `(?<string>'(?:\\\\.|[^'\\\\])*'|"(?:\\\\.|[^"\\\\])*"|\\x60(?:\\\\.|[^\\x60\\\\])*\\x60)`,
        // Keywords
        `(?<keyword>\\b(?:import|export|default|const|let|function|class|extends|implements|interface|type|async|await|return|try|catch|from|of|in|new|throw|if|else|switch|case|break|as)\\b)`,
        // Types
        `(?<type>\\b(?:Result|ApiClientConfig|RouteHandler|ServerAction|ZodSchema|string|number|boolean|any|unknown|never|void|Promise|NextRequest|NextResponse|z|Post|User|ApiResponse|T|E)\\b)`,
        // Special functions
        `(?<special_fn>\\b(?:GET|POST|PUT|DELETE|PATCH|ok|err|isOk|isErr|createApiClient|createGetHandler|createPostHandler|withServerAction)\\b)`,
        // Function calls (identifier followed by paren)
        `(?<fn_call>\\b[a-zA-Z0-9_]+(?=\\())`,
        // Operators and Punctuation
        `(?<operator>===|!==|==|!=|=>|\\+=|-=|\\*=|\\/=|&&|\\|\\||\\?|:|\\+|-|\\*|\\/|%|=|&|\\||\\^|!)`,
        // Identifiers/Words
        `(?<identifier>\\b[a-zA-Z_][a-zA-Z0-9_]*\\b)`,
        // Numbers
        `(?<number>\\b\\d+(?:\\.\\d+)?\\b)`,
        // Default whitespace or anything else
        `(?<whitespace>\\s+)`,
        // Any other individual character
        `(?<other>.)`
      ].join('|'),
      'g'
    );

    let match;
    let htmlResult = '';

    const escapeHtml = (text: string) => {
      return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
    };

    while ((match = tokenRegex.exec(rawCode)) !== null) {
      const groups = match.groups;
      if (!groups) {
        htmlResult += escapeHtml(match[0]);
        continue;
      }

      if (groups.comment) {
        htmlResult += `<span style="color: #52524E">${escapeHtml(groups.comment)}</span>`;
      } else if (groups.string) {
        htmlResult += `<span style="color: #8E8E8A">${escapeHtml(groups.string)}</span>`;
      } else if (groups.keyword) {
        htmlResult += `<span style="color: #FF6A00">${escapeHtml(groups.keyword)}</span>`;
      } else if (groups.type) {
        htmlResult += `<span style="color: #E2E2DF">${escapeHtml(groups.type)}</span>`;
      } else if (groups.special_fn) {
        htmlResult += `<span style="color: #FFA366">${escapeHtml(groups.special_fn)}</span>`;
      } else if (groups.fn_call) {
        htmlResult += `<span style="color: #FFA366">${escapeHtml(groups.fn_call)}</span>`;
      } else if (groups.operator) {
        htmlResult += `<span style="color: #7A7A75">${escapeHtml(groups.operator)}</span>`;
      } else {
        htmlResult += escapeHtml(match[0]);
      }
    }

    return htmlResult;
  };

  return (
    <div id={`codeblock-${title ? title.toLowerCase().replace(/\s+/g, '-') : 'raw'}`} className={`relative flex flex-col rounded-xl border border-white/10 bg-[#121212] overflow-hidden text-left ${className}`}>
      {title && (
        <div className="flex items-center justify-between border-b border-white/5 bg-[#181818]/80 px-4 py-2 text-xs font-mono text-[#8E8E8A]">
          <span className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#FF6A00]/50" />
            {title}
          </span>
          <button
            id={`btn-copy-${title.toLowerCase().replace(/\s+/g, '-')}`}
            onClick={handleCopy}
            className="flex items-center gap-1.5 rounded bg-white/5 px-2 py-1 text-xs text-white/60 transition hover:bg-white/10 hover:text-white"
            title="Copier le code"
          >
            {copied ? (
              <>
                <Check size={12} className="text-[#FF6A00]" />
                <span className="text-[#FF6A00] font-medium">Copié</span>
              </>
            ) : (
              <>
                <Copy size={12} />
                <span>Copier</span>
              </>
            )}
          </button>
        </div>
      )}
      {!title && (
        <button
          id="btn-copy-floating"
          onClick={handleCopy}
          className="absolute right-3 top-3 z-10 flex h-7 w-7 items-center justify-center rounded bg-white/5 text-white/60 transition hover:bg-white/10 hover:text-white"
          title="Copier le code"
        >
          {copied ? <Check size={14} className="text-[#FF6A00]" /> : <Copy size={14} />}
        </button>
      )}
      <div className="overflow-x-auto p-4 md:p-5">
        <pre className="font-mono text-xs md:text-sm leading-relaxed text-[#F5F5F3]">
          <code dangerouslySetInnerHTML={{__html: highlight(code.trim())}} />
        </pre>
      </div>
    </div>
  );
}
