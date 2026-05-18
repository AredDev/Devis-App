import Link from 'next/link';
import Image from 'next/image';
import { FileText, Shield, ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="bg-[#FBFBFB] text-gray-900 flex flex-col font-sans">

      {/* Header */}
      <header className="border-b border-gray-200 px-6 sm:px-16 md:px-24 lg:px-48 py-4 flex justify-center sm:justify-start">
        <Image src="/images/logo.png" alt="Logo" width={180} height={54} className="object-contain" />
      </header>

      {/* Main */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 sm:px-12 md:px-24 py-8 md:py-12">
        <span className="bg-white text-black text-sm md:text-base font-semibold px-6 md:px-8 py-1.5 md:py-2 rounded-full mb-6 border border-gray-150 shadow-xs">
          Anti-nuisible
        </span>
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-center leading-tight mb-4">
          Portail de Service &amp; <span className="text-[#FFDE77]">Gestion de Dossiers</span>
        </h1>
        <p className="text-gray-500 text-center max-w-2xl mb-8 md:mb-12 leading-relaxed text-sm md:text-base px-2">
          Bienvenue sur le hub DevisApp. Choisissez votre espace ci-dessous pour soumettre une demande de désinfection ou accéder au suivi administratif.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-4xl">

          {/* Carte Devis */}
          <Link href="/devis" className="border-2 border-[#FFDE77] rounded-2xl p-6 md:p-8 flex flex-col gap-4 md:gap-5 hover:shadow-md transition-all duration-200 bg-white">
            <div className="flex items-center justify-center h-16">
              <FileText className="w-10 h-10 text-gray-300" />
            </div>
            <h2 className="font-medium text-lg text-center sm:text-left">Demande de Devis Public</h2>
            <p className="text-sm text-gray-500 leading-relaxed flex-1 text-center sm:text-left">
              Accédez au formulaire intelligent en 3 étapes pour estimer votre surface, sélectionner vos nuisibles (rats, cafards, punaises...) et demander une intervention.
            </p>
            <div className="flex items-center gap-2 text-sm font-medium bg-[#FFDE77] text-[#7a6200] px-4 py-2 rounded-lg w-fit mx-auto sm:mx-0">
              Remplir le formulaire <ArrowRight className="w-4 h-4" />
            </div>
          </Link>

          {/* Carte Admin */}
          <Link href="/admin" className="border-2 border-[#FFDE77] rounded-2xl p-6 md:p-8 flex flex-col gap-4 md:gap-5 hover:shadow-md transition-all duration-200 bg-white">
            <div className="flex items-center justify-center h-16">
              <Shield className="w-10 h-10 text-gray-300" />
            </div>
            <h2 className="font-medium text-lg text-center sm:text-left">Espace Administration</h2>
            <p className="text-sm text-gray-500 leading-relaxed flex-1 text-center sm:text-left">
              Portail sécurisé pour le personnel de l'agence. Suivez, qualifiez et changez le statut des demandes en direct. Statistiques de charge et exports CSV inclus.
            </p>
            <div className="flex items-center gap-2 text-sm font-medium bg-[#FFDE77] text-[#7a6200] px-4 py-2 rounded-lg w-fit mx-auto sm:mx-0">
              Se connecter <ArrowRight className="w-4 h-4" />
            </div>
          </Link>

        </div>
      </main>

    </div>
  );
}