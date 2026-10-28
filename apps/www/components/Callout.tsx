import type {ReactNode} from 'react';
import {Info, TriangleAlert} from 'lucide-react';

interface CalloutProps {
  title: string;
  children: ReactNode;
  /** note : information utile. warning : piège à éviter ou limite connue. */
  type?: 'note' | 'warning';
}

export default function Callout({title, children, type = 'note'}: CalloutProps) {
  const Icon = type === 'warning' ? TriangleAlert : Info;
  return (
    <aside
      className={`flex gap-3 rounded-[10px] border px-4 py-3.5 ${
        type === 'warning' ? 'border-accent/40 bg-accent/[0.06]' : 'border-line bg-surface'
      }`}
    >
      <Icon size={18} aria-hidden className={`mt-0.5 shrink-0 ${type === 'warning' ? 'text-accent' : 'text-muted'}`} />
      <div className="min-w-0 space-y-1 text-[0.9375rem]">
        <p className="font-semibold text-text">{title}</p>
        <div className="text-[#D6D3CC] [&_code]:text-[0.85em]">{children}</div>
      </div>
    </aside>
  );
}
