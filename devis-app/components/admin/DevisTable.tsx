import React, { useState } from 'react';
import { Devis, Statut } from '../../types/devis';
import StatusBadge from './StatusBadge';
import { 
  Check, 
  Archive, 
  ChevronLeft, 
  ChevronRight, 
  Calendar, 
  User, 
  Mail, 
  Phone, 
  Maximize2, 
  AlertTriangle, 
  Clock, 
  FileSpreadsheet,
  RotateCcw,
  Sparkles
} from 'lucide-react';

interface DevisTableProps {
  devis: Devis[];
  onStatusChange: (id: string, newStatus: Statut) => void;
  onViewDetails?: (item: Devis) => void;
}

const ITEMS_PER_PAGE = 10;

export default function DevisTable({ devis, onStatusChange, onViewDetails }: DevisTableProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(devis.length / ITEMS_PER_PAGE) || 1;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedItems = devis.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Handle page resets if list shrinks
  React.useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [devis.length, totalPages, currentPage]);

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

  const getUrgenceClass = (urg: string) => {
    switch (urg) {
      case '24h':
        return 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900/50';
      case 'annuel':
        return 'bg-[#FFDE77]/20 text-[#443C34] border-[#FFDE77]/40';
      default:
        return 'bg-slate-50 text-slate-600 border-slate-200 dark:bg-zinc-800/40 dark:text-zinc-400 dark:border-zinc-800';
    }
  };

  const getUrgenceLabel = (urg: string) => {
    switch (urg) {
      case '24h': return 'Urgent (< 24h)';
      case 'annuel': return 'Contrat Annuel';
      default: return 'Simple Devis';
    }
  };

  return (
    <div className="space-y-4">
      {/* Empty State */}
      {devis.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-zinc-950 border border-slate-200/50 dark:border-zinc-900 rounded-3xl space-y-3">
          <Calendar className="w-12 h-12 text-slate-300 dark:text-zinc-700 mx-auto" />
          <h3 className="text-base font-bold text-slate-800 dark:text-zinc-200">Aucune demande trouvée</h3>
          <p className="text-xs text-slate-400 dark:text-zinc-500 max-w-sm mx-auto">
            Aucun dossier ne correspond à votre filtre actuel ou à votre recherche.
          </p>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-hidden bg-white dark:bg-zinc-950 border border-slate-200/50 dark:border-zinc-900 rounded-3xl shadow-sm">
            <table className="min-w-full divide-y divide-slate-100 dark:divide-zinc-900 text-left text-sm">
              <thead className="bg-slate-50/50 dark:bg-zinc-900/40 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
                <tr>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Établissement & Surface</th>
                  <th className="px-6 py-4">Nuisible(s)</th>
                  <th className="px-6 py-4">Urgence</th>
                  <th className="px-6 py-4">Contact</th>
                  <th className="px-6 py-4 text-center">Statut</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-zinc-900 bg-white dark:bg-zinc-950">
                {paginatedItems.map((item) => (
                  <tr 
                    key={item.id}
                    className="hover:bg-slate-50/30 dark:hover:bg-zinc-900/10 transition-colors duration-200"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-400 dark:text-zinc-500 font-medium">
                      {formatDate(item.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-semibold text-slate-800 dark:text-zinc-200">{item.etablissement}</div>
                      <div className="text-xs text-slate-400 dark:text-zinc-500 mt-0.5">{item.surface} m²</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {item.nuisibles.map((n) => (
                          <span 
                            key={n}
                            className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 text-slate-700 dark:bg-zinc-800 dark:text-zinc-300"
                          >
                            {n}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${getUrgenceClass(item.urgence)}`}>
                        {getUrgenceLabel(item.urgence)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-800 dark:text-zinc-200">{item.nom}</div>
                      <div className="text-xs text-slate-400 dark:text-zinc-500 mt-0.5 flex flex-col gap-0.5">
                        <span className="truncate max-w-[180px]">{item.email}</span>
                        <span>{item.telephone}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <StatusBadge status={item.statut} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {onViewDetails && (
                          <button
                            type="button"
                            onClick={() => onViewDetails(item)}
                            title="Voir les détails"
                            className="p-1.5 rounded-lg border border-slate-200 dark:border-zinc-800 text-slate-500 dark:text-zinc-400 bg-white dark:bg-zinc-950 hover:bg-slate-50 dark:hover:bg-zinc-900 hover:text-slate-800 dark:hover:text-white transition-all cursor-pointer"
                          >
                            <Maximize2 className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {item.statut === 'nouveau' && (
                          <>
                            <button
                              type="button"
                              onClick={() => onStatusChange(item.id, 'traite')}
                              title="Marquer Traité"
                              className="p-1.5 rounded-lg border border-[#FFDE77]/40 bg-[#FFDE77]/10 text-[#443C34] hover:bg-[#FFDE77] hover:text-[#443C34] hover:border-[#FFDE77] transition-all cursor-pointer"
                            >
                              <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                            </button>
                            <button
                              type="button"
                              onClick={() => onStatusChange(item.id, 'archive')}
                              title="Archiver"
                              className="p-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-500 hover:bg-zinc-800 hover:text-white hover:border-zinc-800 transition-all dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-white dark:hover:text-black dark:hover:border-white cursor-pointer"
                            >
                              <Archive className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}

                        {item.statut === 'traite' && (
                          <button
                            type="button"
                            onClick={() => onStatusChange(item.id, 'archive')}
                            title="Archiver"
                            className="p-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-500 hover:bg-zinc-800 hover:text-white hover:border-zinc-800 transition-all dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-white dark:hover:text-black dark:hover:border-white cursor-pointer"
                          >
                            <Archive className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {item.statut === 'archive' && (
                          <button
                            type="button"
                            onClick={() => onStatusChange(item.id, 'traite')}
                            title="Restaurer en Traité"
                            className="p-1.5 rounded-lg border border-zinc-200 bg-zinc-50 text-zinc-600 hover:bg-[#FFDE77] hover:text-[#443C34] hover:border-[#FFDE77] transition-all cursor-pointer"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card Grid View */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:hidden">
            {paginatedItems.map((item) => (
              <div 
                key={item.id}
                className="bg-white dark:bg-zinc-950 border border-slate-200/50 dark:border-zinc-900 rounded-3xl p-5 space-y-4 shadow-sm hover:shadow-md transition-all duration-300"
              >
                {/* Card Header */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-bold block mb-1">
                      {formatDate(item.created_at)}
                    </span>
                    <h4 className="text-base font-bold text-slate-800 dark:text-white">
                      {item.etablissement}
                    </h4>
                    <span className="text-xs text-slate-400 dark:text-zinc-500">
                      Surface : {item.surface} m²
                    </span>
                  </div>
                  <StatusBadge status={item.statut} />
                </div>

                {/* Tags Section */}
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${getUrgenceClass(item.urgence)}`}>
                    {getUrgenceLabel(item.urgence)}
                  </span>
                  {item.nuisibles.map((n) => (
                    <span 
                      key={n}
                      className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 text-slate-600 dark:bg-zinc-850 dark:text-zinc-400"
                    >
                      {n}
                    </span>
                  ))}
                </div>

                {/* Contact details */}
                <div className="pt-3 border-t border-slate-100 dark:border-zinc-900 space-y-1 text-xs text-slate-500 dark:text-zinc-400">
                  <div className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-zinc-300">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>{item.nom}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span className="truncate">{item.email}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{item.telephone}</span>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="pt-3 border-t border-slate-100 dark:border-zinc-900 flex items-center justify-between gap-2">
                  {onViewDetails ? (
                    <button
                      type="button"
                      onClick={() => onViewDetails(item)}
                      className="text-xs text-slate-500 hover:text-emerald-500 dark:text-zinc-400 dark:hover:text-emerald-400 font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                      <span>Détails</span>
                    </button>
                  ) : (
                    <div />
                  )}

                  <div className="flex items-center gap-2">
                    {item.statut === 'nouveau' && (
                      <>
                        <button
                          type="button"
                          onClick={() => onStatusChange(item.id, 'traite')}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-[#FFDE77]/40 bg-[#FFDE77]/10 text-[#443C34] text-xs font-bold transition-all cursor-pointer hover:bg-[#FFDE77]"
                        >
                          <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                          <span>Traiter</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => onStatusChange(item.id, 'archive')}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 text-xs font-bold transition-all cursor-pointer"
                        >
                          <Archive className="w-3.5 h-3.5" />
                          <span>Archiver</span>
                        </button>
                      </>
                    )}

                    {item.statut === 'traite' && (
                      <button
                        type="button"
                        onClick={() => onStatusChange(item.id, 'archive')}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 text-xs font-bold transition-all cursor-pointer"
                      >
                        <Archive className="w-3.5 h-3.5" />
                        <span>Archiver</span>
                      </button>
                    )}

                    {item.statut === 'archive' && (
                      <button
                        type="button"
                        onClick={() => onStatusChange(item.id, 'traite')}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 text-xs font-bold transition-all cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Rétablir</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Table Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-4">
              <span className="text-xs text-slate-400 dark:text-zinc-500 font-semibold">
                Affichage de {startIndex + 1} à {Math.min(startIndex + ITEMS_PER_PAGE, devis.length)} sur {devis.length} demandes
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-slate-500 dark:text-zinc-400 hover:bg-slate-50 hover:text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-xs text-slate-600 dark:text-zinc-300 font-bold px-2">
                  {currentPage} / {totalPages}
                </span>
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-slate-500 dark:text-zinc-400 hover:bg-slate-50 hover:text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
