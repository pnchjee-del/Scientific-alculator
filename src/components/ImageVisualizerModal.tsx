import React, { useState, useEffect } from 'react';
import {
  Image as ImageIcon,
  Sparkles,
  Download,
  X,
  AlertCircle,
  Copy,
  Check,
  Maximize2,
  Sliders,
} from 'lucide-react';

interface ImageVisualizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultPrompt?: string;
}

export const ImageVisualizerModal: React.FC<ImageVisualizerModalProps> = ({
  isOpen,
  onClose,
  defaultPrompt = '',
}) => {
  const [prompt, setPrompt] = useState<string>(
    defaultPrompt ||
      '3D visualization of a complex Riemann surface for w = sqrt(z) with rainbow phase contours on a dark background'
  );

  // Resolution affordance as requested: 1K, 2K, 4K
  const [imageSize, setImageSize] = useState<'1K' | '2K' | '4K'>('2K');
  const [aspectRatio, setAspectRatio] = useState<string>('1:1');

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [generatedInfo, setGeneratedInfo] = useState<{ size: string; prompt: string } | null>(null);
  const [copiedPrompt, setCopiedPrompt] = useState<boolean>(false);

  useEffect(() => {
    if (defaultPrompt) {
      setPrompt(defaultPrompt);
    }
  }, [defaultPrompt]);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    if (!prompt.trim() || loading) return;

    setError(null);
    setLoading(true);

    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: prompt.trim(),
          imageSize, // Affordance: '1K' | '2K' | '4K'
          aspectRatio,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate scientific image');
      }

      setImageUrl(data.imageUrl);
      setGeneratedInfo({
        size: data.size || imageSize,
        prompt: prompt.trim(),
      });
    } catch (err: any) {
      setError(err.message || 'Image generation failed');
    } finally {
      setLoading(false);
    }
  };

  const handlePreset = (p: string) => {
    setPrompt(p);
  };

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(prompt);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl max-h-[92vh] shadow-2xl overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-600/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300">
              <ImageIcon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <span>Scientific Visualization Studio</span>
                <span className="text-[10px] text-cyan-400 font-mono bg-cyan-950/80 px-1.5 py-0.2 rounded border border-cyan-800/60">
                  gemini-3-pro-image-preview
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                High-resolution mathematical manifolds, physics concepts, and 3D geometric surfaces
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4 flex-1 overflow-y-auto">
          {/* Prompt input */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-300">
                Mathematical Visualization Prompt
              </label>
              <button
                onClick={handleCopyPrompt}
                className="text-[11px] text-slate-500 hover:text-slate-300 flex items-center gap-1 font-mono"
              >
                {copiedPrompt ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedPrompt ? 'Copied' : 'Copy Prompt'}</span>
              </button>
            </div>
            <textarea
              rows={3}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the mathematical surface, geometry, or scientific phenomenon to render..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-slate-100 focus:outline-none focus:border-cyan-500 resize-none font-sans"
            />
          </div>

          {/* Quick presets for mathematical concepts */}
          <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-mono pb-1">
            <span className="text-slate-500 shrink-0">Presets:</span>
            <button
              onClick={() =>
                handlePreset(
                  '3D visualization of a complex Riemann surface for w = sqrt(z) with rainbow phase contours on a dark background'
                )
              }
              className="px-2.5 py-1 bg-slate-950 hover:bg-slate-800 text-slate-300 rounded border border-slate-800 shrink-0"
            >
              Riemann Surface
            </button>
            <button
              onClick={() =>
                handlePreset(
                  'Quantum harmonic oscillator wavefunction probability density in 3D with glowing nodal surfaces and coordinate grid'
                )
              }
              className="px-2.5 py-1 bg-slate-950 hover:bg-slate-800 text-slate-300 rounded border border-slate-800 shrink-0"
            >
              Quantum Wavefunction
            </button>
            <button
              onClick={() =>
                handlePreset(
                  'Lorenz attractor chaos butterfly trajectory in 3D phase space with glowing particle trails'
                )
              }
              className="px-2.5 py-1 bg-slate-950 hover:bg-slate-800 text-slate-300 rounded border border-slate-800 shrink-0"
            >
              Lorenz Attractor
            </button>
            <button
              onClick={() =>
                handlePreset(
                  'Complex contour integration in the complex plane with pole singularities and residue arrows'
                )
              }
              className="px-2.5 py-1 bg-slate-950 hover:bg-slate-800 text-slate-300 rounded border border-slate-800 shrink-0"
            >
              Contour Integration
            </button>
          </div>

          {/* Sizing Affordance (1K, 2K, 4K) & Aspect Ratio */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 p-3 bg-slate-950/70 border border-slate-800 rounded-xl">
            {/* IMAGE SIZE AFFORDANCE */}
            <div>
              <label className="text-xs font-semibold text-slate-300 flex items-center justify-between mb-1.5">
                <span>Resolution / Image Size</span>
                <span className="text-[11px] text-cyan-400 font-mono">{imageSize} Resolution</span>
              </label>
              <div className="grid grid-cols-3 gap-2 font-mono text-xs">
                {(['1K', '2K', '4K'] as const).map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setImageSize(sz)}
                    className={`py-2 rounded-lg font-semibold border transition-all ${
                      imageSize === sz
                        ? 'bg-cyan-600 text-white border-cyan-400 shadow-md shadow-cyan-950/50'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* ASPECT RATIO */}
            <div>
              <label className="text-xs font-semibold text-slate-300 flex items-center justify-between mb-1.5">
                <span>Aspect Ratio</span>
                <span className="text-[11px] text-slate-500 font-mono">{aspectRatio}</span>
              </label>
              <div className="grid grid-cols-4 gap-1.5 font-mono text-xs">
                {['1:1', '16:9', '4:3', '9:16'].map((ar) => (
                  <button
                    key={ar}
                    onClick={() => setAspectRatio(ar)}
                    className={`py-2 rounded-lg font-medium border transition-all ${
                      aspectRatio === ar
                        ? 'bg-slate-800 text-cyan-300 border-cyan-700/60'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                    }`}
                  >
                    {ar}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {error && (
            <div className="p-3.5 bg-amber-950/30 border border-amber-800/60 rounded-xl text-amber-200 text-xs space-y-1">
              <div className="flex items-center gap-2 font-semibold text-amber-300">
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Image Generation Status</span>
              </div>
              <p className="pl-6 text-amber-200/90 leading-relaxed font-sans">{error}</p>
            </div>
          )}

          {/* Generated Image Preview Area */}
          <div className="border border-slate-800 rounded-2xl bg-slate-950 overflow-hidden min-h-[260px] flex items-center justify-center relative">
            {loading ? (
              <div className="text-center p-8 space-y-3">
                <Sparkles className="w-8 h-8 text-cyan-400 animate-spin mx-auto" />
                <div>
                  <span className="text-sm font-semibold text-slate-200 block">
                    Rendering in {imageSize} with gemini-3-pro-image-preview...
                  </span>
                  <span className="text-xs text-slate-500 mt-1 block">
                    Generating precision mathematical geometry and lighting
                  </span>
                </div>
              </div>
            ) : imageUrl ? (
              <div className="relative w-full group">
                <img
                  src={imageUrl}
                  alt={prompt}
                  className="w-full max-h-[460px] object-contain rounded-xl"
                />

                {/* Overlay details */}
                <div className="absolute bottom-3 left-3 right-3 p-3 bg-slate-950/90 backdrop-blur rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                  <div className="font-mono text-slate-300">
                    <span className="text-cyan-400 font-semibold">{generatedInfo?.size || imageSize}</span>
                    <span className="text-slate-600 mx-2">·</span>
                    <span className="text-slate-400 truncate max-w-[280px] inline-block align-bottom">
                      {generatedInfo?.prompt}
                    </span>
                  </div>

                  <a
                    href={imageUrl}
                    download="aethercalc-scientific-render.png"
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-semibold transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </a>
                </div>
              </div>
            ) : (
              <div className="text-center p-8 text-slate-500 space-y-2">
                <ImageIcon className="w-10 h-10 text-slate-700 mx-auto" />
                <p className="text-xs font-mono">
                  No visualizer render generated yet. Select resolution (1K, 2K, 4K) and click Generate.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-500 font-mono">
            Model: gemini-3-pro-image-preview ({imageSize})
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-slate-200"
            >
              Close
            </button>

            <button
              onClick={handleGenerate}
              disabled={!prompt.trim() || loading}
              className="px-5 py-2 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 disabled:opacity-50 text-white rounded-xl shadow-md text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{loading ? 'Generating...' : `Render in ${imageSize}`}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
