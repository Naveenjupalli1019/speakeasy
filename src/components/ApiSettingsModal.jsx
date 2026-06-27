import React, { useState } from 'react';
import { X, Eye, EyeOff, Key, ShieldCheck, Sparkles, ExternalLink } from 'lucide-react';

export default function ApiSettingsModal({
  isOpen,
  onClose,
  apiConfig,
  setApiConfig
}) {
  const [mode, setMode] = useState(apiConfig.mode);
  const [apiKey, setApiKey] = useState(apiConfig.apiKey);
  const [showKey, setShowKey] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    setApiConfig({ mode, apiKey });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs transition-opacity duration-300">
      <div 
        className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900 animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 dark:border-slate-800">
          <div className="flex items-center space-x-2">
            <Key className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Translation Engine Settings
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-300 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Content */}
        <form onSubmit={handleSave} className="p-6 space-y-6">
          {/* Engine Selector */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Select Translation Provider
            </label>
            <div className="grid grid-cols-2 gap-2 rounded-xl bg-slate-100 p-1 dark:bg-slate-950">
              <button
                type="button"
                onClick={() => setMode('demo')}
                className={`flex flex-col items-center justify-center rounded-lg py-2.5 px-3 text-center transition-all ${
                  mode === 'demo'
                    ? 'bg-white text-indigo-600 shadow-xs dark:bg-slate-900 dark:text-indigo-400'
                    : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
              >
                <Sparkles className="h-4 w-4 mb-1" />
                <span className="text-xs font-bold">Free Demo Mode</span>
              </button>
              <button
                type="button"
                onClick={() => setMode('rapidapi')}
                className={`flex flex-col items-center justify-center rounded-lg py-2.5 px-3 text-center transition-all ${
                  mode === 'rapidapi'
                    ? 'bg-white text-indigo-600 shadow-xs dark:bg-slate-900 dark:text-indigo-400'
                    : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
              >
                <ShieldCheck className="h-4 w-4 mb-1" />
                <span className="text-xs font-bold">RapidAPI Mode</span>
              </button>
            </div>
          </div>

          {/* Engine Configurations */}
          {mode === 'demo' ? (
            <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-4 dark:border-blue-900/40 dark:bg-blue-950/20">
              <p className="text-xs leading-relaxed text-blue-700 dark:text-blue-300">
                🚀 <strong>Free Demo Mode</strong> utilizes the public MyMemory API.
              </p>
              <ul className="mt-2 list-inside list-disc text-[11px] leading-relaxed text-blue-600/80 dark:text-blue-400/80 space-y-1">
                <li>No account or API key required.</li>
                <li>Ideal for testing layouts and simple strings.</li>
                <li>Daily query caps may apply under high usage.</li>
              </ul>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-4 dark:border-emerald-950/40 dark:bg-emerald-950/20">
                <p className="text-xs leading-relaxed text-emerald-700 dark:text-emerald-300">
                  ⚡ <strong>RapidAPI Mode</strong> uses the Google Translate API for ultra-fast, accurate translation queries.
                </p>
              </div>

              {/* API Key Input */}
              <div className="space-y-1.5">
                <label 
                  htmlFor="rapidapi-key-input"
                  className="text-xs font-semibold text-slate-500 dark:text-slate-400"
                >
                  RapidAPI Key (x-rapidapi-key)
                </label>
                <div className="relative">
                  <input
                    id="rapidapi-key-input"
                    type={showKey ? 'text' : 'password'}
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="Enter your RapidAPI Key..."
                    required={mode === 'rapidapi'}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-3 pr-10 text-sm font-mono text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-hidden dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:placeholder-slate-600 dark:focus:border-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowKey(!showKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                    aria-label={showKey ? "Hide API key" : "Show API key"}
                  >
                    {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center space-x-1 text-[11px] text-slate-500 dark:text-slate-400">
                <span>Need a key? Subscription is available at</span>
                <a
                  href="https://rapidapi.com/googlecloud/api/google-translate1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center font-semibold text-indigo-600 hover:underline dark:text-indigo-400"
                >
                  RapidAPI Hub <ExternalLink className="ml-0.5 h-3 w-3" />
                </a>
              </div>
            </div>
          )}

          {/* Footer Save & Actions */}
          <div className="flex space-x-3 pt-2 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-slate-200 py-2.5 text-center text-xs font-semibold text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-500 py-2.5 text-center text-xs font-semibold text-white shadow-md shadow-indigo-500/20 hover:from-indigo-700 hover:to-violet-600 dark:shadow-indigo-600/30"
            >
              Save Configuration
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
