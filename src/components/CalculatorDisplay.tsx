import React, { useRef, useEffect } from 'react';
import {
  AngleMode,
  NumberMode,
  CalculationResult,
} from '../services/mathEngine';
import {
  Copy,
  Check,
  Sparkles,
  TrendingUp,
  Volume2,
  Trash2,
  CornerDownLeft,
} from 'lucide-react';

interface CalculatorDisplayProps {
  expression: string;
  setExpression: (val: string) => void;
  result: CalculationResult;
  angleMode: AngleMode;
  setAngleMode: (mode: AngleMode) => void;
  numberMode: NumberMode;
  setNumberMode: (mode: NumberMode) => void;
  onEvaluate: () => void;
  onClear: () => void;
  onExplainWithAI: (expr: string, res: string) => void;
  onPlotFunction: (expr: string) => void;
  onSpeakResult: (text: string) => void;
}

export const CalculatorDisplay: React.FC<CalculatorDisplayProps> = ({
  expression,
  setExpression,
  result,
  angleMode,
  setAngleMode,
  numberMode,
  setNumberMode,
  onEvaluate,
  onClear,
  onExplainWithAI,
  onPlotFunction,
  onSpeakResult,
}) => {
  const [copied, setCopied] = React.useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleCopy = () => {
    if (!result.formatted) return;
    navigator.clipboard.writeText(result.formatted);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onEvaluate();
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl relative overflow-hidden">
      {/* Top Bar: Angle Mode & Number Mode Selectors */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800/80 mb-3">
        {/* Angle Mode Toggle */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800/60 text-xs">
          {(['DEG', 'RAD', 'GRAD'] as AngleMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => setAngleMode(mode)}
              className={`px-2.5 py-1 rounded font-mono font-medium transition-colors ${
                angleMode === mode
                  ? 'bg-cyan-950 text-cyan-300 border border-cyan-800/60 shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>

        {/* Real vs Complex Mode Toggle */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800/60 text-xs">
          {(['REAL', 'COMPLEX'] as NumberMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => setNumberMode(mode)}
              className={`px-2.5 py-1 rounded font-mono font-medium transition-colors ${
                numberMode === mode
                  ? 'bg-indigo-950 text-indigo-300 border border-indigo-800/60 shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {mode === 'COMPLEX' ? 'ℂ COMPLEX (i)' : 'ℝ REAL'}
            </button>
          ))}
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1.5 ml-auto">
          {expression && (
            <button
              onClick={onClear}
              title="Clear input (AC)"
              className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-800/80 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
          {result.formatted && result.formatted !== '0' && result.formatted !== 'Error' && (
            <>
              <button
                onClick={handleCopy}
                title="Copy Result"
                className="p-1.5 text-slate-400 hover:text-cyan-300 hover:bg-slate-800/80 rounded-lg transition-colors"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
              <button
                onClick={() => onSpeakResult(`The result of ${expression} is ${result.formatted}`)}
                title="Speak result with gemini-3.8-flash-tts"
                className="p-1.5 text-slate-400 hover:text-emerald-400 hover:bg-slate-800/80 rounded-lg transition-colors"
              >
                <Volume2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => onExplainWithAI(expression, result.formatted)}
                title="Explain derivation with Gemini AI"
                className="p-1.5 text-indigo-400 hover:text-indigo-300 hover:bg-indigo-950/50 rounded-lg transition-colors"
              >
                <Sparkles className="w-4 h-4" />
              </button>
              {expression.includes('x') && (
                <button
                  onClick={() => onPlotFunction(expression)}
                  title="Plot in Function Grapher"
                  className="p-1.5 text-cyan-400 hover:text-cyan-300 hover:bg-cyan-950/50 rounded-lg transition-colors"
                >
                  <TrendingUp className="w-4 h-4" />
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Expression input field */}
      <div className="relative">
        <label htmlFor="math-calc-input" className="sr-only">
          Mathematical Expression
        </label>
        <input
          id="math-calc-input"
          ref={inputRef}
          type="text"
          value={expression}
          onChange={(e) => setExpression(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="e.g. (3 + 4i) * (2 - i) or sin(45) + sqrt(144)"
          className="w-full bg-transparent font-mono text-xl sm:text-2xl text-slate-100 placeholder:text-slate-600 focus:outline-none border-b border-transparent focus:border-cyan-500/50 py-1 transition-all"
        />
      </div>

      {/* Main Calculated Result Display */}
      <div className="mt-4 pt-3 flex flex-col items-end justify-end min-h-[64px]">
        {result.error ? (
          <div className="text-red-400 text-sm font-mono flex items-center gap-1.5">
            <span>Syntax/Domain Error: {result.error}</span>
          </div>
        ) : (
          <div className="flex items-baseline gap-2">
            <span className="text-slate-500 font-mono text-xl select-none">=</span>
            <span className="text-3xl sm:text-4xl font-mono font-semibold tracking-tight text-cyan-300 select-all break-all">
              {result.formatted || '0'}
            </span>
          </div>
        )}

        {/* Polar & Magnitude breakdown for Complex Numbers */}
        {result.isComplex && result.magnitude !== undefined && result.angleDeg !== undefined && (
          <div className="mt-2.5 flex flex-wrap items-center justify-end gap-x-4 gap-y-1 text-xs text-slate-400 font-mono bg-slate-950/80 px-3 py-1.5 rounded-lg border border-slate-800">
            <div>
              <span className="text-slate-500">|z| = </span>
              <span className="text-indigo-300 font-medium">
                {result.magnitude.toFixed(5)}
              </span>
            </div>
            <span className="text-slate-600">·</span>
            <div>
              <span className="text-slate-500">arg(z) = </span>
              <span className="text-indigo-300 font-medium">
                {result.angleDeg.toFixed(2)}°
              </span>
              <span className="text-slate-500"> ({result.angleRad?.toFixed(4)} rad)</span>
            </div>
            <span className="text-slate-600">·</span>
            <div>
              <span className="text-slate-500">Polar: </span>
              <span className="text-indigo-300">
                {result.magnitude.toFixed(4)} · e
                <sup>{result.angleRad?.toFixed(3)}i</sup>
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
