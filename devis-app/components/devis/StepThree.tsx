import React from 'react';
import { User, Mail, Phone } from 'lucide-react';

interface StepThreeProps {
  formData: {
    nom: string;
    email: string;
    telephone: string;
  };
  onChange: (fields: Partial<{
    nom: string;
    email: string;
    telephone: string;
  }>) => void;
  errors: Record<string, string>;
}

export default function StepThree({ formData, onChange, errors }: StepThreeProps) {
  return (
    <div className="space-y-6">
      {/* Contact Name */}
      <div>
        <label htmlFor="nom" className="block text-sm font-semibold text-slate-700 dark:text-zinc-300 mb-1.5">
          Nom complet du contact <span className="text-red-500">*</span>
        </label>
        <div className="relative rounded-lg shadow-sm">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
            <User className="w-5 h-5 text-slate-400 dark:text-zinc-500" />
          </div>
          <input
            type="text"
            id="nom"
            name="nom"
            value={formData.nom}
            onChange={(e) => onChange({ nom: e.target.value })}
            placeholder="Ex: Jean Dupont"
            className={`block w-full rounded-xl border p-3.5 pl-11 text-sm focus:outline-none focus:ring-2 transition-all duration-300 bg-white dark:bg-zinc-900 ${
              errors.nom
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                : 'border-slate-200 dark:border-zinc-800 focus:border-emerald-500 focus:ring-emerald-500/20'
            }`}
          />
        </div>
        {errors.nom && (
          <p className="mt-2 text-xs font-medium text-red-500" role="alert">
            {errors.nom}
          </p>
        )}
      </div>

      {/* Email Address */}
      <div>
        <label htmlFor="email" className="block text-sm font-semibold text-slate-700 dark:text-zinc-300 mb-1.5">
          Adresse email <span className="text-red-500">*</span>
        </label>
        <div className="relative rounded-lg shadow-sm">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
            <Mail className="w-5 h-5 text-slate-400 dark:text-zinc-500" />
          </div>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={(e) => onChange({ email: e.target.value })}
            placeholder="Ex: jean.dupont@exemple.fr"
            className={`block w-full rounded-xl border p-3.5 pl-11 text-sm focus:outline-none focus:ring-2 transition-all duration-300 bg-white dark:bg-zinc-900 ${
              errors.email
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                : 'border-slate-200 dark:border-zinc-800 focus:border-emerald-500 focus:ring-emerald-500/20'
            }`}
          />
        </div>
        {errors.email && (
          <p className="mt-2 text-xs font-medium text-red-500" role="alert">
            {errors.email}
          </p>
        )}
      </div>

      {/* Phone Number */}
      <div>
        <label htmlFor="telephone" className="block text-sm font-semibold text-slate-700 dark:text-zinc-300 mb-1.5">
          Numéro de téléphone <span className="text-red-500">*</span>
        </label>
        <div className="relative rounded-lg shadow-sm">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
            <Phone className="w-5 h-5 text-slate-400 dark:text-zinc-500" />
          </div>
          <input
            type="tel"
            id="telephone"
            name="telephone"
            value={formData.telephone}
            onChange={(e) => onChange({ telephone: e.target.value })}
            placeholder="Ex: 06 12 34 56 78 ou +33 6 12 34 56 78"
            className={`block w-full rounded-xl border p-3.5 pl-11 text-sm focus:outline-none focus:ring-2 transition-all duration-300 bg-white dark:bg-zinc-900 ${
              errors.telephone
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                : 'border-slate-200 dark:border-zinc-800 focus:border-emerald-500 focus:ring-emerald-500/20'
            }`}
          />
        </div>
        <p className="mt-1 text-[11px] text-slate-400 dark:text-zinc-500">
          Format de téléphone français valide requis.
        </p>
        {errors.telephone && (
          <p className="mt-2 text-xs font-medium text-red-500" role="alert">
            {errors.telephone}
          </p>
        )}
      </div>
    </div>
  );
}
