'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { 
  Shield, 
  LogOut, 
  FileSpreadsheet, 
  TrendingUp, 
  Clock, 
  Inbox, 
  Loader2, 
  AlertCircle, 
  X,
  Calendar,
  User,
  Mail,
  Phone,
  LayoutGrid,
  Bug,
  Sparkles,
  ClipboardList,
  Check,
  FileText,
  ShieldCheck
} from 'lucide-react';
import SearchBar from '../../components/admin/SearchBar';
import StatusFilter from '../../components/admin/StatusFilter';
import DevisTable from '../../components/admin/DevisTable';
import { Devis, Statut } from '../../types/devis';

export default function AdminDashboardPage() {
  const [devisList, setDevisList] = useState<Devis[]>([]);
  const [stats24h, setStats24h] = useState(0);
  const [activeFilter, setActiveFilter] = useState<Statut | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDevis, setSelectedDevis] = useState<Devis | null>(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const router = useRouter();

  // Fetch all devis requests from the API
  const fetchDevis = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/admin/devis', {
        method: 'GET',
      });

      if (!response.ok) {
        if (response.status === 401) {
          router.push('/admin/login');
          return;
        }
        const data = await response.json();
        throw new Error(data.error || 'Impossible de récupérer les devis.');
      }

      const data = await response.json();
      setDevisList(data.devis || []);
      setStats24h(data.stats24h || 0);
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue lors de la récupération des données.');
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchDevis();
  }, [fetchDevis]);

  // Handle status update (PATCH)
  const handleStatusChange = async (id: string, newStatus: Statut) => {
    try {
      const response = await fetch(`/api/admin/devis/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ statut: newStatus }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Erreur lors de la mise à jour.');
      }

      // Update local state immediately for snappy UX
      setDevisList((prev) =>
        prev.map((item) => (item.id === id ? { ...item, statut: newStatus } : item))
      );

      // If selected devis is open, update details modal
      if (selectedDevis && selectedDevis.id === id) {
        setSelectedDevis((prev) => prev ? { ...prev, statut: newStatus } : null);
      }
    } catch (err: any) {
      alert(err.message || 'Impossible de mettre à jour le statut.');
    }
  };

  // Log out handler
  const handleLogout = async () => {
    try {
      const response = await fetch('/api/admin/logout', { method: 'POST' });
      if (response.ok) {
        router.push('/');
        router.refresh();
      }
    } catch {
      alert('Erreur lors de la déconnexion.');
    }
  };

  // Compute stats counts in memory
  const counts = useMemo(() => {
    const all = devisList.length;
    const nouveau = devisList.filter((d) => d.statut === 'nouveau').length;
    const traite = devisList.filter((d) => d.statut === 'traite').length;
    const archive = devisList.filter((d) => d.statut === 'archive').length;
    return { all, nouveau, traite, archive };
  }, [devisList]);

  // Filter & Search devis list in memory
  const filteredDevis = useMemo(() => {
    return devisList.filter((item) => {
      // 1. Filter by Status Tab
      const matchesStatus = activeFilter === 'all' || item.statut === activeFilter;

      // 2. Filter by Search Query (Name or Email)
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        item.nom.toLowerCase().includes(query) ||
        item.email.toLowerCase().includes(query);

      return matchesStatus && matchesSearch;
    });
  }, [devisList, activeFilter, searchQuery]);

  // Exporter en CSV (Bonus Feature!)
  const exportToCSV = () => {
    if (filteredDevis.length === 0) return;

    // Header row
    const headers = [
      'ID',
      'Date Création',
      'Établissement',
      'Surface (m2)',
      'Nuisibles',
      'Urgence',
      'Nom Contact',
      'Email',
      'Téléphone',
      'Statut',
      'Message',
      'Adresse IP'
    ];

    // Data rows
    const rows = filteredDevis.map((item) => [
      item.id,
      item.created_at,
      item.etablissement,
      item.surface,
      item.nuisibles.join('; '),
      item.urgence,
      `"${item.nom.replace(/"/g, '""')}"`,
      item.email,
      item.telephone,
      item.statut,
      `"${(item.message || '').replace(/"/g, '""')}"`,
      item.ip_address
    ]);

    // Build CSV Content
    const csvContent = '\uFEFF' // UTF-8 BOM for Excel french compatibility
      + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    // Create and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `devis_export_${activeFilter}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="flex-1 bg-[#FBFBFB] flex flex-col font-sans">
      {/* Top Navigation Bar */}
      <nav className="bg-white border-b border-slate-200/50 px-4 sm:px-6 lg:px-48 py-3 flex items-center justify-between sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-3">
          <Image src="/images/logo.png" alt="Logo" width={140} height={42} className="object-contain" />
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#FFDE77]/20 text-[#443C34] uppercase tracking-wider">
            Admin
          </span>
        </div>

        <button
          type="button"
          onClick={() => setShowLogoutConfirm(true)}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-800 text-xs font-semibold text-slate-600 dark:text-zinc-400 hover:bg-red-50 hover:text-red-600 hover:border-red-200 dark:hover:bg-red-950/20 dark:hover:text-red-400 dark:hover:border-red-900/50 transition-all duration-300 cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Déconnexion</span>
        </button>
      </nav>

      {/* Dashboard Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        
        {/* Statistics Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1: Total requests */}
          <div className="bg-white dark:bg-zinc-950 border border-slate-200/50 dark:border-zinc-900 rounded-3xl p-5 flex items-center gap-4 shadow-sm">
            <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-zinc-900 text-slate-700 dark:text-zinc-300">
              <Inbox className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-slate-400 dark:text-zinc-500 font-semibold block uppercase tracking-wider">
                Total Demandes
              </span>
              <span className="text-2xl font-bold text-slate-900 dark:text-white">
                {loading ? '...' : counts.all}
              </span>
            </div>
          </div>

          {/* Card 2: Nouveau requests */}
          <div className="bg-white dark:bg-zinc-950 border border-slate-200/50 dark:border-zinc-900 rounded-3xl p-5 flex items-center gap-4 shadow-sm">
            <div className="p-3.5 rounded-2xl bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400">
              <ClipboardList className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-slate-400 dark:text-zinc-500 font-semibold block uppercase tracking-wider">
                Nouvelles demandes
              </span>
              <span className="text-2xl font-bold text-slate-900 dark:text-white">
                {loading ? '...' : counts.nouveau}
              </span>
            </div>
          </div>

          {/* Card 3: 24h Activity Load (Bonus Feature!) */}
          <div className="bg-white dark:bg-zinc-950 border border-slate-200/50 dark:border-zinc-900 rounded-3xl p-5 flex items-center gap-4 shadow-sm relative overflow-hidden">
            <div className="p-3.5 rounded-2xl bg-[#FFDE77]/20 text-[#443C34]">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-slate-400 dark:text-zinc-500 font-semibold block uppercase tracking-wider flex items-center gap-1.5">
                <span>Activité 24h</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#FFDE77] animate-ping" />
              </span>
              <span className="text-2xl font-bold text-slate-900 dark:text-white">
                {loading ? '...' : stats24h}
              </span>
              <span className="text-[10px] text-slate-400 dark:text-zinc-500 block mt-0.5">
                demandes reçues ces dernières 24 heures
              </span>
            </div>
          </div>
        </div>

        {/* Dashboard Title & Actions header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4">
          <div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <span>Gestion des demandes</span>
              <span className="text-xs font-semibold px-2 py-0.5 bg-slate-200 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 rounded-md">
                {filteredDevis.length} affiché(s)
              </span>
            </h2>
            <p className="text-xs text-slate-400 dark:text-zinc-500">
              Visualisez, qualifiez et archivez les dossiers clients reçus.
            </p>
          </div>

          {filteredDevis.length > 0 && (
            <button
              type="button"
              onClick={exportToCSV}
              className="inline-flex items-center justify-center gap-1.5 px-4.5 py-2.5 rounded-xl bg-[#443C34] text-white text-xs font-bold transition-all duration-300 hover:shadow-md hover:bg-slate-800 cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Exporter en CSV</span>
            </button>
          )}
        </div>

        {/* Filters Controls Panel */}
        <div className="bg-white dark:bg-zinc-950 border border-slate-200/50 dark:border-zinc-900 rounded-3xl p-5 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 shadow-sm">
          <StatusFilter
            activeFilter={activeFilter}
            onChange={setActiveFilter}
            counts={counts}
          />
          <SearchBar
            value={searchQuery}
            onSearch={setSearchQuery}
          />
        </div>

        {/* Error notification block */}
        {error && (
          <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-400 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <div className="text-sm">
              <span className="font-bold">Une erreur est survenue :</span> {error}
              <button
                type="button"
                onClick={fetchDevis}
                className="block text-xs font-bold underline mt-1.5 hover:opacity-80"
              >
                Réessayer le chargement
              </button>
            </div>
          </div>
        )}

        {/* Data Table */}
        {loading ? (
          <div className="text-center py-20 bg-white border border-slate-200/50 rounded-3xl space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-[#FFDE77] mx-auto" />
            <p className="text-xs text-slate-400 font-semibold tracking-wide">
              Chargement sécurisé des dossiers...
            </p>
          </div>
        ) : (
          <DevisTable
            devis={filteredDevis}
            onStatusChange={handleStatusChange}
            onViewDetails={setSelectedDevis}
          />
        )}
      </main>

      {/* Details Modal Dialog */}
      {selectedDevis && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/55 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 dark:border-zinc-900 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-bold uppercase tracking-wider">
                  Détail du Dossier Client
                </span>
                <h3 className="text-base font-bold text-slate-800 dark:text-white truncate max-w-[280px]">
                  {selectedDevis.etablissement} — {selectedDevis.surface} m²
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedDevis(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-900 cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Scroll Content */}
            <div className="p-6 overflow-y-auto space-y-5 text-sm flex-1">
              
              {/* Reference & Date */}
              <div className="grid grid-cols-2 gap-4 bg-slate-50 dark:bg-zinc-900/50 p-3 rounded-2xl border border-slate-100/40 dark:border-zinc-800/40">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Date</span>
                  <span className="text-xs text-slate-700 dark:text-zinc-300 font-medium">
                    {formatDate(selectedDevis.created_at)}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">ID (UUID)</span>
                  <span className="text-[10px] text-slate-700 dark:text-zinc-300 font-mono truncate block select-all">
                    {selectedDevis.id}
                  </span>
                </div>
              </div>

              {/* Technical Specifications */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span>Détails Techniques</span>
                </h4>
                <div className="grid grid-cols-2 gap-3.5">
                  <div className="p-3 bg-white dark:bg-zinc-900 border border-slate-200/50 dark:border-zinc-850 rounded-xl">
                    <span className="text-[10px] font-medium text-slate-400 block">Niveau d'Urgence</span>
                    <span className="text-xs font-bold text-slate-800 dark:text-zinc-200 mt-0.5 inline-block">
                      {selectedDevis.urgence === '24h' ? (
                        <AlertCircle className="w-3.5 h-3.5 inline mr-1 text-red-500" />
                      ) : selectedDevis.urgence === 'annuel' ? (
                        <ShieldCheck className="w-3.5 h-3.5 inline mr-1 text-[#443C34]" />
                      ) : (
                        <FileText className="w-3.5 h-3.5 inline mr-1 text-slate-500" />
                      )}{' '}
                      {selectedDevis.urgence === '24h' 
                        ? 'Intervention <24h' 
                        : selectedDevis.urgence === 'annuel' 
                        ? 'Contrat Annuel' 
                        : 'Simple Devis'}
                    </span>
                  </div>
                  <div className="p-3 bg-white border border-slate-200/50 rounded-xl">
                    <span className="text-[10px] font-medium text-slate-400 block">Adresse IP demandeur</span>
                    <span className="text-[10px] font-mono text-slate-800 mt-1 inline-block select-all">
                      {selectedDevis.ip_address}
                    </span>
                  </div>
                </div>
              </div>

              {/* Nuisibles Targeted */}
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Bug className="w-3.5 h-3.5" />
                  <span>Nuisibles signalés ({selectedDevis.nuisibles.length})</span>
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedDevis.nuisibles.map((n) => (
                    <span 
                      key={n}
                      className="inline-flex items-center px-3 py-1 rounded-xl text-xs font-semibold bg-[#FFDE77]/20 text-[#443C34] border border-[#FFDE77]/30"
                    >
                      {n}
                    </span>
                  ))}
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-2 pt-1">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" />
                  <span>Informations de Contact</span>
                </h4>
                <div className="p-4 bg-slate-50/50 dark:bg-zinc-900/30 border border-slate-100 dark:border-zinc-900 rounded-2xl space-y-3 text-xs text-slate-700 dark:text-zinc-300">
                  <div className="flex items-center gap-2">
                    <span className="font-bold w-16 text-slate-400">Nom :</span>
                    <span className="font-bold text-slate-900 dark:text-white">{selectedDevis.nom}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold w-16 text-slate-400">Email :</span>
                    <a href={`mailto:${selectedDevis.email}`} className="text-[#443C34] hover:underline font-semibold select-all">
                      {selectedDevis.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold w-16 text-slate-400">Tél :</span>
                    <a href={`tel:${selectedDevis.telephone}`} className="text-slate-800 hover:underline font-semibold select-all">
                      {selectedDevis.telephone}
                    </a>
                  </div>
                </div>
              </div>

              {/* Free Text Message */}
              {selectedDevis.message && (
                <div className="space-y-1.5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Message libre du client
                  </h4>
                  <div className="p-4 bg-amber-50/30 border border-amber-100/50 rounded-2xl text-xs text-slate-600 italic whitespace-pre-wrap leading-relaxed shadow-inner">
                    "{selectedDevis.message}"
                  </div>
                </div>
              )}
            </div>

            {/* Modal Actions Footer */}
            <div className="p-5 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-3">
              <span className="text-xs text-slate-400 font-semibold">
                Statut actuel : {selectedDevis.statut.toUpperCase()}
              </span>
              <div className="flex items-center gap-2">
                {selectedDevis.statut === 'nouveau' && (
                  <>
                    <button
                      type="button"
                      onClick={() => handleStatusChange(selectedDevis.id, 'traite')}
                      className="px-4 py-2 rounded-xl bg-[#FFDE77] hover:bg-[#FFDE77]/80 text-[#443C34] text-xs font-bold shadow-md cursor-pointer transition-all flex items-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>Traiter</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleStatusChange(selectedDevis.id, 'archive')}
                      className="px-4 py-2 rounded-xl border border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400 bg-white dark:bg-zinc-900 hover:bg-slate-50 hover:text-slate-800 text-xs font-bold cursor-pointer transition-all"
                    >
                      Archiver
                    </button>
                  </>
                )}

                {selectedDevis.statut === 'traite' && (
                  <button
                    type="button"
                    onClick={() => handleStatusChange(selectedDevis.id, 'archive')}
                    className="px-4 py-2 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-950 hover:bg-slate-800 dark:hover:bg-slate-100 text-xs font-bold shadow-md cursor-pointer transition-all"
                  >
                    Archiver le dossier
                  </button>
                )}

                {selectedDevis.statut === 'archive' && (
                  <button
                    type="button"
                    onClick={() => handleStatusChange(selectedDevis.id, 'traite')}
                    className="px-4 py-2 rounded-xl bg-[#FFDE77] hover:bg-[#FFDE77]/80 text-[#443C34] text-xs font-bold shadow-md cursor-pointer transition-all"
                  >
                    Rétablir en Traité
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white border border-slate-200/50 rounded-3xl max-w-sm w-full p-6 space-y-6 shadow-2xl relative animate-in zoom-in-95 duration-200 font-sans">
            <div className="text-center space-y-3">
              <div className="inline-flex bg-red-50 p-3.5 rounded-full text-red-600 shadow-inner">
                <LogOut className="w-6 h-6 stroke-[2.5]" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                Confirmer la déconnexion ?
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Êtes-vous sûr de vouloir vous déconnecter de votre espace d'administration BioControl ?
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 transition-all font-semibold text-xs cursor-pointer"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 text-white hover:bg-red-700 transition-all font-bold text-xs cursor-pointer shadow-md"
              >
                Se déconnecter
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
