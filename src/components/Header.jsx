import React from 'react';
import { Languages, History, LogOut, User } from 'lucide-react';

export default function Header({
  theme,
  setTheme,
  onOpenSettings,
  onToggleHistory,
  historyCount,
  apiConfig,
  currentUser,
  onSignOut
}) {
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/75 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-900/75 transition-all">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Branding Logo */}
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white shadow-lg shadow-indigo-500/20 dark:shadow-indigo-600/30">
            <Languages className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <h1 className="bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-500 bg-clip-text text-xl font-extrabold tracking-tight text-transparent dark:from-indigo-400 dark:via-purple-400 dark:to-violet-300">
              SpeakEasy
            </h1>
            <p className="hidden text-[10px] font-medium text-slate-500 dark:text-slate-400 sm:block">
              Premium Translation Hub
            </p>
          </div>
        </div>

        {/* Navigation Action Buttons */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          
          {/* User Profile Info */}
          {currentUser && (
            <div className="hidden sm:flex items-center space-x-3 mr-2 sm:mr-4 border-r border-slate-200/60 dark:border-slate-700/60 pr-2 sm:pr-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300">
                <User className="h-4.5 w-4.5" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-slate-800 dark:text-slate-100 leading-tight">
                  {currentUser.name || 'User'}
                </span>
                <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 leading-tight">
                  {currentUser.email || ''}
                </span>
              </div>
            </div>
          )}

          {/* Translation History Button */}
          <button
            onClick={onToggleHistory}
            className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 shadow-xs transition-all hover:bg-slate-50 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-slate-100"
            aria-label="Open Translation History"
          >
            <History className="h-4.5 w-4.5" />
            {historyCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-indigo-600 px-1 text-[10px] font-bold text-white ring-2 ring-white dark:bg-indigo-500 dark:ring-slate-950">
                {historyCount}
              </span>
            )}
          </button>


          {/* Sign Out Button */}
          <button
            onClick={onSignOut}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-rose-200 bg-rose-50/50 text-rose-600 shadow-xs transition-all hover:bg-rose-100 hover:text-rose-800 dark:border-rose-900/40 dark:bg-rose-950/20 dark:text-rose-450 dark:hover:bg-rose-900/40"
            aria-label="Sign Out"
            title="Sign Out"
          >
            <LogOut className="h-4.5 w-4.5" />
          </button>
          
        </div>
      </div>
    </header>
  );
}
