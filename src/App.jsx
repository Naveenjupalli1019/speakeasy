import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import TranslationBox from './components/TranslationBox';
import LanguageSelector from './components/LanguageSelector';
import ApiSettingsModal from './components/ApiSettingsModal';
import HistorySidebar from './components/HistorySidebar';
import { translateText, getPronunciation, SUPPORTED_LANGUAGES } from './services/translationService';
import { Globe, RefreshCw, Star, Info, Sparkles, BookOpen } from 'lucide-react';
import LoginPortal from './components/LoginPortal';

export default function App() {
  // Force Light mode as default interface
  const [theme, setTheme] = useState('light');

  const [apiConfig, setApiConfig] = useState(() => {
    const saved = localStorage.getItem('translationApiConfig');
    return saved ? JSON.parse(saved) : { mode: 'demo', apiKey: '' };
  });

  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('translationFavorites');
    return saved ? JSON.parse(saved) : ['es', 'fr', 'de', 'ja', 'zh'];
  });

  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem('translationHistory');
    return saved ? JSON.parse(saved) : [];
  });

  // Main translation states
  const [inputText, setInputText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [pronunciation, setPronunciation] = useState('');
  const [targetLanguage, setTargetLanguage] = useState('es');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Authentication states
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Dialog visual states
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // Restore authentication token on application mount
  useEffect(() => {
    const token = localStorage.getItem('translationAuthToken') || sessionStorage.getItem('translationAuthToken');
    if (token) {
      setIsAuthenticated(true);
      setCurrentUser(JSON.parse(token));
    }
  }, []);

  const handleLoginSuccess = (user, remember) => {
    setIsAuthenticated(true);
    setCurrentUser(user);
    const tokenString = JSON.stringify(user);
    if (remember) {
      localStorage.setItem('translationAuthToken', tokenString);
    } else {
      sessionStorage.setItem('translationAuthToken', tokenString);
    }
  };

  const handleSignOut = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    localStorage.removeItem('translationAuthToken');
    sessionStorage.removeItem('translationAuthToken');
  };

  // Sync API configurations to local storage
  useEffect(() => {
    localStorage.setItem('translationApiConfig', JSON.stringify(apiConfig));
  }, [apiConfig]);

  // Sync favorites to local storage
  useEffect(() => {
    localStorage.setItem('translationFavorites', JSON.stringify(favorites));
  }, [favorites]);

  // Sync Dark/Light theme class on document element
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('translationTheme', theme);
  }, [theme]);

  // Debounced auto-translation logic
  useEffect(() => {
    if (!inputText.trim()) {
      setTranslatedText('');
      setError(null);
      return;
    }

    const delayDebounce = setTimeout(() => {
      triggerTranslation();
    }, 900); // 900ms debounce to prevent API query spam

    return () => clearTimeout(delayDebounce);
  }, [inputText, targetLanguage, apiConfig.mode]); // Only trigger auto-translation when input, target, or mode changes

  // Perform translation fetch
  const triggerTranslation = async () => {
    if (!inputText || !inputText.trim()) return;
    setIsLoading(true);
    setError(null);
    setPronunciation('');

    try {
      const result = await translateText(inputText, targetLanguage, apiConfig);
      setTranslatedText(result);
      
      const pron = await getPronunciation(inputText, targetLanguage);
      if (pron) setPronunciation(pron);
      
      // Cache query to translation history log
      saveToHistory(inputText, result, targetLanguage);
    } catch (err) {
      setError(err.message || 'An unexpected error occurred during translation.');
    } finally {
      setIsLoading(false);
    }
  };

  // Add items to history without spamming duplicates
  const saveToHistory = (input, output, lang) => {
    if (!input.trim() || !output.trim()) return;

    setHistory((prev) => {
      const isDuplicate = prev.length > 0 && 
        prev[0].inputText.trim().toLowerCase() === input.trim().toLowerCase() && 
        prev[0].targetLanguage === lang;

      if (isDuplicate) return prev;

      const newItem = {
        id: Date.now().toString(),
        inputText: input,
        translatedText: output,
        targetLanguage: lang,
        timestamp: Date.now()
      };

      const updated = [newItem, ...prev].slice(0, 50); // limit to 50 items
      localStorage.setItem('translationHistory', JSON.stringify(updated));
      return updated;
    });
  };

  // Toggle favorite language code
  const toggleFavorite = (langCode) => {
    setFavorites((prev) => {
      let updated;
      if (prev.includes(langCode)) {
        updated = prev.filter((code) => code !== langCode);
      } else {
        updated = [...prev, langCode];
      }
      return updated;
    });
  };

  // Clear translation history log
  const clearAllHistory = () => {
    if (window.confirm('Are you sure you want to delete your entire translation history?')) {
      setHistory([]);
      localStorage.removeItem('translationHistory');
    }
  };

  // Delete individual history item
  const deleteHistoryItem = (id) => {
    setHistory((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      localStorage.setItem('translationHistory', JSON.stringify(updated));
      return updated;
    });
  };

  // Restore history card contents
  const restoreHistory = (historyItem) => {
    setInputText(historyItem.inputText);
    setTargetLanguage(historyItem.targetLanguage);
    setTranslatedText(historyItem.translatedText);
  };

  // Quick prompt suggestions
  const suggestions = [
    "Welcome to our premium translation hub!",
    "Where is the nearest train station?",
    "Could I get a menu and glass of water, please?",
    "Thank you very much for your excellent guidance."
  ];

  if (!isAuthenticated) {
    return <LoginPortal onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 flex flex-col relative overflow-hidden transition-colors duration-300">
      
      {/* Premium Ambient Glassmorphic Background Blobs */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] h-[600px] w-[600px] rounded-full bg-cyan-400/20 blur-[100px] dark:bg-cyan-600/20 animate-blob mix-blend-multiply dark:mix-blend-screen"></div>
        <div className="absolute top-[20%] right-[5%] h-[500px] w-[500px] rounded-full bg-fuchsia-400/20 blur-[100px] dark:bg-fuchsia-600/20 animate-blob animation-delay-2000 mix-blend-multiply dark:mix-blend-screen"></div>
        <div className="absolute -bottom-[20%] left-[20%] h-[700px] w-[700px] rounded-full bg-indigo-400/20 blur-[120px] dark:bg-indigo-600/20 animate-blob animation-delay-4000 mix-blend-multiply dark:mix-blend-screen"></div>
      </div>

      {/* Header component */}
      <Header
        theme={theme}
        setTheme={setTheme}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onToggleHistory={() => setIsHistoryOpen(true)}
        historyCount={history.length}
        apiConfig={apiConfig}
        currentUser={currentUser}
        onSignOut={handleSignOut}
      />

      {/* Main Translation Interface Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8 sm:px-6 lg:px-8 z-10 relative">
        <div className="space-y-6">
          
          {/* Core Dual Panel Translation Dashboard */}
          <TranslationBox
            inputText={inputText}
            setInputText={setInputText}
            translatedText={translatedText}
            pronunciation={pronunciation}
            isLoading={isLoading}
            error={error}
            targetLanguage={targetLanguage}
            onTranslate={triggerTranslation}
            onLanguageChange={setTargetLanguage}
            apiConfig={apiConfig}
          />

          {/* Suggestion Prompts Section */}
          <div className="rounded-2xl border border-slate-200/50 bg-white/40 p-5 dark:border-slate-800/50 dark:bg-slate-900/30">
            <div className="flex items-center space-x-2 mb-3">
              <BookOpen className="h-4 w-4 text-indigo-500 dark:text-indigo-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Need Ideas? Try these suggestions
              </h3>
            </div>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
              {suggestions.map((phrase, idx) => (
                <button
                  key={idx}
                  onClick={() => setInputText(phrase)}
                  className="rounded-xl border border-slate-200/60 bg-white px-4 py-2.5 text-left text-xs font-semibold text-slate-600 hover:border-indigo-400 hover:text-indigo-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400 dark:hover:border-indigo-500 dark:hover:text-indigo-400 transition-all duration-200"
                >
                  {phrase}
                </button>
              ))}
            </div>
          </div>

        </div>
      </main>

      {/* API Configuration Settings Modal Dialog Overlay */}
      <ApiSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        apiConfig={apiConfig}
        setApiConfig={setApiConfig}
      />

      {/* History Slide-out Sidebar Drawer Overlay */}
      <HistorySidebar
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onClearAll={clearAllHistory}
        onDeleteHistoryItem={deleteHistoryItem}
        onRestore={restoreHistory}
      />

      {/* Ambient Footer */}
      <footer className="w-full border-t border-slate-200/60 py-6 text-center text-xs text-slate-400 dark:border-slate-800/60 dark:text-slate-500 z-10">
        <p>© 2026 SpeakEasy Translation Hub. Designed for maximum accessibility.</p>
      </footer>
    </div>
  );
}
