import React, { useState, useEffect, useMemo } from 'react';
import { User, Mail, Phone, ChevronDown, Search } from 'lucide-react';

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

const COUNTRIES = [
  { name: 'France', code: 'FR', dial: '+33', flag: '🇫🇷' },
  { name: 'Belgique', code: 'BE', dial: '+32', flag: '🇧🇪' },
  { name: 'Suisse', code: 'CH', dial: '+41', flag: '🇨🇭' },
  { name: 'Luxembourg', code: 'LU', dial: '+352', flag: '🇱🇺' },
  { name: 'Madagascar', code: 'MG', dial: '+261', flag: '🇲🇬' },
  { name: 'Canada', code: 'CA', dial: '+1', flag: '🇨🇦' },
  { name: 'États-Unis', code: 'US', dial: '+1', flag: '🇺🇸' },
  { name: 'Royaume-Uni', code: 'GB', dial: '+44', flag: '🇬🇧' },
  { name: 'Allemagne', code: 'DE', dial: '+49', flag: '🇩🇪' },
  { name: 'Espagne', code: 'ES', dial: '+34', flag: '🇪🇸' },
  { name: 'Italie', code: 'IT', dial: '+39', flag: '🇮🇹' },
  { name: 'Portugal', code: 'PT', dial: '+351', flag: '🇵🇹' },
  { name: 'Maroc', code: 'MA', dial: '+212', flag: '🇲🇦' },
  { name: 'Algérie', code: 'DZ', dial: '+213', flag: '🇩🇿' },
  { name: 'Tunisie', code: 'TN', dial: '+216', flag: '🇹🇳' },
  { name: 'Sénégal', code: 'SN', dial: '+221', flag: '🇸🇳' },
  { name: 'Côte d\'Ivoire', code: 'CI', dial: '+225', flag: '🇨🇮' },
  { name: 'Cameroun', code: 'CM', dial: '+237', flag: '🇨🇲' },
  { name: 'La Réunion', code: 'RE', dial: '+262', flag: '🇷🇪' },
  { name: 'Maurice', code: 'MU', dial: '+230', flag: '🇲🇺' },
  { name: 'Mayotte', code: 'YT', dial: '+262', flag: '🇾🇹' },
  { name: 'Guadeloupe', code: 'GP', dial: '+590', flag: '🇬🇵' },
  { name: 'Martinique', code: 'MQ', dial: '+596', flag: '🇲🇶' },
  { name: 'Guyane Française', code: 'GF', dial: '+594', flag: '🇬🇫' },
  { name: 'Polynésie Française', code: 'PF', dial: '+689', flag: '🇵🇫' },
  { name: 'Nouvelle-Calédonie', code: 'NC', dial: '+687', flag: '🇳🇨' },
  { name: 'Monaco', code: 'MC', dial: '+377', flag: '🇲🇨' },
  { name: 'Bénin', code: 'BJ', dial: '+229', flag: '🇧🇯' },
  { name: 'Burkina Faso', code: 'BF', dial: '+226', flag: '🇧🇫' },
  { name: 'Congo-Brazzaville', code: 'CG', dial: '+242', flag: '🇨🇬' },
  { name: 'Congo-Kinshasa', code: 'CD', dial: '+243', flag: '🇨🇩' },
  { name: 'Gabon', code: 'GA', dial: '+241', flag: '🇬🇦' },
  { name: 'Guinée', code: 'GN', dial: '+224', flag: '🇬🇳' },
  { name: 'Mali', code: 'ML', dial: '+223', flag: '🇲🇱' },
  { name: 'Niger', code: 'NE', dial: '+227', flag: '🇳🇪' },
  { name: 'Togo', code: 'TG', dial: '+228', flag: '🇹🇬' },
  { name: 'Pays-Bas', code: 'NL', dial: '+31', flag: '🇳🇱' },
  { name: 'Autriche', code: 'AT', dial: '+43', flag: '🇦🇹' },
  { name: 'Suède', code: 'SE', dial: '+46', flag: '🇸🇪' },
  { name: 'Pologne', code: 'PL', dial: '+48', flag: '🇵🇱' },
  { name: 'Roumanie', code: 'RO', dial: '+40', flag: '🇷🇴' },
  { name: 'Turquie', code: 'TR', dial: '+90', flag: '🇹🇷' },
  { name: 'Chine', code: 'CN', dial: '+86', flag: '🇨🇳' },
  { name: 'Japon', code: 'JP', dial: '+81', flag: '🇯🇵' },
  { name: 'Inde', code: 'IN', dial: '+91', flag: '🇮🇳' },
  { name: 'Brésil', code: 'BR', dial: '+55', flag: '🇧🇷' },
  { name: 'Argentine', code: 'AR', dial: '+54', flag: '🇦🇷' },
  { name: 'Mexique', code: 'MX', dial: '+52', flag: '🇲🇽' },
  { name: 'Australie', code: 'AU', dial: '+61', flag: '🇦🇺' },
];

