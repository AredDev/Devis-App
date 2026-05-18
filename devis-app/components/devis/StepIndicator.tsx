import React from 'react';
import { Check } from 'lucide-react';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

const STEPS = [
  { number: 1, label: 'Établissement & Nuisibles', desc: 'Vos besoins' },
  { number: 2, label: 'Urgence & Message', desc: 'Niveau d\'urgence' },
  { number: 3, label: 'Vos Coordonnées', desc: 'Vos contacts' },
];

export default function StepIndicator({ currentStep, totalSteps }: StepIndicatorProps) {
  return (
    <div className="w-full py-4 mb-8">
      {/* Mobile Indicator */}
      <div className="flex items-center justify-between sm:hidden px-4">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Étape {currentStep} sur {totalSteps}
        </span>
        <span className="text-sm font-bold text-[#443C34]">
          {STEPS[currentStep - 1].label}
        </span>
      </div>

      {/* Desktop Stepper */}
      <div className="hidden sm:flex items-center justify-between relative">
        {/* Connecting line */}
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-100 dark:bg-zinc-800 -translate-y-1/2 z-0" />
        
        {/* Active progress line */}
        <div 
          className="absolute top-1/2 left-0 h-0.5 bg-[#FFDE77] -translate-y-1/2 transition-all duration-500 ease-in-out z-0"
          style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
        />

        {STEPS.map((step, idx) => {
          const isCompleted = currentStep > step.number;
          const isActive = currentStep === step.number;
          const isPending = currentStep < step.number;

          return (
            <div key={step.number} className="flex flex-col items-center relative z-10 w-1/3">
              {/* Step Circle */}
              <div 
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-500 shadow-md ${
                  isCompleted 
                    ? 'bg-[#FFDE77] text-[#443C34] ring-4 ring-[#FFDE77]/20' 
                    : isActive 
                    ? 'bg-white dark:bg-zinc-900 border-2 border-[#FFDE77] text-[#443C34] ring-4 ring-[#FFDE77]/10 scale-110' 
                    : 'bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-slate-400'
                }`}
                aria-current={isActive ? 'step' : undefined}
              >
                {isCompleted ? (
                  <Check className="w-5 h-5 stroke-[3]" />
                ) : (
                  <span>{step.number}</span>
                )}
              </div>

              {/* Step labels */}
              <div className="mt-2 text-center">
                <p className={`text-xs font-semibold tracking-wide transition-colors duration-300 ${
                  isActive 
                    ? 'text-[#443C34] font-bold' 
                    : isCompleted 
                    ? 'text-slate-700 dark:text-zinc-300 font-medium' 
                    : 'text-slate-400'
                }`}>
                  {step.label}
                </p>
                <p className="text-[10px] text-slate-400 dark:text-zinc-500 uppercase tracking-wider mt-0.5">
                  {step.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

