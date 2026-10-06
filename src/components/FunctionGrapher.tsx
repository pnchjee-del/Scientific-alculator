import React, { useRef, useEffect, useState, useCallback } from 'react';
import { create, all } from 'mathjs';
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Sparkles,
  Volume2,
  TrendingUp,
  Image as ImageIcon,
} from 'lucide-react';

const math = create(all, { number: 'number' });

interface FunctionGrapherProps {
  initialExpr?: string;
  onAskAI: (query: string) => void;
  onOpenVisualizerWithPrompt: (prompt: string) => void;
}

export const FunctionGrapher: React.FC<FunctionGrapherProps> = ({
  initialExpr = 'sin(x)',
  onAskAI,
  onOpenVisualizerWithPrompt,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [fn1, setFn1] = useState<string>(initialExpr);
  const [fn2, setFn2] = useState<string>('cos(x)');
  const [showFn2, setShowFn2] = useState<boolean>(false);

  // Coordinate viewport state
  const [xMin, setXMin] = useState<number>(-10);
  const [xMax, setXMax] = useState<number>(10);
  const [yMin, setYMin] = useState<number>(-6);
  const [yMax, setYMax] = useState<number>(6);

  // Mouse interaction state
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [hoverCoord, setHoverCoord] = useState<{ x: number; y: number; y1?: number } | null>(null);

  // Update fn1 if initialExpr changes from props
  useEffect(() => {
    if (initialExpr) setFn1(initialExpr);
  }, [initialExpr]);

  // Sanitize function string for evaluation
  const parseFn = (expr: string) => {
    let s = expr.replace(/×/g, '*').replace(/÷/g, '/').replace(/π/g, 'pi');
    return (xVal: number) => {
      try {
        const res = math.evaluate(s, { x: xVal });
        if (typeof res === 'number' && !isNaN(res) && isFinite(res)) {
          return res;
        }
        return null;
      } catch {
        return null;
      }
    };
  };

  const drawPlot = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Clear background
    ctx.fillStyle = '#020617'; // slate-950
    ctx.fillRect(0, 0, width, height);

    // Coordinate mapping functions
    const toCanvasX = (x: number) => ((x - xMin) / (xMax - xMin)) * width;
    const toCanvasY = (y: number) => height - ((y - yMin) / (yMax - yMin)) * height;

    const fromCanvasX = (cx: number) => xMin + (cx / width) * (xMax - xMin);
    const fromCanvasY = (cy: number) => yMax - (cy / height) * (yMax - yMin);

    // Draw Grid Lines
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#1e293b'; // slate-800
    ctx.fillStyle = '#64748b'; // slate-500
    ctx.font = '10px monospace';

    // Calculate nice step sizes for grid
    const xRange = xMax - xMin;
    const rawXStep = xRange / 10;
    const xStep = Math.pow(10, Math.floor(Math.log10(rawXStep))) * (rawXStep / Math.pow(10, Math.floor(Math.log10(rawXStep))) > 5 ? 5 : rawXStep / Math.pow(10, Math.floor(Math.log10(rawXStep))) > 2 ? 2 : 1);

    const firstX = Math.ceil(xMin / xStep) * xStep;
    for (let x = firstX; x <= xMax; x += xStep) {
      const cx = toCanvasX(x);
      ctx.beginPath();
      ctx.moveTo(cx, 0);
      ctx.lineTo(cx, height);
      ctx.stroke();

      if (Math.abs(x) > 1e-6) {
        ctx.fillText(x.toFixed(xStep < 1 ? 1 : 0), cx + 2, toCanvasY(0) + 12);
      }
    }

    const yRange = yMax - yMin;
    const rawYStep = yRange / 10;
    const yStep = Math.pow(10, Math.floor(Math.log10(rawYStep))) * (rawYStep / Math.pow(10, Math.floor(Math.log10(rawYStep))) > 5 ? 5 : rawYStep / Math.pow(10, Math.floor(Math.log10(rawYStep))) > 2 ? 2 : 1);

    const firstY = Math.ceil(yMin / yStep) * yStep;
    for (let y = firstY; y <= yMax; y += yStep) {
      const cy = toCanvasY(y);
      ctx.beginPath();
      ctx.moveTo(0, cy);
      ctx.lineTo(width, cy);
      ctx.stroke();

      if (Math.abs(y) > 1e-6) {
        ctx.fillText(y.toFixed(yStep < 1 ? 1 : 0), toCanvasX(0) + 4, cy - 2);
      }
    }

    // Draw Main Axes (X & Y axes)
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#475569'; // slate-600
    // X-axis
    const originY = toCanvasY(0);
    ctx.beginPath();
    ctx.moveTo(0, originY);
    ctx.lineTo(width, originY);
    ctx.stroke();

    // Y-axis
    const originX = toCanvasX(0);
    ctx.beginPath();
    ctx.moveTo(originX, 0);
    ctx.lineTo(originX, height);
    ctx.stroke();

    // Draw Function 2 (if enabled)
    if (showFn2 && fn2.trim()) {
      const evalFn2 = parseFn(fn2);
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#818cf8'; // indigo-400
      ctx.beginPath();
      let started = false;

      for (let px = 0; px <= width; px += 2) {
        const xVal = fromCanvasX(px);
        const yVal = evalFn2(xVal);
        if (yVal !== null && isFinite(yVal)) {
          const cy = toCanvasY(yVal);
          if (!started) {
            ctx.moveTo(px, cy);
            started = true;
          } else {
            ctx.lineTo(px, cy);
          }
        } else {
          started = false;
        }
      }
      ctx.stroke();
    }

    // Draw Function 1 (primary)
    if (fn1.trim()) {
      const evalFn1 = parseFn(fn1);
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = '#22d3ee'; // cyan-400
      ctx.beginPath();
      let started = false;

      for (let px = 0; px <= width; px += 2) {
        const xVal = fromCanvasX(px);
        const yVal = evalFn1(xVal);
        if (yVal !== null && isFinite(yVal)) {
          const cy = toCanvasY(yVal);
          if (!started) {
            ctx.moveTo(px, cy);
            started = true;
          } else {
            ctx.lineTo(px, cy);
          }
        } else {
          started = false;
        }
      }
      ctx.stroke();
    }

    // Draw Hover Cursor Point
    if (hoverCoord && hoverCoord.y1 !== undefined) {
      const cx = toCanvasX(hoverCoord.x);
      const cy = toCanvasY(hoverCoord.y1);

      ctx.fillStyle = '#06b6d4';
      ctx.beginPath();
      ctx.arc(cx, cy, 5, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = '#cffafe';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }
  }, [fn1, fn2, showFn2, xMin, xMax, yMin, yMax, hoverCoord]);

  // Redraw on canvas resize or state changes
  useEffect(() => {
    drawPlot();
  }, [drawPlot]);

  // Handle Pan Dragging
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xVal = xMin + (mouseX / canvas.width) * (xMax - xMin);
    const yVal = yMax - (mouseY / canvas.height) * (yMax - yMin);

    const evalFn1 = parseFn(fn1);
    const y1 = evalFn1(xVal) ?? undefined;

    setHoverCoord({ x: xVal, y: yVal, y1 });

    if (isDragging) {
      const dxPixels = e.clientX - dragStart.x;
      const dyPixels = e.clientY - dragStart.y;

      const dxUnits = (dxPixels / canvas.width) * (xMax - xMin);
      const dyUnits = (dyPixels / canvas.height) * (yMax - yMin);

      setXMin((prev) => prev - dxUnits);
      setXMax((prev) => prev - dxUnits);
      setYMin((prev) => prev + dyUnits);
      setYMax((prev) => prev + dyUnits);

      setDragStart({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseUp = () => setIsDragging(false);

  // Zoom controls
  const handleZoom = (factor: number) => {
    const xCenter = (xMin + xMax) / 2;
    const yCenter = (yMin + yMax) / 2;
    const halfX = ((xMax - xMin) * factor) / 2;
    const halfY = ((yMax - yMin) * factor) / 2;

    setXMin(xCenter - halfX);
    setXMax(xCenter + halfX);
    setYMin(yCenter - halfY);
    setYMax(yCenter + halfY);
  };

  const handleResetView = () => {
    setXMin(-10);
    setXMax(10);
    setYMin(-6);
    setYMax(6);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-5">
      {/* Function Inputs & Legend */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-cyan-400" />
            <h2 className="text-lg font-bold text-slate-100">2D Function Grapher</h2>
          </div>

          {/* Quick preset curves */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono">
            <span className="text-slate-500 mr-1">Presets:</span>
            <button
              onClick={() => {
                setFn1('sin(x)');
                setShowFn2(true);
                setFn2('cos(x)');
              }}
              className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded border border-slate-700"
            >
              sin(x) & cos(x)
            </button>
            <button
              onClick={() => {
                setFn1('sin(x) * exp(-0.15*x)');
                setShowFn2(false);
              }}
              className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded border border-slate-700"
            >
              Damped Oscillator
            </button>
            <button
              onClick={() => {
                setFn1('x^3 - 3*x');
                setShowFn2(false);
              }}
              className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded border border-slate-700"
            >
              x³ - 3x
            </button>
            <button
              onClick={() => {
                setFn1('1 / (1 + x^2)');
                setShowFn2(false);
              }}
              className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded border border-slate-700"
            >
              1 / (1 + x²)
            </button>
          </div>
        </div>

        {/* Function 1 input */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          <div className="md:col-span-8 flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-cyan-400 shrink-0" />
            <span className="font-mono text-xs text-cyan-300 font-semibold shrink-0">f₁(x) =</span>
            <input
              type="text"
              value={fn1}
              onChange={(e) => setFn1(e.target.value)}
              placeholder="e.g. sin(x), x^2 - 4"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 font-mono text-sm text-slate-100 focus:border-cyan-500 focus:outline-none"
            />
          </div>

          {/* Quick AI & 3D Surface buttons */}
          <div className="md:col-span-4 flex items-center justify-end gap-2">
            <button
              onClick={() =>
                onAskAI(
                  `Please perform mathematical function analysis on f(x) = ${fn1}: domain, range, roots, derivatives, stationary points, and asymptotic behavior.`
                )
              }
              title="Analyze function properties with AI Tutor"
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-indigo-300 bg-indigo-950/70 hover:bg-indigo-900/80 border border-indigo-800/60 rounded-xl transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Analyze (AI)</span>
            </button>

            <button
              onClick={() =>
                onOpenVisualizerWithPrompt(
                  `High-resolution 3D mathematical manifold visualization of z = ${fn1}. Beautiful gradient mesh, coordinate contour lines, and precision scientific render.`
                )
              }
              title="Generate 3D Mathematical Surface in 4K"
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-cyan-300 bg-cyan-950/70 hover:bg-cyan-900/80 border border-cyan-800/60 rounded-xl transition-colors"
            >
              <ImageIcon className="w-3.5 h-3.5 text-cyan-400" />
              <span>3D Render (4K)</span>
            </button>
          </div>
        </div>

        {/* Function 2 toggle */}
        <div className="flex items-center gap-3 pt-1">
          <button
            onClick={() => setShowFn2(!showFn2)}
            className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1.5"
          >
            <span className="font-mono">{showFn2 ? '[-] Hide f₂(x)' : '[+] Add f₂(x)'}</span>
          </button>

          {showFn2 && (
            <div className="flex-1 flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-indigo-400 shrink-0" />
              <span className="font-mono text-xs text-indigo-300 font-semibold shrink-0">f₂(x) =</span>
              <input
                type="text"
                value={fn2}
                onChange={(e) => setFn2(e.target.value)}
                placeholder="e.g. cos(x)"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 font-mono text-xs text-slate-100 focus:border-indigo-500 focus:outline-none"
              />
            </div>
          )}
        </div>
      </div>

      {/* Canvas Plot Container */}
      <div className="relative bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
        {/* Floating Controls Overlay */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10 bg-slate-900/80 backdrop-blur p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => handleZoom(0.8)}
            title="Zoom In"
            className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleZoom(1.25)}
            title="Zoom Out"
            className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={handleResetView}
            title="Reset View"
            className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Hover Coordinate Readout */}
        {hoverCoord && (
          <div className="absolute bottom-3 left-3 z-10 bg-slate-900/90 backdrop-blur px-3 py-1.5 rounded-lg border border-slate-800 text-xs font-mono text-slate-300 shadow-md">
            <span>x = {hoverCoord.x.toFixed(3)}</span>
            {hoverCoord.y1 !== undefined && (
              <>
                <span className="text-slate-600 mx-1.5">|</span>
                <span className="text-cyan-300 font-semibold">
                  f₁(x) = {hoverCoord.y1.toFixed(4)}
                </span>
              </>
            )}
          </div>
        )}

        <canvas
          ref={canvasRef}
          width={900}
          height={500}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className="w-full h-[440px] block cursor-crosshair select-none"
        />
      </div>
    </div>
  );
};
