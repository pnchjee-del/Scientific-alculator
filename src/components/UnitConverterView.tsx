import React, { useState, useMemo } from 'react';
import {
  UNIT_CATEGORIES,
  convertUnit,
  UnitCategory,
} from '../services/unitConverter';
import {
  ArrowLeftRight,
  Sparkles,
  Volume2,
  Copy,
  Check,
  Ruler,
  Scale,
  Thermometer,
  Gauge,
  Activity,
  Zap,
  Cpu,
  Square,
  Box,
  HardDrive,
  Compass,
  Anchor,
} from 'lucide-react';

interface UnitConverterViewProps {
  onAskAI: (query: string) => void;
  onSpeak: (text: string) => void;
}

export const UnitConverterView: React.FC<UnitConverterViewProps> = ({
  onAskAI,
  onSpeak,
}) => {
  const [selectedCatId, setSelectedCatId] = useState<string>('length');
  const [fromUnitId, setFromUnitId] = useState<string>('m');
  const [toUnitId, setToUnitId] = useState<string>('ft');
  const [inputValue, setInputValue] = useState<string>('1');
  const [scientificNotation, setScientificNotation] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const activeCategory: UnitCategory = useMemo(() => {
    return UNIT_CATEGORIES.find((c) => c.id === selectedCatId) || UNIT_CATEGORIES[0];
  }, [selectedCatId]);

  // When category changes, reset from & to units
  const handleSelectCategory = (catId: string) => {
    setSelectedCatId(catId);
    const cat = UNIT_CATEGORIES.find((c) => c.id === catId);
    if (cat && cat.units.length >= 2) {
      setFromUnitId(cat.units[0].id);
      setToUnitId(cat.units[1].id);
    }
  };

  const handleSwapUnits = () => {
    const temp = fromUnitId;
    setFromUnitId(toUnitId);
    setToUnitId(temp);
  };

  // Compute conversion
  const conversionData = useMemo(() => {
    const val = parseFloat(inputValue);
    try {
      return convertUnit(selectedCatId, fromUnitId, toUnitId, val);
    } catch {
      return { result: 0, formula: 'Conversion error', reciprocal: 0 };
    }
  }, [selectedCatId, fromUnitId, toUnitId, inputValue]);

  const fromUnit = activeCategory.units.find((u) => u.id === fromUnitId);
  const toUnit = activeCategory.units.find((u) => u.id === toUnitId);

  const formattedResult = useMemo(() => {
    const res = conversionData.result;
    if (isNaN(res) || !isFinite(res)) return '0';
    if (scientificNotation) {
      return res.toExponential(6);
    }
    if (Math.abs(res) < 1e-4 || Math.abs(res) >= 1e9) {
      return res.toExponential(6);
    }
    return parseFloat(res.toFixed(8)).toLocaleString('en-US', {
      maximumFractionDigits: 8,
    });
  }, [conversionData.result, scientificNotation]);

  const handleCopy = () => {
    navigator.clipboard.writeText(`${formattedResult} ${toUnit?.symbol || ''}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  // Helper icon renderer
  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Ruler': return <Ruler className="w-4 h-4" />;
      case 'Scale': return <Scale className="w-4 h-4" />;
      case 'Thermometer': return <Thermometer className="w-4 h-4" />;
      case 'Gauge': return <Gauge className="w-4 h-4" />;
      case 'Activity': return <Activity className="w-4 h-4" />;
      case 'Zap': return <Zap className="w-4 h-4" />;
      case 'Cpu': return <Cpu className="w-4 h-4" />;
      case 'Square': return <Square className="w-4 h-4" />;
      case 'Box': return <Box className="w-4 h-4" />;
      case 'HardDrive': return <HardDrive className="w-4 h-4" />;
      case 'Compass': return <Compass className="w-4 h-4" />;
      case 'Anchor': return <Anchor className="w-4 h-4" />;
      default: return <Ruler className="w-4 h-4" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Category selection bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl">
        <span className="text-xs font-semibold text-slate-400 block mb-3 uppercase tracking-wider font-mono">
          Conversion Domains
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
          {UNIT_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleSelectCategory(cat.id)}
              className={`flex items-center gap-2 p-2.5 rounded-xl border text-left transition-all ${
                selectedCatId === cat.id
                  ? 'bg-slate-800 text-cyan-300 border-cyan-500/50 shadow-md shadow-cyan-950/40'
                  : 'bg-slate-950/60 text-slate-400 border-slate-800/80 hover:bg-slate-800/50 hover:text-slate-200'
              }`}
            >
              <span className={selectedCatId === cat.id ? 'text-cyan-400' : 'text-slate-500'}>
                {getCategoryIcon(cat.iconName)}
              </span>
              <span className="text-xs font-medium truncate">{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Conversion Workspace */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-7 shadow-xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2 text-sm text-slate-300">
            <span className="font-semibold text-slate-100">{activeCategory.name} Converter</span>
            <span className="text-slate-500">·</span>
            <span className="text-xs text-slate-400 font-mono">Base: {activeCategory.baseUnit}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setScientificNotation(!scientificNotation)}
              className={`px-2.5 py-1 text-xs font-mono rounded-lg border transition-colors ${
                scientificNotation
                  ? 'bg-cyan-950 text-cyan-300 border-cyan-800'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              Sci Notation (10ⁿ)
            </button>
          </div>
        </div>

        {/* Input & Output Fields */}
        <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-center">
          {/* FROM UNIT */}
          <div className="md:col-span-5 bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-slate-400">From</label>
              <span className="text-xs text-slate-500 font-mono">{fromUnit?.symbol}</span>
            </div>

            <input
              type="number"
              step="any"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-full bg-transparent font-mono text-2xl font-bold text-slate-100 focus:outline-none"
              placeholder="0"
            />

            <select
              value={fromUnitId}
              onChange={(e) => setFromUnitId(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs font-medium text-slate-200 focus:border-cyan-500 focus:outline-none"
            >
              {activeCategory.units.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name} ({u.symbol})
                </option>
              ))}
            </select>
          </div>

          {/* SWAP BUTTON */}
          <div className="md:col-span-1 flex justify-center">
            <button
              onClick={handleSwapUnits}
              title="Swap units"
              className="p-3 bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded-full border border-slate-700 shadow-md transition-all active:rotate-180"
            >
              <ArrowLeftRight className="w-4 h-4" />
            </button>
          </div>

          {/* TO UNIT */}
          <div className="md:col-span-5 bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-slate-400">To</label>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleCopy}
                  title="Copy converted value"
                  className="p-1 text-slate-400 hover:text-cyan-300 rounded transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
                <span className="text-xs text-slate-500 font-mono">{toUnit?.symbol}</span>
              </div>
            </div>

            <div className="font-mono text-2xl font-bold text-cyan-300 truncate select-all">
              {formattedResult}
            </div>

            <select
              value={toUnitId}
              onChange={(e) => setToUnitId(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs font-medium text-slate-200 focus:border-cyan-500 focus:outline-none"
            >
              {activeCategory.units.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name} ({u.symbol})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Formula breakdown & AI Assist */}
        <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
          <div className="space-y-1">
            <span className="text-slate-500 block">Conversion Ratio & Formula</span>
            <span className="text-indigo-300 font-semibold text-sm">{conversionData.formula}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                onSpeak(
                  `${inputValue} ${fromUnit?.name} is equal to ${formattedResult} ${toUnit?.name}. The conversion rule is ${conversionData.formula}.`
                )
              }
              title="Listen to conversion speech with gemini-3.8-flash-tts"
              className="flex items-center gap-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 transition-colors"
            >
              <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Read Aloud</span>
            </button>

            <button
              onClick={() =>
                onAskAI(
                  `Please explain the physical meaning, dimensional formula, and history behind converting ${fromUnit?.name} (${fromUnit?.symbol}) to ${toUnit?.name} (${toUnit?.symbol}).`
                )
              }
              title="Ask Gemini AI for deep dimensional analysis"
              className="flex items-center gap-1 px-3 py-1.5 bg-indigo-950/70 hover:bg-indigo-900/80 text-indigo-300 rounded-lg border border-indigo-800/60 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Dimensional Analysis</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
