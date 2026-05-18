import React from 'react';
import { Statut } from '../../types/devis';

interface StatusFilterProps {
  activeFilter: Statut | 'all';
  onChange: (filter: Statut | 'all') => void;
  counts: {
    all: number;
    nouveau: number;
    traite: number;
    archive: number;
  };
}

export default function StatusFilter({ activeFilter, onChange, counts }: StatusFilterProps) {
  const tabs: { value: Statut | 'all'; label: string; count: number; activeClass: string }[] = [
    { 
      value: 'all', 
      label: 'Tous', 
      count: counts.all,
      activeClass: 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 shadow-sm'
    },
    { 
      value: 'nouveau', 
      label: 'Nouveaux', 
      count: counts.nouveau,
      activeClass: 'bg-blue-500 text-white shadow-sm shadow-blue-500/10'
    },
    { 
      value: 'traite', 
      label: 'Traités', 
      count: counts.traite,
      activeClass: 'bg-emerald-500 text-white shadow-sm shadow-emerald-500/10'
    },
    { 
      value: 'archive', 
      label: 'Archivés', 
      count: counts.archive,
      activeClass: 'bg-zinc-500 text-white shadow-sm'
    },
  ];

  return (
    <div className="flex flex-wrap gap-1.5 p-1 bg-slate-100/80 dark:bg-zinc-900/60 rounded-xl border border-slate-200/40 dark:border-zinc-800/60 w-fit">
      {tabs.map((tab) => {
        const isActive = activeFilter === tab.value;
        return (
          <button
            key={tab.value}
            type="button"
            onClick={() => onChange(tab.value)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all duration-300 cursor-pointer ${
              isActive
                ? tab.activeClass
                : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <span>{tab.label}</span>
            <span className={`inline-flex items-center justify-center px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
              isActive
                ? 'bg-white/20 text-white dark:bg-black/10 dark:text-black'
                : 'bg-slate-200 dark:bg-zinc-800 text-slate-500 dark:text-zinc-500'
            }`}>
              {tab.count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
