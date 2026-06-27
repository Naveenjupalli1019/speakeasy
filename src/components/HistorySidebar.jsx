import React from 'react';
import { X, Trash2, Calendar, RotateCcw, Languages } from 'lucide-react';
import { SUPPORTED_LANGUAGES } from '../services/translationService';

export default function HistorySidebar({
  isOpen,
  onClose,
  history = [],
  onClearAll,
  onDeleteHistoryItem,
  onRestore
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 flex w-full max-w-sm flex-col border-l border-slate-200 bg-white/95 shadow-2xl backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/95 animate-in slide-in-from-right duration-300">
      
      {/* Drawer Header */}
      <div className="flex items-center justify-between border-b border-slate-100 p-4 dark:border-slate-800">
        <div className="flex items-center space-x-2">
          <Calendar className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Translation History
          </h2>
        </div>
        <button
          onClick={onClose}
          className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-300"
          aria-label="Close translation history"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Drawer Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {history.length > 0 ? (
          history.map((item) => {
            const langObj = SUPPORTED_LANGUAGES.find((l) => l.code === item.targetLanguage);
            const dateFormatted = new Date(item.timestamp).toLocaleString(undefined, {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            });

            return (
              <div
                key={item.id}
                className="group relative rounded-xl border border-slate-100 bg-slate-50 p-3.5 transition-all hover:border-indigo-100 hover:bg-white hover:shadow-md dark:border-slate-800/60 dark:bg-slate-950/40 dark:hover:border-indigo-900/50 dark:hover:bg-slate-900"
              >
                {/* Header of Card */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
                    <span className="flex items-center">🇺🇸 EN</span>
                    <Languages className="h-3 w-3 text-slate-400" />
                    <span className="flex items-center">
                      {langObj?.flag} {langObj?.code.toUpperCase()}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400">{dateFormatted}</span>
                </div>

                {/* Body Text */}
                <div className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                  <p className="line-clamp-2 italic text-slate-400 dark:text-slate-500">"{item.inputText}"</p>
                  <p className="line-clamp-2 font-medium">"{item.translatedText}"</p>
                </div>

                {/* Restoration & Delete Controls */}
                <div className="mt-3 flex items-center justify-end space-x-2 pt-2 border-t border-slate-100 dark:border-slate-800/40 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => {
                      onRestore(item);
                      onClose();
                    }}
                    className="flex items-center space-x-1 rounded-md bg-indigo-50 px-2 py-1 text-[10px] font-bold text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-950/40 dark:text-indigo-400 dark:hover:bg-indigo-900/50"
                  >
                    <RotateCcw className="h-3 w-3" />
                    <span>Restore</span>
                  </button>
                  <button
                    onClick={() => onDeleteHistoryItem(item.id)}
                    className="flex h-5 w-5 items-center justify-center rounded-md text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40 dark:hover:text-rose-450"
                    title="Delete item"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex h-full flex-col items-center justify-center text-slate-400 dark:text-slate-600">
            <Calendar className="h-10 w-10 mb-2 stroke-1" />
            <span className="text-xs">No translation logs found</span>
          </div>
        )}
      </div>

      {/* Drawer Footer */}
      {history.length > 0 && (
        <div className="border-t border-slate-100 p-4 dark:border-slate-800">
          <button
            onClick={onClearAll}
            className="flex w-full items-center justify-center space-x-2 rounded-xl border border-rose-200/80 bg-rose-50/50 py-2.5 text-xs font-bold text-rose-700 hover:bg-rose-50 hover:text-rose-800 dark:border-rose-900/30 dark:bg-rose-950/10 dark:text-rose-400 dark:hover:bg-rose-900/30"
          >
            <Trash2 className="h-4 w-4" />
            <span>Clear Translation History</span>
          </button>
        </div>
      )}

    </div>
  );
}
