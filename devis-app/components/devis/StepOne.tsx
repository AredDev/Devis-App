import React from 'react';
import { Shield, Building, Home, Hotel, HelpCircle, Check, Bug } from 'lucide-react';
import { Etablissement, Nuisible } from '../../types/devis';

interface StepOneProps {
  formData: {
    etablissement: Etablissement | '';
    surface: number | '';
    nuisibles: Nuisible[];
  };
  onChange: (fields: Partial<{
    etablissement: Etablissement | '';
    surface: number | '';
    nuisibles: Nuisible[];
  }>) => void;
  errors: Record<string, string>;
}

const ETABLISSEMENTS: { value: Etablissement; label: string; icon: any }[] = [
  { value: 'Restaurant', label: 'Restaurant', icon: UtensilsIcon },
  { value: 'Hôtel', label: 'Hôtel / Hébergement', icon: Hotel },
  { value: 'Copropriété', label: 'Copropriété / Syndic', icon: Building },
  { value: 'Autre', label: 'Autre établissement', icon: Home },
];

const NUISIBLES: { value: Nuisible; label: string; desc: string }[] = [
  { value: 'Rats', label: 'Rats / Souris', desc: 'Rongeurs, bruits, dégradations' },
  { value: 'Cafards', label: 'Cafards / Blattes', desc: 'Cuisine, sanitaires, nuisances' },
  { value: 'Punaises de lit', label: 'Punaises de lit', desc: 'Piqures, démangeaisons, literie' },
  { value: 'Frelons', label: 'Frelons / Guêpes', desc: 'Nids suspendus, piqûres, danger' },
  { value: 'Autre', label: 'Autre nuisible', desc: 'Puces, fourmis, pigeons, etc.' },
];

function UtensilsIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
      <path d="M7 2v20" />
      <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
    </svg>
  );
}

export default function StepOne({ formData, onChange, errors }: StepOneProps) {
  const toggleNuisible = (value: Nuisible) => {
    const isSelected = formData.nuisibles.includes(value);
    const updated = isSelected
      ? formData.nuisibles.filter((n) => n !== value)
      : [...formData.nuisibles, value];
    onChange({ nuisibles: updated });
  };

  return (
    <div className="space-y-6">
      {/* Establishment Selection */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 dark:text-zinc-300 mb-3">
          Type d'établissement <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {ETABLISSEMENTS.map((item) => {
            const Icon = item.icon;
            const isSelected = formData.etablissement === item.value;
            return (
              <button
                key={item.value}
                type="button"
                onClick={() => onChange({ etablissement: item.value })}
                className={`flex flex-col items-center justify-center p-4 rounded-xl border text-center transition-all duration-300 gap-2 cursor-pointer ${
                  isSelected
                    ? 'border-[#FFDE77] bg-[#FFDE77]/10 text-[#443C34] ring-2 ring-[#FFDE77]/20 shadow-md font-bold'
                    : 'border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-slate-500 dark:text-zinc-400 hover:border-slate-300 hover:bg-slate-50/50 dark:hover:bg-zinc-800/30'
                }`}
              >
                <Icon className={`w-6 h-6 ${isSelected ? 'scale-110' : ''}`} />
                <span className="text-xs font-semibold">{item.label}</span>
              </button>
            );
          })}
        </div>
        {errors.etablissement && (
          <p className="mt-2 text-xs font-medium text-red-500" role="alert">
            {errors.etablissement}
          </p>
        )}
      </div>

      {/* Surface Input */}
      <div>
        <label
          htmlFor="surface"
          className="block text-sm font-semibold text-slate-700 dark:text-zinc-300 mb-1.5"
        >
          Surface du local (m²) <span className="text-red-500">*</span>
        </label>
        <div className="relative rounded-lg shadow-sm w-full md:w-64">
          <input
            type="number"
            id="surface"
            name="surface"
            min="10"
            max="50000"
            value={formData.surface}
            onChange={(e) => {
              const val = e.target.value === '' ? '' : Number(e.target.value);
              onChange({ surface: val });
            }}
            placeholder="Ex: 150"
            className={`block w-full rounded-xl border p-3.5 pr-12 text-sm focus:outline-none focus:ring-2 transition-all duration-300 bg-white dark:bg-zinc-900 ${
              errors.surface
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                : 'border-slate-200 dark:border-zinc-800 focus:border-[#FFDE77] focus:ring-[#FFDE77]/20'
            }`}
          />
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
            <span className="text-xs font-bold text-slate-400 dark:text-zinc-500">m²</span>
          </div>
        </div>
        <p className="mt-1 text-[11px] text-slate-400 dark:text-zinc-500">
          Entrez un nombre entre 10 et 50 000 m².
        </p>
        {errors.surface && (
          <p className="mt-2 text-xs font-medium text-red-500" role="alert">
            {errors.surface}
          </p>
        )}
      </div>

      {/* Pests Selector */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 dark:text-zinc-300 mb-3">
          Types de nuisibles ciblés <span className="text-red-500">*</span> (sélection multiple)
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {NUISIBLES.map((item) => {
            const isSelected = formData.nuisibles.includes(item.value);
            return (
              <button
                key={item.value}
                type="button"
                onClick={() => toggleNuisible(item.value)}
                className={`flex items-center p-3.5 rounded-xl border text-left transition-all duration-300 gap-3 cursor-pointer ${
                  isSelected
                    ? 'border-[#FFDE77] bg-[#FFDE77]/10 shadow-sm'
                    : 'border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-slate-300 dark:hover:border-zinc-800/80 hover:bg-slate-50/50'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded flex items-center justify-center border transition-all duration-300 ${
                    isSelected
                      ? 'bg-[#FFDE77] border-[#FFDE77] text-[#443C34]'
                      : 'border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800'
                  }`}
                >
                  {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
                <div className="flex-1">
                  <p
                    className={`text-sm font-semibold ${
                      isSelected
                        ? 'text-[#443C34] font-bold'
                        : 'text-slate-700 dark:text-zinc-300'
                    }`}
                  >
                    {item.label}
                  </p>
                  <p className="text-[11px] text-slate-400 dark:text-zinc-500">
                    {item.desc}
                  </p>
                </div>
                <Bug className={`w-5 h-5 opacity-40 ${isSelected ? 'text-[#FFDE77] opacity-80' : 'text-slate-300 dark:text-zinc-600'}`} />
              </button>
            );
          })}
        </div>
        {errors.nuisibles && (
          <p className="mt-2 text-xs font-medium text-red-500" role="alert">
            {errors.nuisibles}
          </p>
        )}
      </div>
    </div>
  );
}

