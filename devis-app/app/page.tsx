import Link from 'next/link';
import { FileText, Shield, ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between relative overflow-hidden font-sans">
      {/* Background Decorative Glowing Orbs */}
      <div className="absolute top-0 -left-40 w-[500px] h-[500px] bg-[#FFDE77]/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 -right-40 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header Bar */}
      <header className="border-b border-slate-900 bg-slate-950/60 backdrop-blur-md relative z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Real Brand Logo from public/images/logo.png */}
            <div className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-slate-900 border border-slate-800 p-1">
              <img 
                src="/images/logo.png" 
                alt="BioControl Logo" 
                className="w-full h-full object-contain"
                onError={(e) => {
                  // Fallback if logo fails to load
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-wide text-white">
                Bio<span className="text-[#FFDE77]">Control</span>
              </span>
              <p className="text-[9px] text-slate-400 uppercase tracking-widest font-bold">Anti-Nuisibles Pro</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full bg-[#FFDE77]/10 text-[#FFDE77] border border-[#FFDE77]/20">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span>Prototype v1.0.0</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-12 md:py-20 relative z-10 max-w-5xl mx-auto w-full">
        {/* Centered Large Logo and Brand Title Block */}
        <div className="text-center mb-16 space-y-6">
          <div className="inline-flex items-center justify-center p-4 bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 rounded-3xl shadow-xl mb-4">
            <img 
              src="/images/logo.png" 
              alt="BioControl Logo" 
              className="w-20 h-20 object-contain"
            />
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
            Portail de Service &amp; <br />
            <span className="bg-gradient-to-r from-[#FFDE77] via-amber-200 to-[#FFDE77] bg-clip-text text-transparent">
              Gestion de Dossiers
            </span>
          </h1>
          <p className="text-slate-400 max-w-xl mx-auto text-sm md:text-base font-medium">
            Bienvenue sur le hub professionnel BioControl. Sélectionnez votre espace ci-dessous pour soumettre une demande ou accéder au portail d'administration.
          </p>
        </div>

        {/* Elegant Navigation Cards Grid */}
        <div className="grid md:grid-cols-2 gap-8 w-full max-w-4xl">
          {/* Card 1: Client Devis Form */}
          <Link href="/devis" className="group h-full">
            <div className="h-full border border-slate-900 bg-slate-950/40 hover:bg-slate-900/40 hover:border-[#FFDE77]/40 rounded-2xl p-8 transition-all duration-300 hover:shadow-[0_0_40px_-10px_rgba(255,222,119,0.15)] flex flex-col justify-between gap-8 cursor-pointer relative overflow-hidden backdrop-blur-sm">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFDE77]/2 rounded-full blur-2xl group-hover:bg-[#FFDE77]/5 transition-colors duration-300"></div>
              
              <div className="space-y-4 relative z-10">
                <div className="w-12 h-12 rounded-xl bg-[#FFDE77]/10 border border-[#FFDE77]/20 text-[#FFDE77] flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <FileText className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold text-white group-hover:text-[#FFDE77] transition-colors duration-300">
                  Formulaire de Devis
                </h2>
                <p className="text-slate-400 text-sm leading-relaxed font-medium">
                  Accédez à notre formulaire d'estimation intelligent en 3 étapes. Renseignez la surface de vos locaux, sélectionnez les nuisibles et obtenez un chiffrage d'intervention adapté.
                </p>
              </div>

              {/* Action Button styled with brand color */}
              <div className="w-full py-3 px-5 rounded-xl bg-[#FFDE77] text-slate-950 font-bold flex items-center justify-between group-hover:bg-amber-300 transition-colors duration-300 relative z-10 shadow-lg shadow-amber-500/10">
                <span className="text-sm">Remplir le formulaire</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </div>
            </div>
          </Link>

          {/* Card 2: Admin Dashboard */}
          <Link href="/admin" className="group h-full">
            <div className="h-full border border-slate-900 bg-slate-950/40 hover:bg-slate-900/40 hover:border-[#FFDE77]/40 rounded-2xl p-8 transition-all duration-300 hover:shadow-[0_0_40px_-10px_rgba(255,222,119,0.15)] flex flex-col justify-between gap-8 cursor-pointer relative overflow-hidden backdrop-blur-sm">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/2 rounded-full blur-2xl group-hover:bg-amber-500/5 transition-colors duration-300"></div>
              
              <div className="space-y-4 relative z-10">
                <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 text-[#FFDE77] flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Shield className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold text-white group-hover:text-[#FFDE77] transition-colors duration-300">
                  Espace Administration
                </h2>
                <p className="text-slate-400 text-sm leading-relaxed font-medium">
                  Portail de gestion des dossiers de devis réservé au personnel administratif. Suivi des dossiers, changement de statut, filtres de recherche avancés et exports Excel.
                </p>
              </div>

              {/* Action Button styled as a sophisticated transparent border button */}
              <div className="w-full py-3 px-5 rounded-xl border border-[#FFDE77]/30 text-[#FFDE77] font-bold flex items-center justify-between group-hover:bg-[#FFDE77]/10 group-hover:border-[#FFDE77]/50 transition-all duration-300 relative z-10">
                <span className="text-sm">Accéder au back-office</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </div>
            </div>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900/60 py-6 text-center text-xs text-slate-500 bg-slate-950 relative z-10">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-medium">© {new Date().getFullYear()} BioControl. Tous droits réservés.</p>
          <div className="flex items-center gap-6 font-medium">
            <span className="hover:text-[#FFDE77] transition-colors cursor-pointer">Sécurité RLS active</span>
            <span className="hover:text-[#FFDE77] transition-colors cursor-pointer">Rate-limiting activé</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
