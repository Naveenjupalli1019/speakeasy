import React, { useState, useEffect } from 'react';
import { Volume2, Mic, MicOff, Copy, Check, Trash2, ArrowRightLeft, Sparkles, AlertCircle } from 'lucide-react';
import { SUPPORTED_LANGUAGES } from '../services/translationService';
import LanguageSelector from './LanguageSelector';

export default function TranslationBox({
  inputText,
  setInputText,
  translatedText,
  pronunciation,
  isLoading,
  error,
  targetLanguage,
  onTranslate,
  onLanguageChange,
  apiConfig
}) {
  const [copiedInput, setCopiedInput] = useState(false);
  const [copiedOutput, setCopiedOutput] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [recognition, setRecognition] = useState(null);

  const characterLimit = 2000;

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recObj = new SpeechRecognition();
      recObj.continuous = false;
      recObj.lang = 'en-US';
      recObj.interimResults = false;

      recObj.onstart = () => setIsRecording(true);
      recObj.onend = () => setIsRecording(false);
      recObj.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputText((prev) => (prev ? prev + ' ' + transcript : transcript));
      };
      recObj.onerror = (e) => {
        console.error('Speech recognition error:', e);
        setIsRecording(false);
      };

      setRecognition(recObj);
    }
  }, [setInputText]);

  // Handle Speech Input Toggle
  const toggleSpeechInput = () => {
    if (!recognition) {
      alert('Speech-to-text recognition is not supported in this browser. Try Chrome or Edge.');
      return;
    }
    if (isRecording) {
      recognition.stop();
    } else {
      recognition.start();
    }
  };

  // Text-To-Speech Narrator for Output
  const playAudio = () => {
    if (!translatedText) return;
    if (!('speechSynthesis' in window)) {
      alert('Text-to-speech reading is not supported in your browser.');
      return;
    }

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(translatedText);
    utterance.lang = targetLanguage;

    utterance.onstart = () => setIsPlayingAudio(true);
    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    window.speechSynthesis.speak(utterance);
  };

  // Copy utilities
  const copyToClipboard = (text, isInput) => {
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
      if (isInput) {
        setCopiedInput(true);
        setTimeout(() => setCopiedInput(false), 2000);
      } else {
        setCopiedOutput(true);
        setTimeout(() => setCopiedOutput(false), 2000);
      }
    });
  };

  return (
    <div className="relative rounded-[32px] border border-white/60 bg-white/95 p-4 shadow-xl backdrop-blur-3xl dark:border-slate-800/60 dark:bg-slate-900/90 sm:p-6 transition-all duration-300">
      
      {/* Top Header Row for Language Selection */}
      <div className="flex items-center justify-between mb-4 px-2">
        {/* Source Language */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2 rounded-full border border-slate-200/60 bg-white px-4 py-2 text-sm font-bold shadow-sm dark:border-slate-700/50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-200">
            <span className="text-[10px] font-black uppercase text-slate-400">us</span>
            <span>English (Detect)</span>
          </div>
        </div>

        {/* Swap Icon */}
        <div className="flex items-center justify-center">
          <ArrowRightLeft className="h-5 w-5 text-indigo-500 opacity-70 hover:opacity-100 transition-opacity cursor-pointer" />
        </div>

        {/* Target Language Dropdown */}
        <div className="flex items-center">
          <LanguageSelector 
            selectedLanguage={targetLanguage} 
            onLanguageChange={onLanguageChange} 
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 relative z-10">
        
        {/* 1. English Input Panel */}
        <div className="flex flex-col rounded-2xl bg-[#f8f9fc] p-5 dark:bg-slate-950/50 transition-all focus-within:ring-2 focus-within:ring-indigo-500/30">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value.slice(0, characterLimit))}
            placeholder=""
            className="min-h-[220px] w-full resize-y bg-transparent text-lg leading-relaxed text-slate-800 focus:outline-none dark:text-slate-100 font-medium"
          />

          {/* Action Footer */}
          <div className="mt-4 flex items-center justify-between pt-3">
            <div className="flex items-center space-x-2">
              <button
                onClick={toggleSpeechInput}
                className={`flex h-10 w-10 items-center justify-center rounded-full transition-all shadow-sm ${
                  isRecording
                    ? 'bg-rose-500 text-white animate-pulse'
                    : 'bg-white text-slate-600 hover:scale-105 hover:text-indigo-600 dark:bg-slate-800 dark:text-slate-400 dark:hover:text-indigo-400'
                }`}
                title="Voice Input"
              >
                {isRecording ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
              </button>
              <button
                onClick={() => copyToClipboard(inputText, true)}
                disabled={!inputText}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-600 transition-all hover:scale-105 hover:text-indigo-600 disabled:opacity-50 dark:bg-slate-800 dark:text-slate-400 dark:hover:text-indigo-400 shadow-sm"
                title="Copy text"
              >
                {copiedInput ? <Check className="h-5 w-5 text-emerald-500" /> : <Copy className="h-5 w-5" />}
              </button>
            </div>
            
            <div className="flex items-center space-x-3">
              <span className="text-xs font-semibold text-slate-400">
                {inputText.length}/{characterLimit}
              </span>
              <button
                onClick={() => setInputText('')}
                disabled={!inputText}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-600 transition-all hover:scale-105 hover:text-rose-600 disabled:opacity-50 dark:bg-slate-800 dark:text-slate-400 dark:hover:text-rose-400 shadow-sm"
                title="Clear text"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* 2. Target Output Panel */}
        <div className="flex flex-col rounded-2xl bg-[#f8f9fc] p-5 dark:bg-indigo-950/20 transition-all relative">
          
          <div className="flex-1 min-h-[220px] relative">
            {isLoading ? (
              <div className="absolute inset-0 flex flex-col space-y-4">
                <div className="h-5 w-3/4 rounded bg-indigo-200/50 dark:bg-indigo-800/50 animate-pulse"></div>
                <div className="h-5 w-11/12 rounded bg-indigo-200/50 dark:bg-indigo-800/50 animate-pulse delay-75"></div>
                <div className="h-5 w-5/6 rounded bg-indigo-200/50 dark:bg-indigo-800/50 animate-pulse delay-150"></div>
              </div>
            ) : error ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                <AlertCircle className="h-10 w-10 text-rose-500 mb-3 animate-bounce" />
                <p className="text-sm font-semibold text-rose-700 dark:text-rose-400">Translation Failed</p>
                <p className="mt-1 text-xs text-rose-600/80 dark:text-rose-400/60 leading-relaxed">{error}</p>
              </div>
            ) : translatedText ? (
              <div className="flex flex-col space-y-3">
                <p className="text-lg leading-relaxed text-slate-900 dark:text-slate-100 whitespace-pre-wrap font-medium">
                  {translatedText}
                </p>
                {pronunciation && (
                  <p className="text-sm text-indigo-500 dark:text-indigo-400 font-medium italic mt-2">
                    {pronunciation}
                  </p>
                )}
              </div>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-indigo-300 dark:text-indigo-800/50">
                {/* Empty State */}
              </div>
            )}
          </div>

          {/* Action Footer */}
          <div className="mt-4 flex items-center justify-between pt-3">
            <div className="flex items-center space-x-2">
              <button
                onClick={playAudio}
                disabled={!translatedText || isLoading}
                className={`flex h-10 w-10 items-center justify-center rounded-full transition-all shadow-sm ${
                  isPlayingAudio
                    ? 'bg-indigo-600 text-white shadow-indigo-500/30'
                    : 'bg-white text-slate-600 hover:scale-105 hover:text-indigo-600 disabled:opacity-50 dark:bg-slate-800 dark:text-slate-400 dark:hover:text-indigo-400'
                }`}
                title="Read translation aloud"
              >
                <Volume2 className={`h-5 w-5 ${isPlayingAudio ? 'animate-pulse' : ''}`} />
              </button>
              <button
                onClick={() => copyToClipboard(translatedText, false)}
                disabled={!translatedText || isLoading}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-600 transition-all hover:scale-105 hover:text-indigo-600 disabled:opacity-50 dark:bg-slate-800 dark:text-slate-400 dark:hover:text-indigo-400 shadow-sm"
                title="Copy translation"
              >
                {copiedOutput ? <Check className="h-5 w-5 text-emerald-500" /> : <Copy className="h-5 w-5" />}
              </button>
            </div>
            

          </div>
        </div>

      </div>

      {/* Floating Translate Button (Absolute Center Bottom) */}
      <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 z-20">
        <button
          onClick={onTranslate}
          disabled={!inputText.trim() || isLoading}
          className="flex items-center space-x-2 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 px-8 py-3 text-sm font-black tracking-wide text-white shadow-xl shadow-purple-500/20 hover:scale-105 hover:shadow-purple-500/40 disabled:opacity-50 disabled:hover:scale-100 transition-all duration-300"
        >
          <Sparkles className="h-5 w-5" />
          <span>TRANSLATE</span>
        </button>
      </div>
      
    </div>
  );
}
