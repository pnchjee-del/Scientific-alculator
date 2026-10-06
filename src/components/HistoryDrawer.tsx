import React from 'react';
import { CalculationHistoryItem } from '../services/mathEngine';
import {
  History,
  X,
  Trash2,
  Copy,
  Check,
  ArrowUpRight,
  Volume2,
  Sparkles,
} from 'lucide-react';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  history: CalculationHistoryItem[];
  onClearHistory: () => void;
  onRecallExpression: (expr: string) => void;
  onSpeak: (text: string) => void;
  onExplainAI: (expr: string, res: string) => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  history,
  onClearHistory,
  onRecallExpression,
  onSpeak,
  onExplainAI,
}) => {
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/60 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-md bg-slate-900 border-l border-slate-800 h-full shadow-2xl flex flex-col animate-slide-in">
        {/* Header */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-slate-100">Calculation Reel</h3>
            <span className="text-[11px] font-mono text-slate-500">({history.length})</span>
          </div>

          <div className="flex items-center gap-1">
            {history.length > 0 && (
              <button
                onClick={onClearHistory}
                className="p-1.5 text-slate-400 hover:text-red-400 rounded-lg hover:bg-slate-800 transition-colors"
                title="Clear all history"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-100 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {history.length === 0 ? (
            <div className="text-center py-12 text-slate-500 space-y-2">
              <History className="w-8 h-8 mx-auto text-slate-700" />
              <p className="text-xs font-mono">No previous calculations recorded</p>
            </div>
          ) : (
            history.map((item) => (
              <div
                key={item.id}
                className="p-3.5 bg-slate-950 border border-slate-800/80 rounded-xl space-y-2 hover:border-slate-700 transition-colors group"
              >
                <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
                  <span>{new Date(item.timestamp).toLocaleTimeString()}</span>
                  <div className="flex items-center gap-1.5">
                    <span className="bg-slate-900 px-1.5 py-0.2 rounded border border-slate-800">
                      {item.angleMode}
                    </span>
                    {item.isComplex && (
                      <span className="text-indigo-400 bg-indigo-950/80 px-1.5 py-0.2 rounded border border-indigo-900/60">
                        Complex
                      </span>
                    )}
                  </div>
                </div>

                {/* Expression */}
                <div
                  onClick={() => onRecallExpression(item.expression)}
                  className="font-mono text-xs text-slate-300 break-all cursor-pointer hover:text-cyan-300 flex items-center justify-between group-hover:underline"
                  title="Click to recall expression into calculator"
                >
                  <span>{item.expression}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 text-cyan-400 shrink-0 ml-1" />
                </div>

                {/* Result */}
                <div className="flex items-baseline justify-between pt-1 border-t border-slate-800/60 font-mono">
                  <span className="text-slate-500 text-xs">=</span>
                  <span className="text-sm font-semibold text-cyan-300 select-all break-all">
                    {item.result}
                  </span>
                </div>

                {/* Action buttons */}
                <div className="flex items-center justify-end gap-2 pt-1 border-t border-slate-800/40 text-xs">
                  <button
                    onClick={() => handleCopy(item.id, item.result)}
                    className="p-1 text-slate-400 hover:text-cyan-300 transition-colors"
                    title="Copy result"
                  >
                    {copiedId === item.id ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                  <button
                    onClick={() => onSpeak(`The result of ${item.expression} is ${item.result}`)}
                    className="p-1 text-slate-400 hover:text-emerald-400 transition-colors"
                    title="Read aloud with TTS"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onExplainAI(item.expression, item.result)}
                    className="p-1 text-slate-400 hover:text-indigo-300 transition-colors"
                    title="Explain with AI Tutor"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
