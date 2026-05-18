import React from 'react';
import { Statut } from '../../types/devis';
import { AlertCircle, CheckCircle, Archive } from 'lucide-react';

interface StatusBadgeProps {
  status: Statut;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  switch (status) {
    case 'nouveau':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900/50">
          <AlertCircle className="w-3.5 h-3.5" />
          <span>Nouveau</span>
        </span>
      );
    case 'traite':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#FFDE77]/25 text-[#443C34] border border-[#FFDE77]/50">
          <CheckCircle className="w-3.5 h-3.5" />
          <span>Traité</span>
        </span>
      );
    case 'archive':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-zinc-100 text-zinc-600 border border-zinc-200 dark:bg-zinc-800/40 dark:text-zinc-400 dark:border-zinc-800">
          <Archive className="w-3.5 h-3.5" />
          <span>Archivé</span>
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-50 text-slate-600 border border-slate-200">
          <span>{status}</span>
        </span>
      );
  }
}