export default function StepThree({ formData, onChange, errors }: StepThreeProps) {
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]);
  const [phoneInput, setPhoneInput] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Synchronize on mount if telephone value is already present
  useEffect(() => {
    if (formData.telephone) {
      // Find matching country code prefix
      const sortedCountries = [...COUNTRIES].sort((a, b) => b.dial.length - a.dial.length);
      const matched = sortedCountries.find((c) => formData.telephone.startsWith(c.dial));

      if (matched) {
        setSelectedCountry(matched);
        const rest = formData.telephone.slice(matched.dial.length).trim();
        setPhoneInput(rest);
      } else {
        // If it starts with 0 and is likely French, format it
        if (formData.telephone.startsWith('0') && formData.telephone.length >= 9) {
          const rest = formData.telephone.slice(1).trim();
          setPhoneInput(rest);
          onChange({ telephone: `+33 ${rest}` });
        } else {
          setPhoneInput(formData.telephone);
        }
      }
    }
  }, []);

  // Filter countries list by search term
  const filteredCountries = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return COUNTRIES;
    return COUNTRIES.filter(
      (c) =>
        c.name.toLowerCase().includes(query) ||
        c.dial.includes(query) ||
        c.code.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const handlePhoneInputChange = (val: string) => {
    let cleanVal = val.replace(/[^0-9\s.-]/g, '');
    // Strip leading zero if present
    if (cleanVal.startsWith('0')) {
      cleanVal = cleanVal.slice(1);
    }
    setPhoneInput(cleanVal);
    onChange({ telephone: `${selectedCountry.dial} ${cleanVal}` });
  };

  const handleCountrySelect = (country: typeof COUNTRIES[0]) => {
    setSelectedCountry(country);
    setIsDropdownOpen(false);
    setSearchQuery('');
    onChange({ telephone: `${country.dial} ${phoneInput}` });
  };

  return (
    <div className="space-y-6">
      {/* Contact Name */}
      <div>
        <label htmlFor="nom" className="block text-sm font-semibold text-slate-700 mb-1.5">
          Nom complet du contact <span className="text-red-500">*</span>
        </label>
        <div className="relative rounded-lg shadow-sm">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
            <User className="w-5 h-5 text-slate-400" />
          </div>
          <input
            type="text"
            id="nom"
            name="nom"
            value={formData.nom}
            onChange={(e) => onChange({ nom: e.target.value })}
            placeholder="Ex: Jean Dupont"
            className={`block w-full rounded-xl border p-3.5 pl-11 text-sm focus:outline-none focus:ring-2 transition-all duration-300 bg-white ${
              errors.nom
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                : 'border-slate-200 focus:border-[#FFDE77] focus:ring-[#FFDE77]/20'
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
        <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-1.5">
          Adresse email <span className="text-red-500">*</span>
        </label>
        <div className="relative rounded-lg shadow-sm">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
            <Mail className="w-5 h-5 text-slate-400" />
          </div>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={(e) => onChange({ email: e.target.value })}
            placeholder="Ex: jean.dupont@exemple.fr"
            className={`block w-full rounded-xl border p-3.5 pl-11 text-sm focus:outline-none focus:ring-2 transition-all duration-300 bg-white ${
              errors.email
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                : 'border-slate-200 focus:border-[#FFDE77] focus:ring-[#FFDE77]/20'
            }`}
          />
        </div>
        {errors.email && (
          <p className="mt-2 text-xs font-medium text-red-500" role="alert">
            {errors.email}
          </p>
        )}
      </div>

      {/* Phone Number with International Country Selector */}
      <div className="relative">
        <label htmlFor="telephone" className="block text-sm font-semibold text-slate-700 mb-1.5">
          Numéro de téléphone <span className="text-red-500">*</span>
        </label>
        
        <div className="flex gap-2 relative">
          {/* Country Selector Popover Button */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-1.5 px-3.5 py-3.5 rounded-xl border border-slate-200 bg-white text-sm font-semibold hover:border-slate-300 transition-all duration-200 cursor-pointer h-full min-w-[96px] justify-between"
            >
              <span className="text-lg">{selectedCountry.flag}</span>
              <span className="text-slate-800 font-mono text-xs">{selectedCountry.dial}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            </button>
 
            {/* Dropdown Overlay Backdrop to close on click outside */}
            {isDropdownOpen && (
              <div 
                className="fixed inset-0 z-40 bg-transparent" 
                onClick={() => {
                  setIsDropdownOpen(false);
                  setSearchQuery('');
                }} 
              />
            )}
 
            {/* Country Selector Dropdown Popover */}
            {isDropdownOpen && (
              <div className="absolute left-0 mt-2 w-64 rounded-2xl border border-slate-200 bg-white shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-200">
                {/* Search Header */}
                <div className="p-2 border-b border-slate-100 relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-4.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Rechercher un pays..."
                    className="w-full pl-8 pr-3 py-2 text-xs border border-slate-150 rounded-lg focus:outline-none focus:border-[#FFDE77] bg-slate-50"
                    autoFocus
                  />
                </div>
 
                {/* Search Results */}
                <div className="max-h-56 overflow-y-auto py-1 divide-y divide-slate-50">
                  {filteredCountries.length === 0 ? (
                    <div className="text-center py-4 text-xs text-slate-400">
                      Aucun pays trouvé
                    </div>
                  ) : (
                    filteredCountries.map((c) => (
                      <button
                        key={`${c.code}-${c.dial}`}
                        type="button"
                        onClick={() => handleCountrySelect(c)}
                        className={`w-full flex items-center justify-between px-3.5 py-2.5 text-left text-xs hover:bg-[#FFDE77]/10 transition-colors cursor-pointer ${
                          selectedCountry.code === c.code ? 'bg-[#FFDE77]/5 font-semibold text-[#443C34]' : 'text-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <span className="text-base shrink-0">{c.flag}</span>
                          <span className="truncate">{c.name}</span>
                        </div>
                        <span className="text-slate-400 font-mono text-[10px] shrink-0 ml-2">
                          {c.dial}
                        </span>
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
 
          {/* Phone Number Input */}
          <div className="relative flex-1 rounded-xl shadow-sm">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
              <Phone className="w-5 h-5 text-slate-400" />
            </div>
            <input
              type="tel"
              id="telephone"
              name="telephone"
              value={phoneInput}
              onChange={(e) => handlePhoneInputChange(e.target.value)}
              placeholder="Ex: 6 12 34 56 78"
              className={`block w-full rounded-xl border p-3.5 pl-11 text-sm focus:outline-none focus:ring-2 transition-all duration-300 bg-white ${
                errors.telephone
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                  : 'border-slate-200 focus:border-[#FFDE77] focus:ring-[#FFDE77]/20'
              }`}
            />
          </div>
        </div>
 
        <p className="mt-1.5 text-[11px] text-slate-400">
          Sélectionnez votre pays à gauche, puis entrez votre numéro (le code régional sera appliqué automatiquement).
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
