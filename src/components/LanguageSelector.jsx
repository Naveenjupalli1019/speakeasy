import React, { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, Check, X } from 'lucide-react';
import { SUPPORTED_LANGUAGES } from '../services/translationService';

export default function LanguageSelector({
  selectedLanguage,
  onLanguageChange
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredLanguages = SUPPORTED_LANGUAGES.filter((lang) =>
    lang.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lang.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedLangObj = SUPPORTED_LANGUAGES.find((lang) => lang.code === selectedLanguage) || SUPPORTED_LANGUAGES[0];

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 rounded-full border border-slate-200/60 bg-white px-4 py-2 text-sm font-bold shadow-sm transition-all hover:bg-slate-50 focus:ring-2 focus:ring-indigo-500/50 dark:border-slate-700/50 dark:bg-slate-800/50 dark:hover:bg-slate-800/80"
        aria-haspopup="listbox"
      >
        <span className="text-[10px] font-black uppercase text-slate-400">{selectedLangObj.code}</span>
        <span className="text-slate-700 dark:text-slate-200">{selectedLangObj.name}</span>
        <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 z-50 mt-2 w-64 origin-top-right rounded-xl border border-white/20 bg-white/90 backdrop-blur-xl shadow-2xl ring-1 ring-black/5 dark:border-slate-700/50 dark:bg-slate-900/90 focus:outline-none overflow-hidden animate-in fade-in slide-in-from-top-2">
          
          <div className="relative border-b border-slate-200/50 p-2 dark:border-slate-700/50">
            <Search className="absolute left-4 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search languages..."
              className="w-full rounded-lg bg-slate-100/50 py-1.5 pl-8 pr-8 text-xs focus:bg-slate-100 focus:outline-none dark:bg-slate-800/50 dark:text-slate-100 dark:focus:bg-slate-800"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>

          <ul className="max-h-60 overflow-y-auto p-1" role="listbox">
            {filteredLanguages.length > 0 ? (
              filteredLanguages.map((lang) => {
                const isSelected = selectedLanguage === lang.code;
                return (
                  <li
                    key={lang.code}
                    onClick={() => {
                      onLanguageChange(lang.code);
                      setIsOpen(false);
                    }}
                    className={`flex cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors ${
                      isSelected
                        ? 'bg-indigo-50/80 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300'
                        : 'text-slate-700 hover:bg-slate-100/80 dark:text-slate-300 dark:hover:bg-slate-800/80'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <span>{lang.flag}</span>
                      <span className={isSelected ? 'font-semibold' : 'font-medium'}>{lang.name}</span>
                    </div>
                    {isSelected && <Check className="h-4 w-4" />}
                  </li>
                );
              })
            ) : (
              <div className="p-3 text-center text-xs text-slate-400">No languages found</div>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
