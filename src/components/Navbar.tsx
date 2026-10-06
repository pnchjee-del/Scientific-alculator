import React from 'react';
import {
  Calculator,
  Binary,
  ArrowLeftRight,
  TrendingUp,
  Bot,
  Sparkles,
  Volume2,
  Image as ImageIcon,
  History,
} from 'lucide-react';

export type ActiveTab = 'calculator' | 'equations' | 'units' | 'graph' | 'ai-tutor';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  openTTSModal: () => void;
  openImageModal: () => void;
  toggleHistory: () => void;
  historyCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  openTTSModal,
  openImageModal,
  toggleHistory,
  historyCount,
}) => {
  return (
    <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-lg shadow-cyan-950/50">
              <Calculator className="w-5 h-5 text-cyan-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-cyan-300 via-sky-200 to-indigo-200 bg-clip-text text-transparent">
                  AetherCalc
                </span>
                <span className="text-xs text-slate-500 font-mono tracking-wider hidden sm:inline">
                  v2.4 · SCI & STEM
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-normal hidden md:block">
                Precision Computational Studio · Complex Numbers · Gemini AI
              </p>
            </div>
          </div>

          {/* Navigation Tabs (Functional Button Controls with zero-pill restraint) */}
          <nav className="flex items-center p-1 bg-slate-950/70 border border-slate-800/80 rounded-xl">
            <button
              onClick={() => setActiveTab('calculator')}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                activeTab === 'calculator'
                  ? 'bg-slate-800 text-cyan-300 shadow-sm border border-slate-700/60'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
              }`}
            >
              <Calculator className="w-3.5 h-3.5" />
              <span>Calculator</span>
            </button>

            <button
              onClick={() => setActiveTab('equations')}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                activeTab === 'equations'
                  ? 'bg-slate-800 text-cyan-300 shadow-sm border border-slate-700/60'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
              }`}
            >
              <Binary className="w-3.5 h-3.5" />
              <span>Equations</span>
            </button>

            <button
              onClick={() => setActiveTab('units')}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                activeTab === 'units'
                  ? 'bg-slate-800 text-cyan-300 shadow-sm border border-slate-700/60'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
              }`}
            >
              <ArrowLeftRight className="w-3.5 h-3.5" />
              <span>Units</span>
            </button>

            <button
              onClick={() => setActiveTab('graph')}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                activeTab === 'graph'
                  ? 'bg-slate-800 text-cyan-300 shadow-sm border border-slate-700/60'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Grapher</span>
            </button>

            <button
              onClick={() => setActiveTab('ai-tutor')}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                activeTab === 'ai-tutor'
                  ? 'bg-slate-800 text-indigo-300 shadow-sm border border-indigo-700/60'
                  : 'text-slate-400 hover:text-indigo-200 hover:bg-slate-900/50'
              }`}
            >
              <Bot className="w-3.5 h-3.5 text-indigo-400" />
              <span>AI Tutor</span>
            </button>
          </nav>

          {/* Quick AI & Utility Tools */}
          <div className="flex items-center gap-2">
            {/* Visualizer modal button */}
            <button
              onClick={openImageModal}
              title="Generate 1K/2K/4K Scientific Visualization with gemini-3-pro-image-preview"
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 rounded-lg transition-colors"
            >
              <ImageIcon className="w-3.5 h-3.5 text-cyan-400" />
              <span>Visualizer (4K)</span>
            </button>

            {/* TTS modal button */}
            <button
              onClick={openTTSModal}
              title="Convert Math & Explanations to Speech with gemini-3.8-flash-tts"
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 rounded-lg transition-colors"
            >
              <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Speech (TTS)</span>
            </button>

            {/* History reel button */}
            <button
              onClick={toggleHistory}
              title="Calculation History"
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 rounded-lg transition-colors"
            >
              <History className="w-3.5 h-3.5 text-slate-400" />
              {historyCount > 0 && (
                <span className="text-[10px] bg-cyan-900/80 text-cyan-300 px-1.5 py-0.2 rounded font-mono">
                  {historyCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
