import React from 'react';
import { AlertTriangle, Calendar, FileText } from 'lucide-react';
import { Urgence } from '../../types/devis';

interface StepTwoProps {
  formData: {
    urgence: Urgence | '';
    message: string;
  };
  onChange: (fields: Partial<{
    urgence: Urgence | '';
    message: string;
  }>) => void;
  errors: Record<string, string>;
}

const URGENCIES: { value: Urgence; label: string; desc: string; icon: any; colorClass: string }[] = [
  { 
    value: '24h', 
    label: 'Intervention urgente (< 24h)', 
    desc: 'Traitement critique rapide, équipe dépêchée immédiatement.', 
    icon: AlertTriangle,
    colorClass: 'border-amber-400 bg-amber-50/40 dark:bg-amber-950/10 text-amber-600 dark:text-amber-400 ring-2 ring-amber-400/25 shadow-sm'
  },
  { 
    value: 'annuel', 
    label: 'Contrat annuel de prévention', 
    desc: 'Suivi et passages réguliers pour garantir un environnement sain.', 
    icon: Calendar,
    colorClass: 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 ring-2 ring-emerald-500/20 shadow-sm'
  },
  { 
    value: 'simple', 
    label: 'Simple devis estimatif', 
    desc: 'Estimation budgétaire pour planification sans engagement.', 
    icon: FileText,
    colorClass: 'border-slate-500 bg-slate-50 dark:bg-zinc-800/40 text-slate-700 dark:text-zinc-300 ring-2 ring-slate-500/25 shadow-sm'
  },
];

export default function StepTwo({ formData, onChange, errors }: StepTwoProps) {
  const currentMessageLength = formData.message.length;
  const isMessageLimitClose = currentMessageLength > 450;

  return (
    <div className="space-y-6">
      {/* Urgency Radio Cards */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 dark:text-zinc-300 mb-3">
          Degré d'urgence de l'intervention <span className="text-red-500">*</span>
        </label>
        <div className="space-y-3">
          {URGENCIES.map((item) => {
            const Icon = item.icon;
            const isSelected = formData.urgence === item.value;
            
            return (
              <button
                key={item.value}
                type="button"
                onClick={() => onChange({ urgence: item.value })}
                className={`w-full flex items-start p-4 rounded-xl border text-left transition-all duration-300 gap-4 cursor-pointer ${
                  isSelected 
                    ? item.colorClass
                    : 'border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-slate-300 dark:hover:border-zinc-800/80 hover:bg-slate-50/50'
                }`}
              >
                <div className={`p-2.5 rounded-lg border ${
                  isSelected 
                    ? 'bg-white/80 dark:bg-zinc-900/80 border-current'
                    : 'bg-slate-50 dark:bg-zinc-800/60 border-slate-200 dark:border-zinc-800'
                }`}>
                  <Icon className="w-5 h-5 stroke-[2]" />
                </div>
                <div className="flex-1">
                  <p className={`text-sm font-semibold ${
                    isSelected ? 'text-slate-900 dark:text-white font-bold' : 'text-slate-700 dark:text-zinc-300'
                  }`}>
                    {item.label}
                  </p>
                  <p className="text-xs text-slate-400 dark:text-zinc-500 mt-0.5">
                    {item.desc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
        {errors.urgence && (
          <p className="mt-2 text-xs font-medium text-red-500" role="alert">
            {errors.urgence}
          </p>
        )}
      </div>

      {/* Free Text Message */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label htmlFor="message" className="block text-sm font-semibold text-slate-700 dark:text-zinc-300">
            Message ou précisions additionnelles (optionnel)
          </label>
          <span className={`text-[10px] font-semibold transition-colors duration-300 ${
            isMessageLimitClose ? 'text-amber-500' : 'text-slate-400 dark:text-zinc-500'
          }`}>
            {currentMessageLength} / 500
          </span>
        </div>
        <textarea
          id="message"
          name="message"
          rows={4}
          maxLength={500}
          value={formData.message}
          onChange={(e) => onChange({ message: e.target.value })}
          placeholder="Décrivez les signes d'infestation, la disposition des pièces, ou d'autres détails utiles..."
          className={`block w-full rounded-xl border p-3.5 text-sm focus:outline-none focus:ring-2 transition-all duration-300 bg-white dark:bg-zinc-900 resize-none ${
            errors.message
              ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
              : 'border-slate-200 dark:border-zinc-800 focus:border-emerald-500 focus:ring-emerald-500/20'
          }`}
        />
        <p className="mt-1 text-[11px] text-slate-400 dark:text-zinc-500">
          Veuillez ne pas dépasser 500 caractères.
        </p>
        {errors.message && (
          <p className="mt-2 text-xs font-medium text-red-500" role="alert">
            {errors.message}
          </p>
        )}
      </div>
    </div>
  );
}
