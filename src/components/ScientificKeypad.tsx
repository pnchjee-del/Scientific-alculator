import React, { useState } from 'react';
import { Delete, RotateCcw } from 'lucide-react';

interface KeypadProps {
  onInsert: (token: string) => void;
  onClear: () => void;
  onBackspace: () => void;
  onEvaluate: () => void;
  onInsertAns: () => void;
}

export const ScientificKeypad: React.FC<KeypadProps> = ({
  onInsert,
  onClear,
  onBackspace,
  onEvaluate,
  onInsertAns,
}) => {
  const [isSecondMode, setIsSecondMode] = useState(false);
  const [activeCategory, setActiveCategory] = useState<'trig' | 'algebra' | 'complex' | 'constants'>('trig');

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl mt-4">
      {/* Category selector for scientific function groups */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800 text-xs">
        <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800/80">
          <button
            onClick={() => setActiveCategory('trig')}
            className={`px-3 py-1 font-medium rounded-lg transition-colors ${
              activeCategory === 'trig'
                ? 'bg-slate-800 text-cyan-300 shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Trigonometry
          </button>
          <button
            onClick={() => setActiveCategory('algebra')}
            className={`px-3 py-1 font-medium rounded-lg transition-colors ${
              activeCategory === 'algebra'
                ? 'bg-slate-800 text-cyan-300 shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Powers & Logs
          </button>
          <button
            onClick={() => setActiveCategory('complex')}
            className={`px-3 py-1 font-medium rounded-lg transition-colors ${
              activeCategory === 'complex'
                ? 'bg-indigo-950/80 text-indigo-300 border border-indigo-900/60 shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Complex (i)
          </button>
          <button
            onClick={() => setActiveCategory('constants')}
            className={`px-3 py-1 font-medium rounded-lg transition-colors ${
              activeCategory === 'constants'
                ? 'bg-slate-800 text-cyan-300 shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Constants
          </button>
        </div>

        <button
          onClick={() => setIsSecondMode(!isSecondMode)}
          className={`px-3 py-1 font-mono font-semibold rounded-lg text-xs transition-colors border ${
            isSecondMode
              ? 'bg-cyan-500 text-slate-950 border-cyan-400'
              : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
          }`}
        >
          2nd
        </button>
      </div>

      {/* Dynamic Function Row based on selected category */}
      <div className="mb-4">
        {activeCategory === 'trig' && (
          <div className="grid grid-cols-6 gap-2">
            {!isSecondMode ? (
              <>
                <KeyBtn label="sin" onClick={() => onInsert('sin(')} color="func" />
                <KeyBtn label="cos" onClick={() => onInsert('cos(')} color="func" />
                <KeyBtn label="tan" onClick={() => onInsert('tan(')} color="func" />
                <KeyBtn label="sec" onClick={() => onInsert('sec(')} color="func" />
                <KeyBtn label="csc" onClick={() => onInsert('csc(')} color="func" />
                <KeyBtn label="cot" onClick={() => onInsert('cot(')} color="func" />
                <KeyBtn label="sinh" onClick={() => onInsert('sinh(')} color="func" />
                <KeyBtn label="cosh" onClick={() => onInsert('cosh(')} color="func" />
                <KeyBtn label="tanh" onClick={() => onInsert('tanh(')} color="func" />
                <KeyBtn label="π" onClick={() => onInsert('π')} color="const" />
                <KeyBtn label="deg" onClick={() => onInsert(' deg')} color="func" />
                <KeyBtn label="rad" onClick={() => onInsert(' rad')} color="func" />
              </>
            ) : (
              <>
                <KeyBtn label="sin⁻¹" onClick={() => onInsert('asin(')} color="func" />
                <KeyBtn label="cos⁻¹" onClick={() => onInsert('acos(')} color="func" />
                <KeyBtn label="tan⁻¹" onClick={() => onInsert('atan(')} color="func" />
                <KeyBtn label="asinh" onClick={() => onInsert('asinh(')} color="func" />
                <KeyBtn label="acosh" onClick={() => onInsert('acosh(')} color="func" />
                <KeyBtn label="atanh" onClick={() => onInsert('atanh(')} color="func" />
                <KeyBtn label="atan2" onClick={() => onInsert('atan2(')} color="func" />
                <KeyBtn label="2π" onClick={() => onInsert('(2*π)')} color="const" />
                <KeyBtn label="π/2" onClick={() => onInsert('(π/2)')} color="const" />
                <KeyBtn label="π/4" onClick={() => onInsert('(π/4)')} color="const" />
                <KeyBtn label="sinc" onClick={() => onInsert('sinc(')} color="func" />
                <KeyBtn label="hypot" onClick={() => onInsert('hypot(')} color="func" />
              </>
            )}
          </div>
        )}

        {activeCategory === 'algebra' && (
          <div className="grid grid-cols-6 gap-2">
            {!isSecondMode ? (
              <>
                <KeyBtn label="ln" onClick={() => onInsert('log(')} color="func" />
                <KeyBtn label="log₁₀" onClick={() => onInsert('log10(')} color="func" />
                <KeyBtn label="x²" onClick={() => onInsert('^2')} color="func" />
                <KeyBtn label="xʸ" onClick={() => onInsert('^')} color="func" />
                <KeyBtn label="√x" onClick={() => onInsert('sqrt(')} color="func" />
                <KeyBtn label="∛x" onClick={() => onInsert('cbrt(')} color="func" />
                <KeyBtn label="eˣ" onClick={() => onInsert('exp(')} color="func" />
                <KeyBtn label="10ˣ" onClick={() => onInsert('10^(')} color="func" />
                <KeyBtn label="1/x" onClick={() => onInsert('^(-1)')} color="func" />
                <KeyBtn label="|x|" onClick={() => onInsert('abs(')} color="func" />
                <KeyBtn label="x!" onClick={() => onInsert('!')} color="func" />
                <KeyBtn label="mod" onClick={() => onInsert(' mod ')} color="func" />
              </>
            ) : (
              <>
                <KeyBtn label="log₂" onClick={() => onInsert('log2(')} color="func" />
                <KeyBtn label="x³" onClick={() => onInsert('^3')} color="func" />
                <KeyBtn label="ⁿ√x" onClick={() => onInsert('nthRoot(')} color="func" />
                <KeyBtn label="nPr" onClick={() => onInsert('permutations(')} color="func" />
                <KeyBtn label="nCr" onClick={() => onInsert('combinations(')} color="func" />
                <KeyBtn label="gcd" onClick={() => onInsert('gcd(')} color="func" />
                <KeyBtn label="lcm" onClick={() => onInsert('lcm(')} color="func" />
                <KeyBtn label="ceil" onClick={() => onInsert('ceil(')} color="func" />
                <KeyBtn label="floor" onClick={() => onInsert('floor(')} color="func" />
                <KeyBtn label="round" onClick={() => onInsert('round(')} color="func" />
                <KeyBtn label="sign" onClick={() => onInsert('sign(')} color="func" />
                <KeyBtn label="gamma" onClick={() => onInsert('gamma(')} color="func" />
              </>
            )}
          </div>
        )}

        {activeCategory === 'complex' && (
          <div className="grid grid-cols-6 gap-2">
            <KeyBtn label="i (imag)" onClick={() => onInsert('i')} color="complex" />
            <KeyBtn label="conj(z)" onClick={() => onInsert('conj(')} color="complex" />
            <KeyBtn label="re(z)" onClick={() => onInsert('re(')} color="complex" />
            <KeyBtn label="im(z)" onClick={() => onInsert('im(')} color="complex" />
            <KeyBtn label="arg(z)" onClick={() => onInsert('arg(')} color="complex" />
            <KeyBtn label="|z|" onClick={() => onInsert('abs(')} color="complex" />
            <KeyBtn label="e^(iθ)" onClick={() => onInsert('exp(i*')} color="complex" />
            <KeyBtn label="sqrt(-1)" onClick={() => onInsert('sqrt(-1)')} color="complex" />
            <KeyBtn label="(1+i)" onClick={() => onInsert('(1+i)')} color="complex" />
            <KeyBtn label="(1-i)" onClick={() => onInsert('(1-i)')} color="complex" />
            <KeyBtn label="polar" onClick={() => onInsert('toPolar(')} color="complex" />
            <KeyBtn label="rect" onClick={() => onInsert('toRect(')} color="complex" />
          </div>
        )}

        {activeCategory === 'constants' && (
          <div className="grid grid-cols-6 gap-2">
            <KeyBtn label="π (Pi)" onClick={() => onInsert('pi')} color="const" />
            <KeyBtn label="e (Euler)" onClick={() => onInsert('e')} color="const" />
            <KeyBtn label="ϕ (Golden)" onClick={() => onInsert('ϕ')} color="const" />
            <KeyBtn label="c (Light)" onClick={() => onInsert('299792458')} color="const" />
            <KeyBtn label="h (Planck)" onClick={() => onInsert('6.62607015e-34')} color="const" />
            <KeyBtn label="G (Grav)" onClick={() => onInsert('6.6743e-11')} color="const" />
            <KeyBtn label="k (Boltz)" onClick={() => onInsert('1.380649e-23')} color="const" />
            <KeyBtn label="N_A (Avog)" onClick={() => onInsert('6.02214076e23')} color="const" />
            <KeyBtn label="q_e (Charge)" onClick={() => onInsert('1.602176634e-19')} color="const" />
            <KeyBtn label="m_e (Electron)" onClick={() => onInsert('9.1093837e-31')} color="const" />
            <KeyBtn label="m_p (Proton)" onClick={() => onInsert('1.67262192e-27')} color="const" />
            <KeyBtn label="R (Gas)" onClick={() => onInsert('8.314462618')} color="const" />
          </div>
        )}
      </div>

      {/* Main Standard Keypad Grid */}
      <div className="grid grid-cols-5 gap-2 sm:gap-2.5">
        {/* Row 1 */}
        <KeyBtn label="(" onClick={() => onInsert('(')} color="accent" />
        <KeyBtn label=")" onClick={() => onInsert(')')} color="accent" />
        <KeyBtn label="%" onClick={() => onInsert('%')} color="accent" />
        <KeyBtn label="DEL" onClick={onBackspace} color="danger" icon={<Delete className="w-4 h-4 mx-auto" />} />
        <KeyBtn label="AC" onClick={onClear} color="danger" />

        {/* Row 2 */}
        <KeyBtn label="x" onClick={() => onInsert('x')} color="var" />
        <KeyBtn label="7" onClick={() => onInsert('7')} color="num" />
        <KeyBtn label="8" onClick={() => onInsert('8')} color="num" />
        <KeyBtn label="9" onClick={() => onInsert('9')} color="num" />
        <KeyBtn label="÷" onClick={() => onInsert('/')} color="op" />

        {/* Row 3 */}
        <KeyBtn label="y" onClick={() => onInsert('y')} color="var" />
        <KeyBtn label="4" onClick={() => onInsert('4')} color="num" />
        <KeyBtn label="5" onClick={() => onInsert('5')} color="num" />
        <KeyBtn label="6" onClick={() => onInsert('6')} color="num" />
        <KeyBtn label="×" onClick={() => onInsert('*')} color="op" />

        {/* Row 4 */}
        <KeyBtn label="," onClick={() => onInsert(',')} color="accent" />
        <KeyBtn label="1" onClick={() => onInsert('1')} color="num" />
        <KeyBtn label="2" onClick={() => onInsert('2')} color="num" />
        <KeyBtn label="3" onClick={() => onInsert('3')} color="num" />
        <KeyBtn label="−" onClick={() => onInsert('-')} color="op" />

        {/* Row 5 */}
        <KeyBtn label="Ans" onClick={onInsertAns} color="accent" />
        <KeyBtn label="0" onClick={() => onInsert('0')} color="num" />
        <KeyBtn label="." onClick={() => onInsert('.')} color="num" />
        <KeyBtn label="=" onClick={onEvaluate} color="equal" />
        <KeyBtn label="+" onClick={() => onInsert('+')} color="op" />
      </div>
    </div>
  );
};

interface KeyBtnProps {
  label: string;
  onClick: () => void;
  color?: 'num' | 'op' | 'func' | 'equal' | 'danger' | 'accent' | 'const' | 'complex' | 'var';
  icon?: React.ReactNode;
}

const KeyBtn: React.FC<KeyBtnProps> = ({ label, onClick, color = 'num', icon }) => {
  let style = 'bg-slate-800/80 hover:bg-slate-700 text-slate-100 border-slate-700/60';

  if (color === 'num') {
    style = 'bg-slate-800 hover:bg-slate-750 text-slate-100 font-mono text-base font-semibold border-slate-700/80';
  } else if (color === 'op') {
    style = 'bg-slate-800/90 hover:bg-cyan-900/40 text-cyan-400 font-mono text-lg font-bold border-cyan-800/50';
  } else if (color === 'equal') {
    style = 'bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-mono text-xl font-bold shadow-md shadow-cyan-950/40 border-cyan-500/50';
  } else if (color === 'func') {
    style = 'bg-slate-900 hover:bg-slate-800 text-slate-300 font-mono text-xs border-slate-800';
  } else if (color === 'const') {
    style = 'bg-emerald-950/30 hover:bg-emerald-900/40 text-emerald-300 font-mono text-xs border-emerald-900/50';
  } else if (color === 'complex') {
    style = 'bg-indigo-950/40 hover:bg-indigo-900/50 text-indigo-300 font-mono text-xs border-indigo-900/60 font-semibold';
  } else if (color === 'danger') {
    style = 'bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 font-mono text-xs font-semibold border-rose-900/50';
  } else if (color === 'accent') {
    style = 'bg-slate-800/60 hover:bg-slate-700 text-cyan-200 font-mono text-xs border-slate-700/60';
  } else if (color === 'var') {
    style = 'bg-amber-950/30 hover:bg-amber-900/40 text-amber-300 font-mono text-sm border-amber-900/50 italic';
  }

  return (
    <button
      onClick={onClick}
      className={`h-11 sm:h-12 rounded-xl flex items-center justify-center border transition-all active:scale-95 select-none ${style}`}
    >
      {icon ? icon : label}
    </button>
  );
};
