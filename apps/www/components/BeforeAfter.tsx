'use client';

import {useState} from 'react';
import {highlight} from '@/components/CodeBlock';

interface Annotation {
  /** Texte présent dans la ligne à marquer */
  match: string;
  note: string;
}

interface Variant {
  label: string;
  file: string;
  code: string;
  summary: string;
  annotations: Annotation[];
}

interface BeforeAfterProps {
  before: Variant;
  after: Variant;
}

function countLines(code: string) {
  return code.replace(/\n+$/, '').split('\n').length;
}

export default function BeforeAfter({before, after}: BeforeAfterProps) {
  const [showAfter, setShowAfter] = useState(false);
  const current = showAfter ? after : before;
  const lines = current.code.replace(/\n+$/, '').split('\n');

  // Associe chaque annotation à la première ligne qui contient son texte
  const markerByLine = new Map<number, number>();
  current.annotations.forEach((annotation, index) => {
    const line = lines.findIndex((text, i) => text.includes(annotation.match) && !markerByLine.has(i));
    if (line !== -1) markerByLine.set(line, index + 1);
  });

  const tone = showAfter ? 'text-ok border-ok/50 bg-ok/10' : 'text-fail border-fail/50 bg-fail/10';

  return (
    <div className="grid overflow-hidden rounded-[14px] border border-line bg-surface lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)]">
      <div className="flex flex-col border-b border-line p-5 sm:p-6 lg:border-b-0 lg:border-r">
        <div role="tablist" aria-label="Comparer le même Route Handler" className="inline-flex self-start rounded-lg border border-line bg-ink p-1">
          {[before, after].map((variant, index) => {
            const selected = (index === 1) === showAfter;
            return (
              <button
                key={variant.label}
                type="button"
                role="tab"
                aria-selected={selected}
                aria-controls="before-after-code"
                onClick={() => setShowAfter(index === 1)}
                className={`rounded-md px-3 py-1.5 text-[0.875rem] font-semibold transition-colors ${
                  selected ? 'bg-raised text-text' : 'text-muted hover:text-text'
                }`}
              >
                {variant.label}
              </button>
            );
          })}
        </div>

        <p className="mt-5 text-[0.9375rem] text-[#D6D3CC]">{current.summary}</p>

        <ol className="mt-5 space-y-3">
          {current.annotations.map((annotation, index) => (
            <li key={annotation.match} className="flex gap-3 text-[0.9375rem] leading-snug text-[#D6D3CC]">
              <span
                aria-hidden
                className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border font-mono text-[0.6875rem] ${tone}`}
              >
                {index + 1}
              </span>
              <span>{annotation.note}</span>
            </li>
          ))}
        </ol>

        <p className="mt-auto pt-6 font-mono text-[0.8125rem] text-muted">
          {countLines(before.code)} lignes avant, {countLines(after.code)} après
        </p>
      </div>

      <figure id="before-after-code" role="tabpanel" className="min-w-0">
        <figcaption className="border-b border-line px-5 py-2.5 font-mono text-[0.8125rem] text-muted">{current.file}</figcaption>
        <pre key={current.label} className="overflow-x-auto py-4 text-[0.8125rem] leading-[1.7] motion-safe:animate-[fade_180ms_ease-out]">
          <code>
            {lines.map((line, index) => {
              const marker = markerByLine.get(index);
              return (
                <span key={index} className={`flex pr-5 ${marker ? (showAfter ? 'bg-ok/[0.06]' : 'bg-fail/[0.07]') : ''}`}>
                  <span className="w-12 shrink-0 select-none pr-3 text-right text-[#55534E]">
                    {marker ? (
                      <span className={`inline-grid h-4 w-4 place-items-center rounded-full border text-[0.625rem] ${tone}`}>{marker}</span>
                    ) : (
                      index + 1
                    )}
                  </span>
                  <span className="whitespace-pre" dangerouslySetInnerHTML={{__html: highlight(line, 'ts') || ' '}} />
                </span>
              );
            })}
          </code>
        </pre>
      </figure>
    </div>
  );
}
