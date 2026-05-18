import Link from 'next/link';
import { FileText, Shield, ArrowRight, Sparkles, ShieldCheck, Building2 } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-between relative overflow-hidden">
      {/* Background Decorative Glowing Orbs */}
      <div className="absolute top-0 -left-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 -right-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header Bar */}
      <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md relative z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="font-bold text-lg tracking-wide text-white">Bio<span className="text-emerald-400">Control</span></span>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">Anti-Nuisibles Pro</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span>Prototype v1.0.0</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-12 relative z-10 max-w-4xl mx-auto w-full">
        {/* Title Block */}
        <div className="text-center mb-12 space-y-4">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white">
            Portail de Service &amp; <br className="hidden md:inline" />
            <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-blue-400 bg-clip-text text-transparent">
              Gestion de Dossiers
            </span>
          </h1>
          <p className="text-slate-400 max-w-xl mx-auto text-sm md:text-base">
            Bienvenue sur le hub BioControl. Choisissez votre espace ci-dessous pour soumettre une demande de désinfection ou accéder au suivi administratif.
          </p>
        </div>

        {/* Navigation Cards Grid */}
        <div className="grid md:grid-cols-2 gap-8 w-full">
          {/* Card 1: Client Devis Form */}
          <Link href="/devis" className="group">
            <div className="h-full border border-slate-800 bg-slate-950/40 hover:bg-slate-950/80 hover:border-emerald-500/40 rounded-2xl p-8 transition-all duration-300 hover:shadow-[0_0_30px_-5px_rgba(16,185,129,0.15)] flex flex-col justify-between gap-8 cursor-pointer relative overflow-hidden backdrop-blur-sm">
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl group-hover:bg-emerald-500/10 transition-colors duration-300"></div>
              
              <div className="space-y-4 relative z-10">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <FileText className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors duration-300">
                  Demande de Devis Public
                </h2>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Accédez au formulaire intelligent en 3 étapes pour estimer votre surface, sélectionner vos nuisibles (rats, cafards, punaises...) et demander une intervention.
                </p>
              </div>

              <div className="flex items-center gap-2 text-sm font-semibold text-emerald-400 group-hover:translate-x-2 transition-transform duration-300 relative z-10">
                <span>Remplir le formulaire</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </Link>

          {/* Card 2: Admin Dashboard */}
          <Link href="/admin" className="group">
            <div className="h-full border border-slate-800 bg-slate-950/40 hover:bg-slate-950/80 hover:border-blue-500/40 rounded-2xl p-8 transition-all duration-300 hover:shadow-[0_0_30px_-5px_rgba(59,130,246,0.15)] flex flex-col justify-between gap-8 cursor-pointer relative overflow-hidden backdrop-blur-sm">
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-xl group-hover:bg-blue-500/10 transition-colors duration-300"></div>
              
              <div className="space-y-4 relative z-10">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Shield className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors duration-300">
                  Espace Administration
                </h2>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Portail sécurisé pour le personnel de l'agence. Suivez, qualifiez et changez le statut des demandes en direct. Statistiques de charge et exports CSV inclus.
                </p>
              </div>

              <div className="flex items-center gap-2 text-sm font-semibold text-blue-400 group-hover:translate-x-2 transition-transform duration-300 relative z-10">
                <span>Accéder au back-office</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/60 py-6 text-center text-xs text-slate-500 bg-slate-950/30 relative z-10">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} BioControl Inc. Tous droits réservés.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-300 transition-colors cursor-pointer">Sécurité RLS active</span>
            <span className="hover:text-slate-300 transition-colors cursor-pointer">Rate-limiting activé</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
