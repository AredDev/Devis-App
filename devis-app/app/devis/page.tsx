'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, CheckCircle2, ShieldAlert, Loader2, Sparkles, Lock } from 'lucide-react';
import StepIndicator from '../../components/devis/StepIndicator';
import StepOne from '../../components/devis/StepOne';
import StepTwo from '../../components/devis/StepTwo';
import StepThree from '../../components/devis/StepThree';
import FormSuccess from '../../components/devis/FormSuccess';
import { Etablissement, Nuisible, Urgence } from '../../types/devis';
import {
  etablissementSchema,
  surfaceSchema,
  nuisiblesSchema,
  urgenceSchema,
  messageSchema,
  nomSchema,
  emailSchema,
  telephoneSchema,
} from '../../lib/validators';
import { z } from 'zod';

const INITIAL_FORM_STATE = {
  etablissement: '' as Etablissement | '',
  surface: '' as number | '',
  nuisibles: [] as Nuisible[],
  urgence: '' as Urgence | '',
  message: '',
  nom: '',
  email: '',
  telephone: '',
};

export default function DevisPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [successUuid, setSuccessUuid] = useState<string | null>(null);

  const handleFieldChange = (fields: Partial<typeof formData>) => {
    setFormData((prev) => ({ ...prev, ...fields }));
    // Clear field-specific error as user types
    const keys = Object.keys(fields);
    if (keys.length > 0) {
      setErrors((prev) => {
        const next = { ...prev };
        keys.forEach((k) => delete next[k]);
        return next;
      });
    }
  };

  const validateStep = (stepNumber: number): boolean => {
    setSubmitError(null);
    let result;

    if (stepNumber === 1) {
      result = z
        .object({
          etablissement: etablissementSchema,
          surface: surfaceSchema,
          nuisibles: nuisiblesSchema,
        })
        .safeParse({
          etablissement: formData.etablissement,
          surface: formData.surface,
          nuisibles: formData.nuisibles,
        });
    } else if (stepNumber === 2) {
      result = z
        .object({
          urgence: urgenceSchema,
          message: messageSchema,
        })
        .safeParse({
          urgence: formData.urgence,
          message: formData.message,
        });
    } else if (stepNumber === 3) {
      result = z
        .object({
          nom: nomSchema,
          email: emailSchema,
          telephone: telephoneSchema,
        })
        .safeParse({
          nom: formData.nom,
          email: formData.email,
          telephone: formData.telephone,
        });
    }

    if (result && !result.success) {
      const formattedErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          formattedErrors[issue.path[0] as string] = issue.message;
        }
      });
      setErrors(formattedErrors);
      return false;
    }

    setErrors({});
    return true;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    setSubmitError(null);
    setStep((prev) => prev - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(3)) return;

    setLoading(true);
    setSubmitError(null);

    try {
      const response = await fetch('/api/devis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Une erreur est survenue lors de la soumission.');
      }

      setSuccessUuid(data.id);
      setStep(4); // Success step
    } catch (err: any) {
      setSubmitError(err.message || 'Impossible de soumettre votre demande. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData(INITIAL_FORM_STATE);
    setErrors({});
    setSubmitError(null);
    setSuccessUuid(null);
    setStep(1);
  };

  return (
    <div className="flex-1 min-h-screen bg-[#FBFBFB] py-12 px-4 sm:px-6 lg:px-8 font-sans">
      {/* Back to Portal Hub */}
      <div className="max-w-3xl mx-auto flex justify-start mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors duration-200"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Retour à l'accueil</span>
        </Link>
      </div>

      {/* Header Info */}
      <div className="max-w-3xl mx-auto text-center mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFDE77]/20 text-[#443C34] text-xs font-bold uppercase tracking-wider mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Services de Désinfection Pro</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Demande de Devis Anti-Nuisibles
        </h1>
        <p className="mt-2 text-sm sm:text-base text-slate-500">
          Recevez une estimation précise et planifiez votre intervention en quelques clics.
        </p>
      </div>

      {/* Main card */}
      <div className="max-w-2xl mx-auto bg-white border border-slate-200/50 rounded-3xl shadow-xl shadow-slate-100/50 overflow-hidden transition-all duration-300">
        {step < 4 && (
          <div className="px-6 py-4 bg-slate-50/50 border-b border-slate-100">
            <StepIndicator currentStep={step} totalSteps={3} />
          </div>
        )}

        <div className="p-6 sm:p-8">
          {submitError && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" />
              <div className="text-sm">
                <span className="font-bold">Erreur de soumission :</span> {submitError}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            {/* Step Content */}
            {step === 1 && (
              <StepOne
                formData={formData}
                onChange={handleFieldChange}
                errors={errors}
              />
            )}
            
            {step === 2 && (
              <StepTwo
                formData={formData}
                onChange={handleFieldChange}
                errors={errors}
              />
            )}

            {step === 3 && (
              <StepThree
                formData={formData}
                onChange={handleFieldChange}
                errors={errors}
              />
            )}

            {step === 4 && successUuid && (
              <FormSuccess uuid={successUuid} onReset={handleReset} />
            )}

            {/* Stepper Actions */}
            {step < 4 && (
              <div className="mt-8 pt-6 border-t border-slate-100 flex justify-between gap-4">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={handlePrev}
                    disabled={loading}
                    className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 hover:border-slate-300 transition-all duration-300 font-semibold text-sm disabled:opacity-50 cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Retour</span>
                  </button>
                ) : (
                  <div /> // Placeholder to align next button to the right
                )}

                {step < 3 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition-all duration-300 font-bold text-sm shadow-md cursor-pointer ml-auto"
                  >
                    <span>Continuer</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#FFDE77] text-[#443C34] hover:shadow-lg hover:shadow-[#FFDE77]/25 transition-all duration-300 font-extrabold text-sm shadow-md disabled:opacity-50 cursor-pointer ml-auto"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin animate-pulse" />
                        <span>Transmission...</span>
                      </>
                    ) : (
                      <>
                        <span>Valider ma demande</span>
                        <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                      </>
                    )}
                  </button>
                )}
              </div>
            )}
          </form>
        </div>
      </div>

      {/* Safety Notice Footer */}
      <div className="max-w-md mx-auto text-center mt-6 text-[10px] text-slate-400 flex items-center justify-center gap-1.5">
        <Lock className="w-3.5 h-3.5 text-slate-400" />
        <span>Vos données de contact sont cryptées et traitées conformément au RGPD.</span>
      </div>
    </div>
  );
}

