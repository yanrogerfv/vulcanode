"use client";

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useProjectStore } from '@/store/useProjectStore';
import { Anvil, ArrowLeft } from 'lucide-react';

interface Props {
  title: string;
  updatedAt: string;
  children: React.ReactNode;
}

export const LegalLayout: React.FC<Props> = ({ title, updatedAt, children }) => {
  const { theme, language } = useProjectStore();

  useEffect(() => {
    document.documentElement.classList.remove('dark', 'light');
    document.documentElement.classList.add(theme);
    document.title = `${title} | Vulcanode`;
  }, [theme, title]);

  return (
    <main className="min-h-screen bg-background text-foreground font-sans">
      <nav className="max-w-3xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center shadow-[0_0_15px_rgba(255,106,19,0.35)] shrink-0">
            <Anvil className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold text-lg tracking-tight">
            Vulca<span className="text-orange-500">node</span>
          </span>
        </Link>
        <Link
          href="/"
          className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          {language === 'en' ? 'Back to home' : 'Voltar ao início'}
        </Link>
      </nav>

      <article className="max-w-3xl mx-auto px-6 pb-24">
        <div className="border-b border-border pb-6 mb-8">
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight mb-2">{title}</h1>
          <p className="text-xs text-muted-foreground">{language === 'en' ? 'Last updated' : 'Última atualização'}: {updatedAt}</p>
        </div>
        <div className="flex flex-col gap-8 text-sm leading-relaxed text-foreground/90 [&_h2]:text-base [&_h2]:font-semibold [&_h2]:text-foreground [&_h2]:mb-2.5 [&_p]:mb-3 [&_p:last-child]:mb-0 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:flex [&_ul]:flex-col [&_ul]:gap-1.5 [&_strong]:text-foreground [&_strong]:font-medium [&_a]:text-orange-600 [&_a]:dark:text-orange-400 [&_a]:hover:underline">
          {children}
        </div>
      </article>
    </main>
  );
};
