'use client';

import {useEffect, useState} from 'react';
import {usePathname} from 'next/navigation';

interface Heading {
  id: string;
  text: string;
  level: 2 | 3;
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

/** Sommaire de la page, construit à partir des h2/h3 du contenu. */
export default function Toc() {
  const pathname = usePathname();
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState('');

  useEffect(() => {
    let observer: IntersectionObserver | undefined;
    // Lecture du DOM rendu (système externe) dans une frame, après l'affichage de la page
    const frame = requestAnimationFrame(() => {
      const root = document.querySelector('[data-doc-content]');
      if (!root) return;
      const elements = Array.from(root.querySelectorAll<HTMLHeadingElement>('h2, h3'));
      const used = new Set<string>();
      const items = elements.map((element) => {
        if (!element.id) {
          let id = slugify(element.textContent ?? '') || 'section';
          while (used.has(id)) id += '-2';
          element.id = id;
        }
        used.add(element.id);
        return {id: element.id, text: element.textContent ?? '', level: element.tagName === 'H2' ? 2 : 3} as Heading;
      });
      setHeadings(items);

      observer = new IntersectionObserver(
        (entries) => {
          const visible = entries.filter((entry) => entry.isIntersecting);
          if (visible.length > 0) {
            visible.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
            setActiveId(visible[0].target.id);
          }
        },
        {rootMargin: '-80px 0px -60% 0px'}
      );
      elements.forEach((element) => observer?.observe(element));
    });
    return () => {
      cancelAnimationFrame(frame);
      observer?.disconnect();
    };
  }, [pathname]);

  if (headings.length < 2) return null;

  return (
    <nav aria-label="Sur cette page" className="text-[0.875rem]">
      <p className="mb-2 font-display font-semibold text-text">Sur cette page</p>
      <ul className="space-y-1.5">
        {headings.map((heading) => (
          <li key={heading.id} className={heading.level === 3 ? 'pl-3' : undefined}>
            <a
              href={`#${heading.id}`}
              className={`block leading-snug transition-colors ${activeId === heading.id ? 'text-accent-soft' : 'text-muted hover:text-text'}`}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
