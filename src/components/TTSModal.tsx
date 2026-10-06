import React, { useState, useRef, useEffect } from 'react';
import {
  Volume2,
  Play,
  Pause,
  RotateCcw,
  Download,
  X,
  Sparkles,
  AlertCircle,
  Check,
} from 'lucide-react';

interface TTSModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultText?: string;
}

export const TTSModal: React.FC<TTSModalProps> = ({
  isOpen,
  onClose,
  defaultText = '',
}) => {
  const [text, setText] = useState<string>(defaultText);
  const [voice, setVoice] = useState<string>('Kore');
  const [style, setStyle] = useState<string>(
    'Clear, articulate, natural-paced university mathematics and physics lecturer'
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Sync defaultText when modal opens
  useEffect(() => {
    if (defaultText) {
      setText(defaultText);
    }
  }, [defaultText]);

  if (!isOpen) return null;

  const handleSynthesize = async () => {
    if (!text.trim() || loading) return;

    setError(null);
    setLoading(true);

    try {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: text.trim(),
          voice,
          style,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to synthesize speech');
      }

      setAudioUrl(data.audioUrl);
      setIsPlaying(true);

      // Play audio automatically
      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.play().catch(() => {});
        }
      }, 100);
    } catch (err: any) {
      setError(err.message || 'TTS request failed');
    } finally {
      setLoading(false);
    }
  };

  const togglePlayPause = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
  };

  const handlePreset = (presetText: string) => {
    setText(presetText);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center text-emerald-300">
              <Volume2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <span>Text-to-Speech Engine</span>
                <span className="text-[10px] text-emerald-400 font-mono bg-emerald-950/80 px-1.5 py-0.2 rounded border border-emerald-800/60">
                  gemini-3.8-flash-tts
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Synthesize natural mathematical, proof, and scientific explanations
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
          {/* Text Input */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-300">
                Text or Mathematical Explanation
              </label>
              <span className="text-[11px] text-slate-500 font-mono">{text.length}/1000 chars</span>
            </div>
            <textarea
              rows={4}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter any math derivation, formula, or problem explanation to speak aloud..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-slate-100 focus:outline-none focus:border-emerald-500 resize-none font-sans"
            />
          </div>

          {/* Quick Presets */}
          <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-mono pb-1">
            <span className="text-slate-500 shrink-0">Presets:</span>
            <button
              onClick={() =>
                handlePreset(
                  'Euler’s identity states that e raised to the power of i times pi plus 1 equals 0, elegantly linking five fundamental mathematical constants.'
                )
              }
              className="px-2 py-1 bg-slate-950 hover:bg-slate-800 text-slate-300 rounded border border-slate-800 shrink-0"
            >
              Euler's Identity
            </button>
            <button
              onClick={() =>
                handlePreset(
                  'The quadratic formula gives the roots of ax squared plus bx plus c equals 0 as minus b plus or minus the square root of b squared minus 4ac, all divided by 2a.'
                )
              }
              className="px-2 py-1 bg-slate-950 hover:bg-slate-800 text-slate-300 rounded border border-slate-800 shrink-0"
            >
              Quadratic Roots
            </button>
            <button
              onClick={() =>
                handlePreset(
                  'In complex numbers, the imaginary unit i is defined as the square root of negative one. A complex number has the form a plus bi, where a is real and b is imaginary.'
                )
              }
              className="px-2 py-1 bg-slate-950 hover:bg-slate-800 text-slate-300 rounded border border-slate-800 shrink-0"
            >
              Complex Unit i
            </button>
          </div>

          {/* Voice & Style Selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div>
              <label className="text-xs text-slate-400 block mb-1">Prebuilt Voice</label>
              <select
                value={voice}
                onChange={(e) => setVoice(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 font-mono"
              >
                <option value="Kore">Kore (Clear, balanced, pedagogical)</option>
                <option value="Puck">Puck (Crisp, engaging)</option>
                <option value="Charon">Charon (Deep, formal, academic)</option>
                <option value="Fenrir">Fenrir (Authoritative, strong)</option>
                <option value="Zephyr">Zephyr (Warm, conversational)</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Speaker Style</label>
              <select
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 font-mono"
              >
                <option value="Clear, articulate, natural-paced university mathematics and physics lecturer">
                  University STEM Lecturer
                </option>
                <option value="Enthusiastic, encouraging science podcast host">
                  Enthusiastic Science Host
                </option>
                <option value="Concise, calm, deliberate technical narrator">
                  Deliberate Technical Narrator
                </option>
              </select>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-950/40 border border-red-800/60 rounded-xl text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Audio Player & Controls if synthesized */}
          {audioUrl && (
            <div className="p-4 bg-slate-950 border border-emerald-900/50 rounded-xl space-y-3">
              <audio
                ref={audioRef}
                src={audioUrl}
                onEnded={handleAudioEnded}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                className="hidden"
              />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    onClick={togglePlayPause}
                    className="w-10 h-10 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center shadow-lg transition-all active:scale-95"
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                  </button>

                  <div>
                    <span className="text-xs font-semibold text-slate-200 block">
                      Audio Synthesized (WAV 24kHz)
                    </span>
                    <span className="text-[11px] text-slate-500 font-mono">
                      Voice: {voice} · {isPlaying ? 'Playing...' : 'Ready'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={audioUrl}
                    download="aethercalc-speech.wav"
                    className="p-2 text-slate-400 hover:text-emerald-300 bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors"
                    title="Download WAV audio"
                  >
                    <Download className="w-4 h-4" />
                  </a>
                </div>
              </div>

              {/* Animated waveform visualizer bars when playing */}
              <div className="flex items-center justify-center gap-1 h-6 px-2">
                {[12, 24, 16, 28, 8, 22, 14, 26, 18, 10, 24, 16, 20, 12, 28, 14].map((h, i) => (
                  <div
                    key={i}
                    style={{
                      height: isPlaying ? `${Math.max(4, Math.round(h * Math.random()))}px` : '4px',
                    }}
                    className={`w-1 rounded-full transition-all duration-100 ${
                      isPlaying ? 'bg-emerald-400' : 'bg-slate-700'
                    }`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-500 font-mono">Model: gemini-3.8-flash-tts</span>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-slate-200"
            >
              Close
            </button>

            <button
              onClick={handleSynthesize}
              disabled={!text.trim() || loading}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-xl shadow-md text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>{loading ? 'Synthesizing...' : 'Generate Speech'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
