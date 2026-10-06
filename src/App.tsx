import React, { useState, useEffect, useCallback } from 'react';
import {
  evaluateMath,
  AngleMode,
  NumberMode,
  CalculationResult,
  CalculationHistoryItem,
} from './services/mathEngine';
import { Navbar, ActiveTab } from './components/Navbar';
import { CalculatorDisplay } from './components/CalculatorDisplay';
import { ScientificKeypad } from './components/ScientificKeypad';
import { ComplexEquationSolver } from './components/ComplexEquationSolver';
import { UnitConverterView } from './components/UnitConverterView';
import { FunctionGrapher } from './components/FunctionGrapher';
import { GeminiChatbot } from './components/GeminiChatbot';
import { TTSModal } from './components/TTSModal';
import { ImageVisualizerModal } from './components/ImageVisualizerModal';
import { HistoryDrawer } from './components/HistoryDrawer';
import {
  Sparkles,
  Volume2,
  Image as ImageIcon,
  HelpCircle,
  Calculator,
  Binary,
  ArrowLeftRight,
  TrendingUp,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function App() {
  // Navigation
  const [activeTab, setActiveTab] = useState<ActiveTab>('calculator');

  // Calculator State
  const [expression, setExpression] = useState<string>('(3 + 4i) * (2 - i)');
  const [angleMode, setAngleMode] = useState<AngleMode>('RAD');
  const [numberMode, setNumberMode] = useState<NumberMode>('COMPLEX');
  const [lastAns, setLastAns] = useState<string>('0');

  // Evaluation Result
  const [result, setResult] = useState<CalculationResult>(() =>
    evaluateMath('(3 + 4i) * (2 - i)', 'RAD', 'COMPLEX')
  );

  // History State
  const [history, setHistory] = useState<CalculationHistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('aethercalc_history');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [];
  });
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);

  // Modals State
  const [isTTSOpen, setIsTTSOpen] = useState<boolean>(false);
  const [ttsDefaultText, setTTSDefaultText] = useState<string>('');

  const [isImageModalOpen, setIsImageModalOpen] = useState<boolean>(false);
  const [imageModalPrompt, setImageModalPrompt] = useState<string>('');

  // Graph state handoff
  const [graphInitialExpr, setGraphInitialExpr] = useState<string>('sin(x)');

  // AI Tutor prompt handoff
  const [aiTutorPrompt, setAiTutorPrompt] = useState<string>('');

  // Save history to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('aethercalc_history', JSON.stringify(history));
    } catch {}
  }, [history]);

  // Evaluate current expression
  const handleEvaluate = useCallback(() => {
    if (!expression.trim()) return;

    const res = evaluateMath(expression, angleMode, numberMode);
    setResult(res);

    if (res.formatted && res.formatted !== 'Error' && !res.error) {
      setLastAns(res.formatted);

      // Add to history
      const historyItem: CalculationHistoryItem = {
        id: 'hist-' + Date.now(),
        expression,
        result: res.formatted,
        timestamp: Date.now(),
        isComplex: res.isComplex,
        angleMode,
      };

      setHistory((prev) => [historyItem, ...prev.slice(0, 49)]);

      // Fun little micro-celebration if it's Euler's formula
      if (expression.includes('exp(i*pi)') || expression.includes('exp(i * pi)')) {
        confetti({ particleCount: 35, spread: 60, origin: { y: 0.8 } });
      }
    }
  }, [expression, angleMode, numberMode]);

  // Insert token to expression
  const handleInsert = (token: string) => {
    setExpression((prev) => prev + token);
  };

  const handleClear = () => {
    setExpression('');
    setResult({ raw: 0, formatted: '0', isComplex: false });
  };

  const handleBackspace = () => {
    setExpression((prev) => prev.slice(0, -1));
  };

  const handleInsertAns = () => {
    setExpression((prev) => prev + (lastAns || '0'));
  };

  // Keyboard navigation & inputs
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing in inputs or textareas
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return;
      }

      if (e.key === 'Enter') {
        e.preventDefault();
        handleEvaluate();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        handleClear();
      } else if (e.key === 'Backspace') {
        e.preventDefault();
        handleBackspace();
      } else if (['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '+', '-', '*', '/', '(', ')', '^', '.', 'i'].includes(e.key)) {
        e.preventDefault();
        handleInsert(e.key);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleEvaluate]);

  // Handoff to AI Tutor
  const handleExplainWithAI = (expr: string, res: string) => {
    const prompt = `Please provide a step-by-step mathematical derivation and physical intuition for the calculation: ${expr} = ${res}.`;
    setAiTutorPrompt(prompt);
    setActiveTab('ai-tutor');
  };

  // Handoff to TTS
  const handleSpeakText = (text: string) => {
    setTTSDefaultText(text);
    setIsTTSOpen(true);
  };

  // Handoff to Function Grapher
  const handlePlotFunction = (expr: string) => {
    setGraphInitialExpr(expr);
    setActiveTab('graph');
  };

  // Handoff to Image Visualizer
  const handleOpenVisualizerWithPrompt = (prompt: string) => {
    setImageModalPrompt(prompt);
    setIsImageModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        openTTSModal={() => {
          setTTSDefaultText('Welcome to AetherCalc. Convert any mathematical derivation or scientific theory to speech.');
          setIsTTSOpen(true);
        }}
        openImageModal={() => {
          setImageModalPrompt('3D mathematical visualization of a complex Riemann surface for w = sqrt(z) in 4K resolution');
          setIsImageModalOpen(true);
        }}
        toggleHistory={() => setIsHistoryOpen(!isHistoryOpen)}
        historyCount={history.length}
      />

      {/* Main Viewport Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Tab 1: Scientific & Complex Calculator */}
        {activeTab === 'calculator' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-8">
              <CalculatorDisplay
                expression={expression}
                setExpression={setExpression}
                result={result}
                angleMode={angleMode}
                setAngleMode={setAngleMode}
                numberMode={numberMode}
                setNumberMode={setNumberMode}
                onEvaluate={handleEvaluate}
                onClear={handleClear}
                onExplainWithAI={handleExplainWithAI}
                onPlotFunction={handlePlotFunction}
                onSpeakResult={handleSpeakText}
              />

              <ScientificKeypad
                onInsert={handleInsert}
                onClear={handleClear}
                onBackspace={handleBackspace}
                onEvaluate={handleEvaluate}
                onInsertAns={handleInsertAns}
              />
            </div>

            {/* Right Side Computational Reference & Quick Actions */}
            <div className="lg:col-span-4 space-y-4">
              {/* Complex Number Quick Reference Card */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="text-xs font-semibold text-slate-200 font-mono flex items-center gap-1.5">
                    <Binary className="w-4 h-4 text-indigo-400" />
                    <span>Complex Numbers (ℂ)</span>
                  </span>
                  <span className="text-[11px] text-indigo-400 font-mono bg-indigo-950/70 px-2 py-0.5 rounded border border-indigo-900/60">
                    z = a + bi
                  </span>
                </div>

                <div className="text-xs text-slate-400 space-y-2 font-mono">
                  <div className="flex justify-between items-center bg-slate-950 p-2 rounded-lg border border-slate-800/80">
                    <span className="text-slate-500">Imaginary unit:</span>
                    <span className="text-indigo-300 font-semibold">i² = -1 (i = √-1)</span>
                  </div>
                  <div className="flex justify-between items-center bg-slate-950 p-2 rounded-lg border border-slate-800/80">
                    <span className="text-slate-500">Euler's Formula:</span>
                    <span className="text-indigo-300">e^(iθ) = cos(θ) + i·sin(θ)</span>
                  </div>
                  <div className="flex justify-between items-center bg-slate-950 p-2 rounded-lg border border-slate-800/80">
                    <span className="text-slate-500">Euler's Identity:</span>
                    <span className="text-cyan-300 font-bold">e^(i·π) + 1 = 0</span>
                  </div>
                  <div className="flex justify-between items-center bg-slate-950 p-2 rounded-lg border border-slate-800/80">
                    <span className="text-slate-500">Magnitude:</span>
                    <span className="text-slate-300">|z| = √(a² + b²)</span>
                  </div>
                </div>

                <div className="pt-2 flex flex-wrap gap-1.5 text-xs font-mono">
                  <button
                    onClick={() => {
                      setExpression('exp(i*pi) + 1');
                      setNumberMode('COMPLEX');
                    }}
                    className="px-2.5 py-1 bg-slate-800 hover:bg-slate-750 text-indigo-300 rounded border border-slate-700/60"
                  >
                    e^(iπ) + 1
                  </button>
                  <button
                    onClick={() => {
                      setExpression('sqrt(-64)');
                      setNumberMode('COMPLEX');
                    }}
                    className="px-2.5 py-1 bg-slate-800 hover:bg-slate-750 text-cyan-300 rounded border border-slate-700/60"
                  >
                    √(-64)
                  </button>
                  <button
                    onClick={() => {
                      setExpression('(2 + 3i) * (1 - 4i)');
                      setNumberMode('COMPLEX');
                    }}
                    className="px-2.5 py-1 bg-slate-800 hover:bg-slate-750 text-slate-300 rounded border border-slate-700/60"
                  >
                    (2+3i)(1-4i)
                  </button>
                </div>
              </div>

              {/* AI & Multi-Modal Shortcuts */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
                <span className="text-xs font-semibold text-slate-200 block uppercase tracking-wider font-mono">
                  Multi-Modal STEM Capabilities
                </span>

                <div className="space-y-2">
                  <button
                    onClick={() => {
                      setAiTutorPrompt('Explain the mathematical significance of complex numbers in electrical engineering (impedance) and quantum mechanics (wavefunctions).');
                      setActiveTab('ai-tutor');
                    }}
                    className="w-full text-left p-3 rounded-xl bg-slate-950 hover:bg-slate-850 border border-slate-800/80 transition-colors flex items-center justify-between group"
                  >
                    <div className="space-y-0.5">
                      <div className="text-xs font-semibold text-indigo-300 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Gemini 3.1 Pro Chatbot</span>
                      </div>
                      <p className="text-[11px] text-slate-500">
                        Multi-turn math tutor & proof verifier
                      </p>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      setTTSDefaultText('The imaginary unit i satisfies the algebraic equation i squared equals negative one. It extends the real numbers into the complex plane, unlocking solutions to all polynomial equations through the Fundamental Theorem of Algebra.');
                      setIsTTSOpen(true);
                    }}
                    className="w-full text-left p-3 rounded-xl bg-slate-950 hover:bg-slate-850 border border-slate-800/80 transition-colors flex items-center justify-between group"
                  >
                    <div className="space-y-0.5">
                      <div className="text-xs font-semibold text-emerald-300 flex items-center gap-1.5">
                        <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>gemini-3.8-flash-tts Speech</span>
                      </div>
                      <p className="text-[11px] text-slate-500">
                        Natural voice math explanation audio
                      </p>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      setImageModalPrompt('3D mathematical visualization of a complex Riemann surface for w = sqrt(z) with rainbow phase contours on a dark background');
                      setIsImageModalOpen(true);
                    }}
                    className="w-full text-left p-3 rounded-xl bg-slate-950 hover:bg-slate-850 border border-slate-800/80 transition-colors flex items-center justify-between group"
                  >
                    <div className="space-y-0.5">
                      <div className="text-xs font-semibold text-cyan-300 flex items-center gap-1.5">
                        <ImageIcon className="w-3.5 h-3.5 text-cyan-400" />
                        <span>gemini-3-pro-image-preview</span>
                      </div>
                      <p className="text-[11px] text-slate-500">
                        High-res 1K, 2K, 4K scientific diagrams
                      </p>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Complex Equation & Calculus Solver */}
        {activeTab === 'equations' && (
          <ComplexEquationSolver
            onAskAI={(q) => {
              setAiTutorPrompt(q);
              setActiveTab('ai-tutor');
            }}
            onSpeak={handleSpeakText}
            onPlotFunction={handlePlotFunction}
          />
        )}

        {/* Tab 3: Unit Converter */}
        {activeTab === 'units' && (
          <UnitConverterView
            onAskAI={(q) => {
              setAiTutorPrompt(q);
              setActiveTab('ai-tutor');
            }}
            onSpeak={handleSpeakText}
          />
        )}

        {/* Tab 4: Function Grapher */}
        {activeTab === 'graph' && (
          <FunctionGrapher
            initialExpr={graphInitialExpr}
            onAskAI={(q) => {
              setAiTutorPrompt(q);
              setActiveTab('ai-tutor');
            }}
            onOpenVisualizerWithPrompt={handleOpenVisualizerWithPrompt}
          />
        )}

        {/* Tab 5: Multi-Turn Gemini AI Tutor */}
        {activeTab === 'ai-tutor' && (
          <GeminiChatbot
            initialPrompt={aiTutorPrompt}
            onSpeakText={handleSpeakText}
          />
        )}
      </main>

      {/* History Drawer */}
      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onClearHistory={() => setHistory([])}
        onRecallExpression={(expr) => {
          setExpression(expr);
          setIsHistoryOpen(false);
          setActiveTab('calculator');
        }}
        onSpeak={handleSpeakText}
        onExplainAI={handleExplainWithAI}
      />

      {/* Text-to-Speech (TTS) Modal with gemini-3.8-flash-tts */}
      <TTSModal
        isOpen={isTTSOpen}
        onClose={() => setIsTTSOpen(false)}
        defaultText={ttsDefaultText}
      />

      {/* High-Quality Image Visualizer Modal with gemini-3-pro-image-preview & 1K/2K/4K */}
      <ImageVisualizerModal
        isOpen={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
        defaultPrompt={imageModalPrompt}
      />

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-4 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-400">AetherCalc Computational Studio</span>
            <span>·</span>
            <span>Arbitrary-Precision & Complex Math Engine</span>
          </div>

          <div className="flex items-center gap-3 font-mono text-[11px]">
            <span>TTS: gemini-3.8-flash-tts</span>
            <span>·</span>
            <span>Image: gemini-3-pro-image-preview (1K/2K/4K)</span>
            <span>·</span>
            <span>Chat: gemini-3.1-pro-preview</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
