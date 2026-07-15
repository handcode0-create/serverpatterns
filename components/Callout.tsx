'use client';

import React from 'react';
import { Sparkles, Info, AlertTriangle } from 'lucide-react';

interface CalloutProps {
  title: string;
  children: React.ReactNode;
  type?: 'recommendation' | 'info' | 'warning';
}

export default function Callout({ title, children, type = 'recommendation' }: CalloutProps) {
  const getIcon = () => {
    switch (type) {
      case 'warning':
        return <AlertTriangle size={15} className="text-[#FF6A00]" />;
      case 'info':
        return <Info size={15} className="text-[#FF6A00]" />;
      default:
        return <Sparkles size={15} className="text-[#FF6A00]" />;
    }
  };

  return (
    <div className="border border-[#FF6A00]/20 bg-[#FF6A00]/5 rounded-xl p-5 my-6 flex gap-3.5 items-start text-left">
      <div className="p-1 rounded bg-[#FF6A00]/10 text-[#FF6A00] shrink-0 mt-0.5">
        {getIcon()}
      </div>
      <div className="space-y-1.5 flex-1">
        <h5 className="font-display font-bold text-xs uppercase tracking-wider text-[#FF6A00]">
          {title}
        </h5>
        <div className="text-xs text-[#8E8E8A] leading-relaxed font-sans">
          {children}
        </div>
      </div>
    </div>
  );
}
