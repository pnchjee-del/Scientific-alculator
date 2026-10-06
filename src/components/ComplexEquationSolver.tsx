import React, { useState } from 'react';
import {
  solveQuadratic,
  solveLinearSystem,
  numericalDerivative,
  numericalIntegral,
  QuadraticSolution,
  LinearSystemSolution,
} from '../services/mathEngine';
import {
  Sparkles,
  Volume2,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

interface ComplexEquationSolverProps {
  onAskAI: (query: string) => void;
  onSpeak: (text: string) => void;
  onPlotFunction: (expr: string) => void;
}

export const ComplexEquationSolver: React.FC<ComplexEquationSolverProps> = ({
  onAskAI,
  onSpeak,
  onPlotFunction,
}) => {
  const [solverTab, setSolverTab] = useState<'quadratic' | 'linear' | 'calculus'>('quadratic');

  // Quadratic state: ax^2 + bx + c = 0
  const [quadA, setQuadA] = useState<string>('1');
  const [quadB, setQuadB] = useState<string>('-2');
  const [quadC, setQuadC] = useState<string>('5');
  const [quadSolution, setQuadSolution] = useState<QuadraticSolution | null>(() => {
    try {
      return solveQuadratic(1, -2, 5);
    } catch {
      return null;
    }
  });
  const [quadError, setQuadError] = useState<string | null>(null);

  // Linear System state:
  // a1*x + b1*y = c1
  // a2*x + b2*y = c2
  const [linA1, setLinA1] = useState<string>('2');
  const [linB1, setLinB1] = useState<string>('3');
  const [linC1, setLinC1] = useState<string>('8');
  const [linA2, setLinA2] = useState<string>('4');
  const [linB2, setLinB2] = useState<string>('-1');
  const [linC2, setLinC2] = useState<string>('2');
  const [linSolution, setLinSolution] = useState<LinearSystemSolution | null>(() => {
    try {
      return solveLinearSystem(2, 3, 8, 4, -1, 2);
    } catch {
      return null;
    }
  });
  const [linError, setLinError] = useState<string | null>(null);

  // Calculus state
  const [calcFn, setCalcFn] = useState<string>('x^3 - 2*x + 4');
  const [calcX0, setCalcX0] = useState<string>('2');
  const [calcA, setCalcA] = useState<string>('0');
  const [calcB, setCalcB] = useState<string>('3');
  const [derivResult, setDerivResult] = useState<number | null>(null);
  const [integResult, setIntegResult] = useState<number | null>(null);
  const [calcError, setCalcError] = useState<string | null>(null);

  // Handle quadratic solve
  const handleSolveQuad = () => {
    try {
      setQuadError(null);
      const a = parseFloat(quadA);
      const b = parseFloat(quadB);
      const c = parseFloat(quadC);

      if (isNaN(a) || isNaN(b) || isNaN(c)) {
        setQuadError('Please enter valid numerical coefficients.');
        return;
      }
      const sol = solveQuadratic(a, b, c);
      setQuadSolution(sol);
    } catch (err: any) {
      setQuadError(err.message || 'Error solving quadratic equation');
      setQuadSolution(null);
    }
  };

  // Handle linear system solve
  const handleSolveLinear = () => {
    try {
      setLinError(null);
      const a1 = parseFloat(linA1);
      const b1 = parseFloat(linB1);
      const c1 = parseFloat(linC1);
      const a2 = parseFloat(linA2);
      const b2 = parseFloat(linB2);
      const c2 = parseFloat(linC2);

      if ([a1, b1, c1, a2, b2, c2].some(isNaN)) {
        setLinError('Please enter valid numerical coefficients.');
        return;
      }
      const sol = solveLinearSystem(a1, b1, c1, a2, b2, c2);
      setLinSolution(sol);
    } catch (err: any) {
      setLinError(err.message || 'Error solving linear system');
      setLinSolution(null);
    }
  };

  // Handle calculus operations
  const handleComputeCalculus = () => {
    try {
      setCalcError(null);
      const x0 = parseFloat(calcX0);
      const a = parseFloat(calcA);
      const b = parseFloat(calcB);

      if (isNaN(x0) || isNaN(a) || isNaN(b)) {
        setCalcError('Please enter valid numerical evaluation points.');
        return;
      }

      const d = numericalDerivative(calcFn, x0);
      const i = numericalIntegral(calcFn, a, b);
      setDerivResult(d);
      setIntegResult(i);
    } catch (err: any) {
      setCalcError(err.message || 'Error evaluating calculus functions');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Intro Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
              <span>Complex Equation & Calculus Studio</span>
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Solve polynomial systems with real & complex roots, analyze linear systems, and calculate numerical derivatives and integrals.
            </p>
          </div>

          {/* Sub-tab switcher */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setSolverTab('quadratic')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                solverTab === 'quadratic'
                  ? 'bg-slate-800 text-cyan-300 shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Quadratic (Complex)
            </button>
            <button
              onClick={() => setSolverTab('linear')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                solverTab === 'linear'
                  ? 'bg-slate-800 text-cyan-300 shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Linear 2×2 System
            </button>
            <button
              onClick={() => setSolverTab('calculus')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                solverTab === 'calculus'
                  ? 'bg-slate-800 text-cyan-300 shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Calculus & Roots
            </button>
          </div>
        </div>
      </div>

      {/* QUADRATIC SOLVER TAB */}
      {solverTab === 'quadratic' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Inputs Column */}
          <div className="md:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider font-mono">
              ax² + bx + c = 0
            </h3>

            <div className="space-y-3 font-mono">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Coefficient a (quadratic)</label>
                <input
                  type="number"
                  step="any"
                  value={quadA}
                  onChange={(e) => setQuadA(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 text-sm focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Coefficient b (linear)</label>
                <input
                  type="number"
                  step="any"
                  value={quadB}
                  onChange={(e) => setQuadB(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 text-sm focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Coefficient c (constant)</label>
                <input
                  type="number"
                  step="any"
                  value={quadC}
                  onChange={(e) => setQuadC(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 text-sm focus:border-cyan-500 focus:outline-none"
                />
              </div>
            </div>

            <button
              onClick={handleSolveQuad}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 font-semibold text-white text-sm shadow-md transition-all active:scale-98"
            >
              Solve Equation
            </button>

            {/* Quick preset buttons */}
            <div className="pt-2 border-t border-slate-800/80">
              <span className="text-[11px] text-slate-500 uppercase tracking-wider block mb-2">Presets</span>
              <div className="flex flex-wrap gap-1.5 text-xs font-mono">
                <button
                  onClick={() => {
                    setQuadA('1');
                    setQuadB('-2');
                    setQuadC('5');
                    setQuadSolution(solveQuadratic(1, -2, 5));
                  }}
                  className="px-2 py-1 bg-slate-800 hover:bg-slate-750 text-indigo-300 rounded border border-slate-700/60"
                >
                  x² - 2x + 5 = 0 (Complex)
                </button>
                <button
                  onClick={() => {
                    setQuadA('1');
                    setQuadB('-5');
                    setQuadC('6');
                    setQuadSolution(solveQuadratic(1, -5, 6));
                  }}
                  className="px-2 py-1 bg-slate-800 hover:bg-slate-750 text-cyan-300 rounded border border-slate-700/60"
                >
                  x² - 5x + 6 = 0 (Real)
                </button>
              </div>
            </div>
          </div>

          {/* Results Column */}
          <div className="md:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-sm font-semibold text-slate-200">Analytical Solution</h3>
              {quadSolution && (
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() =>
                      onSpeak(
                        `Quadratic equation solution: ${quadSolution.steps.join('. ')}. Root 1 is ${quadSolution.root1}. Root 2 is ${quadSolution.root2}.`
                      )
                    }
                    title="Read solution aloud with TTS"
                    className="p-1.5 text-slate-400 hover:text-emerald-400 hover:bg-slate-800 rounded-lg transition-colors"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() =>
                      onAskAI(
                        `Please explain the step-by-step mathematical derivation for solving ${quadA}x^2 + ${quadB}x + ${quadC} = 0, including the discriminant and why the roots are ${quadSolution.root1} and ${quadSolution.root2}.`
                      )
                    }
                    title="Explain with Gemini AI Tutor"
                    className="flex items-center gap-1 px-2 py-1 text-xs text-indigo-300 bg-indigo-950/60 hover:bg-indigo-900/60 border border-indigo-800/60 rounded-lg transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Explain with AI</span>
                  </button>
                  <button
                    onClick={() => onPlotFunction(`${quadA}*x^2 + ${quadB}*x + ${quadC}`)}
                    title="Plot parabola in grapher"
                    className="flex items-center gap-1 px-2 py-1 text-xs text-cyan-300 bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-800/60 rounded-lg transition-colors"
                  >
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>Plot</span>
                  </button>
                </div>
              )}
            </div>

            {quadError && (
              <div className="p-3 bg-red-950/30 border border-red-800/50 rounded-xl text-red-300 text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{quadError}</span>
              </div>
            )}

            {quadSolution && (
              <div className="space-y-4">
                {/* Roots banner */}
                <div className="grid grid-cols-2 gap-3 font-mono">
                  <div className="p-3.5 bg-slate-950 border border-slate-800/80 rounded-xl">
                    <span className="text-xs text-slate-400 block mb-1">Root x₁</span>
                    <span className="text-lg font-bold text-cyan-300 break-all">
                      {quadSolution.root1}
                    </span>
                  </div>

                  <div className="p-3.5 bg-slate-950 border border-slate-800/80 rounded-xl">
                    <span className="text-xs text-slate-400 block mb-1">Root x₂</span>
                    <span className="text-lg font-bold text-cyan-300 break-all">
                      {quadSolution.root2}
                    </span>
                  </div>
                </div>

                {/* Discriminant & Type */}
                <div className="flex flex-wrap items-center gap-4 text-xs font-mono p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                  <div>
                    <span className="text-slate-500">Discriminant Δ: </span>
                    <span className="text-slate-200 font-semibold">{quadSolution.discriminant}</span>
                  </div>
                  <span className="text-slate-600">·</span>
                  <div>
                    <span className="text-slate-500">Root Type: </span>
                    <span
                      className={`font-semibold ${
                        quadSolution.isComplex ? 'text-indigo-400' : 'text-emerald-400'
                      }`}
                    >
                      {quadSolution.isComplex ? 'Complex Conjugates (ℂ)' : 'Real Roots (ℝ)'}
                    </span>
                  </div>
                  <span className="text-slate-600">·</span>
                  <div>
                    <span className="text-slate-500">Parabola Vertex: </span>
                    <span className="text-slate-300">
                      ({quadSolution.vertexX.toFixed(2)}, {quadSolution.vertexY.toFixed(2)})
                    </span>
                  </div>
                </div>

                {/* Step-by-step breakdown */}
                <div className="space-y-1.5 pt-2">
                  <span className="text-xs text-slate-400 font-semibold block">Step-by-step Derivation</span>
                  <div className="space-y-1 text-xs font-mono text-slate-300 bg-slate-950/50 p-3 rounded-xl border border-slate-800">
                    {quadSolution.steps.map((st, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <span className="text-slate-600 select-none">{i + 1}.</span>
                        <span>{st}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* LINEAR 2x2 SYSTEM TAB */}
      {solverTab === 'linear' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-6 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <h3 className="text-sm font-semibold text-slate-200 font-mono">
              System of 2 Linear Equations (Cramer's Rule)
            </h3>

            {/* Equation 1 */}
            <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 space-y-2">
              <span className="text-xs text-slate-400 font-medium">Equation 1: a₁x + b₁y = c₁</span>
              <div className="grid grid-cols-3 gap-2 font-mono text-xs">
                <div>
                  <label className="text-[10px] text-slate-500">a₁</label>
                  <input
                    type="number"
                    step="any"
                    value={linA1}
                    onChange={(e) => setLinA1(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-100"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500">b₁</label>
                  <input
                    type="number"
                    step="any"
                    value={linB1}
                    onChange={(e) => setLinB1(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-100"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500">c₁</label>
                  <input
                    type="number"
                    step="any"
                    value={linC1}
                    onChange={(e) => setLinC1(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-100"
                  />
                </div>
              </div>
            </div>

            {/* Equation 2 */}
            <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 space-y-2">
              <span className="text-xs text-slate-400 font-medium">Equation 2: a₂x + b₂y = c₂</span>
              <div className="grid grid-cols-3 gap-2 font-mono text-xs">
                <div>
                  <label className="text-[10px] text-slate-500">a₂</label>
                  <input
                    type="number"
                    step="any"
                    value={linA2}
                    onChange={(e) => setLinA2(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-100"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500">b₂</label>
                  <input
                    type="number"
                    step="any"
                    value={linB2}
                    onChange={(e) => setLinB2(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-100"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500">c₂</label>
                  <input
                    type="number"
                    step="any"
                    value={linC2}
                    onChange={(e) => setLinC2(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-100"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={handleSolveLinear}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 font-semibold text-white text-sm shadow-md transition-all active:scale-98"
            >
              Solve System
            </button>
          </div>

          <div className="md:col-span-6 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-sm font-semibold text-slate-200">System Solution</h3>
              {linSolution && (
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() =>
                      onSpeak(`Linear system solution: x equals ${linSolution.x}, y equals ${linSolution.y}.`)
                    }
                    title="Read solution aloud with TTS"
                    className="p-1.5 text-slate-400 hover:text-emerald-400 hover:bg-slate-800 rounded-lg"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() =>
                      onAskAI(
                        `Please explain how Cramer's rule solves the system ${linA1}x + ${linB1}y = ${linC1} and ${linA2}x + ${linB2}y = ${linC2}.`
                      )
                    }
                    title="Explain with AI Tutor"
                    className="flex items-center gap-1 px-2 py-1 text-xs text-indigo-300 bg-indigo-950/60 hover:bg-indigo-900/60 border border-indigo-800/60 rounded-lg"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Explain</span>
                  </button>
                </div>
              )}
            </div>

            {linError && (
              <div className="p-3 bg-red-950/30 border border-red-800/50 rounded-xl text-red-300 text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{linError}</span>
              </div>
            )}

            {linSolution && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3 font-mono">
                  <div className="p-3.5 bg-slate-950 border border-slate-800/80 rounded-xl">
                    <span className="text-xs text-slate-400 block mb-1">Variable x</span>
                    <span className="text-xl font-bold text-cyan-300">{linSolution.x}</span>
                  </div>
                  <div className="p-3.5 bg-slate-950 border border-slate-800/80 rounded-xl">
                    <span className="text-xs text-slate-400 block mb-1">Variable y</span>
                    <span className="text-xl font-bold text-cyan-300">{linSolution.y}</span>
                  </div>
                </div>

                <div className="space-y-1.5 pt-2">
                  <span className="text-xs text-slate-400 font-semibold block">Determinants & Steps</span>
                  <div className="space-y-1 text-xs font-mono text-slate-300 bg-slate-950/50 p-3 rounded-xl border border-slate-800">
                    {linSolution.steps.map((st, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <span className="text-slate-600 select-none">{i + 1}.</span>
                        <span>{st}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* CALCULUS & ROOTS TAB */}
      {solverTab === 'calculus' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-5">
          <div>
            <h3 className="text-sm font-semibold text-slate-200">
              Numerical Derivative & Definite Integral Engine
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Input a continuous function f(x) to compute instantaneous rate of change f'(x) and accumulated area ∫ f(x) dx.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 font-mono text-xs">
            <div className="md:col-span-6">
              <label className="text-slate-400 block mb-1">Function f(x)</label>
              <input
                type="text"
                value={calcFn}
                onChange={(e) => setCalcFn(e.target.value)}
                placeholder="e.g. sin(x) * exp(-0.1*x) or x^3 - 2*x"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 text-sm focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-slate-400 block mb-1">Derivative point (x₀)</label>
              <input
                type="number"
                step="any"
                value={calcX0}
                onChange={(e) => setCalcX0(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 text-sm focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-slate-400 block mb-1">Integral Lower (a)</label>
              <input
                type="number"
                step="any"
                value={calcA}
                onChange={(e) => setCalcA(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 text-sm focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-slate-400 block mb-1">Integral Upper (b)</label>
              <input
                type="number"
                step="any"
                value={calcB}
                onChange={(e) => setCalcB(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 text-sm focus:border-cyan-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleComputeCalculus}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 font-semibold text-white text-sm shadow-md transition-all active:scale-98"
            >
              Compute Calculus
            </button>
            <button
              onClick={() => onPlotFunction(calcFn)}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 text-sm border border-slate-700 flex items-center gap-1.5 transition-colors"
            >
              <TrendingUp className="w-4 h-4" />
              <span>Plot in Grapher</span>
            </button>
          </div>

          {calcError && (
            <div className="p-3 bg-red-950/30 border border-red-800/50 rounded-xl text-red-300 text-sm">
              {calcError}
            </div>
          )}

          {(derivResult !== null || integResult !== null) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono pt-2">
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-xs text-slate-400 block mb-1">
                  Instantaneous Derivative f'({calcX0})
                </span>
                <span className="text-2xl font-bold text-cyan-300">
                  {derivResult !== null ? derivResult.toFixed(6) : '—'}
                </span>
                <span className="text-[11px] text-slate-500 block mt-1">
                  Central finite-difference slope at x = {calcX0}
                </span>
              </div>

              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-xs text-slate-400 block mb-1">
                  Definite Integral ∫_{calcA}^{calcB} f(x) dx
                </span>
                <span className="text-2xl font-bold text-indigo-300">
                  {integResult !== null ? integResult.toFixed(6) : '—'}
                </span>
                <span className="text-[11px] text-slate-500 block mt-1">
                  Composite Simpson's rule integration
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
