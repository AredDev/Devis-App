import React, { useState } from 'react';
import { CheckCircle2, Copy, Check, Calendar, PhoneCall, ShieldCheck } from 'lucide-react';

interface FormSuccessProps {
  uuid: string;
  onReset: () => void;
}

export default function FormSuccess({ uuid, onReset }: FormSuccessProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(uuid);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="text-center py-8 space-y-6">
      {/* Animated Glowing Icon */}
      <div className="flex justify-center relative">
        <div className="absolute inset-0 bg-[#FFDE77]/10 rounded-full blur-xl w-24 h-24 mx-auto animate-pulse" />
        <div className="relative bg-[#FFDE77] rounded-full p-4 text-[#443C34] shadow-lg shadow-[#FFDE77]/25">
          <CheckCircle2 className="w-12 h-12 stroke-[2.5]" />
        </div>
      </div>

      {/* Success Title */}
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-slate-800">
          Demande reçue avec succès !
        </h2>
        <p className="text-sm text-slate-500 max-w-md mx-auto">
          Votre demande de devis a été enregistrée et transmise à nos techniciens. Un expert étudie votre dossier immédiatement.
        </p>
      </div>

      {/* UUID Card */}
      <div className="max-w-md mx-auto bg-slate-50 border border-slate-100 rounded-2xl p-4 flex items-center justify-between gap-3 shadow-inner">
        <div className="text-left flex-1 min-w-0">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Référence de votre dossier (UUID)
          </span>
          <p className="text-xs font-mono text-slate-600 select-all truncate mt-0.5">
            {uuid}
          </p>
        </div>
        <button
          type="button"
          onClick={copyToClipboard}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all duration-300 cursor-pointer ${
            copied
              ? 'bg-[#FFDE77] border-[#FFDE77] text-[#443C34] shadow-md font-bold'
              : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:shadow-sm'
          }`}
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 stroke-[3]" />
              <span>Copié !</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copier</span>
            </>
          )}
        </button>
      </div>

      {/* Detailed Steps Recap */}
      <div className="max-w-md mx-auto text-left grid grid-cols-1 gap-3.5 pt-4">
        <div className="flex items-start gap-3">
          <div className="bg-[#FFDE77]/20 text-[#443C34] p-2 rounded-lg mt-0.5">
            <PhoneCall className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-700">
              Prise de contact rapide
            </h4>
            <p className="text-xs text-slate-400">
              Nos experts vous rappellent sous 2 heures (en jour ouvrable) pour affiner les détails techniques.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="bg-[#FFDE77]/20 text-[#443C34] p-2 rounded-lg mt-0.5">
            <Calendar className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-700">
              Intervention sur site
            </h4>
            <p className="text-xs text-slate-400">
              Planification d'un passage selon votre degré d'urgence (intervention sous 24h disponible).
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="bg-[#FFDE77]/20 text-[#443C34] p-2 rounded-lg mt-0.5">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-700">
              Garantie et sécurité
            </h4>
            <p className="text-xs text-slate-400">
              Toutes nos interventions sont certifiées Certibiocide et respectent les normes environnementales.
            </p>
          </div>
        </div>
      </div>

      {/* Primary Action Button */}
      <div className="pt-6 border-t border-slate-100">
        <button
          type="button"
          onClick={onReset}
          className="px-6 py-2.5 rounded-xl text-sm font-bold bg-[#FFDE77] text-[#443C34] transition-all duration-300 hover:shadow-md cursor-pointer"
        >
          Faire une autre demande
        </button>
      </div>
    </div>
  );
}

