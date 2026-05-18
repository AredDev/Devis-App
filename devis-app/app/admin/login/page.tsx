'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, KeyRound, Loader2, AlertCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function AdminLoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setError('Veuillez saisir le mot de passe.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Identifiants invalides.');
      }

      // Redirect to the protected admin area
      router.push('/admin');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Impossible de vous connecter. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 min-h-screen bg-[#FBFBFB] flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
      {/* Back to public link */}
      <Link
        href="/devis"
        className="absolute top-6 left-6 inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors duration-200"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Retour au formulaire public</span>
      </Link>

      <div className="max-w-md w-full space-y-8">
        <div className="text-center space-y-3">
          <div className="inline-flex bg-[#FFDE77] p-3.5 rounded-full text-[#443C34] shadow-lg shadow-[#FFDE77]/20">
            <Shield className="w-8 h-8" />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Portail Back-Office
          </h2>
          <p className="text-sm text-slate-500">
            Réservé aux techniciens et administrateurs autorisés.
          </p>
        </div>

        <div className="bg-white border border-slate-200/50 rounded-3xl p-8 shadow-xl shadow-slate-100/50 space-y-6">
          {error && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 flex items-start gap-2.5 text-sm">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-1.5">
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-slate-700"
              >
                Mot de passe d'administration <span className="text-red-500">*</span>
              </label>
              <div className="relative rounded-lg shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                  <KeyRound className="w-5 h-5 text-slate-400" />
                </div>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  autoFocus
                  required
                  className="block w-full rounded-xl border border-slate-200 p-3.5 pl-11 text-sm focus:outline-none focus:border-[#FFDE77] focus:ring-2 focus:ring-[#FFDE77]/20 transition-all duration-300 bg-white placeholder-slate-300"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#FFDE77] text-[#443C34] hover:shadow-md transition-all duration-300 font-extrabold text-sm cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Connexion en cours...</span>
                </>
              ) : (
                <span>S'authentifier</span>
              )}
            </button>
          </form>
        </div>

        <div className="text-center text-[10px] text-slate-400">
          Clé de démonstration par défaut : <code className="font-mono bg-slate-100 px-1 rounded">AdminPestControl2026!</code>
        </div>
      </div>
    </div>
  );
}

