import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onSearch: (query: string) => void;
  placeholder?: string;
}

export default function SearchBar({ value: initialValue, onSearch, placeholder = "Rechercher par email ou nom..." }: SearchBarProps) {
  const [query, setQuery] = useState(initialValue);

  // Sync with initial value changes from parent if any
  useEffect(() => {
    setQuery(initialValue);
  }, [initialValue]);

  // Debounce the search handler by 300ms
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query, onSearch]);

  return (
    <div className="relative rounded-xl shadow-sm w-full md:w-80">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
        <Search className="w-4 h-4 text-slate-400 dark:text-zinc-500" />
      </div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="block w-full rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-2.5 pl-10 pr-9 text-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-300 placeholder-slate-400 dark:placeholder-zinc-500"
      />
      {query && (
        <button
          type="button"
          onClick={() => setQuery('')}
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 dark:hover:text-zinc-300 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
