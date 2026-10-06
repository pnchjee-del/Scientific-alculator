import { create, all, Complex } from 'mathjs';

const math = create(all, {
  number: 'number',
  precision: 64,
});

export type AngleMode = 'DEG' | 'RAD' | 'GRAD';
export type NumberMode = 'REAL' | 'COMPLEX';

export interface CalculationResult {
  raw: any;
  formatted: string;
  isComplex: boolean;
  realPart?: number;
  imagPart?: number;
  magnitude?: number;
  angleRad?: number;
  angleDeg?: number;
  error?: string;
}

export interface CalculationHistoryItem {
  id: string;
  expression: string;
  result: string;
  timestamp: number;
  isComplex: boolean;
  angleMode: AngleMode;
}

/**
 * Clean and normalize mathematical expressions from keypad syntax into mathjs syntax
 */
export function sanitizeExpression(expr: string, angleMode: AngleMode): string {
  let s = expr;

  // Replace visual multiplication & division symbols
  s = s.replace(/×/g, '*').replace(/÷/g, '/');

  // Replace unicode minus
  s = s.replace(/−/g, '-');

  // Replace constants
  s = s.replace(/π/g, 'pi');
  s = s.replace(/ϕ/g, '((1 + sqrt(5)) / 2)');

  // Handle angle mode for trig functions
  if (angleMode === 'DEG') {
    // Wrap trig arguments in deg where appropriate
    // E.g., sin(30) -> sin(30 deg)
    s = s.replace(/(sin|cos|tan|sec|csc|cot)\(([^()]+)\)/g, '$1(($2) deg)');
  } else if (angleMode === 'GRAD') {
    // 1 grad = pi/200 rad = 0.9 deg
    s = s.replace(/(sin|cos|tan|sec|csc|cot)\(([^()]+)\)/g, '$1((($2) * 0.9) deg)');
  }

  return s;
}

/**
 * Format numbers with reasonable precision without ugly floating point artifacts
 */
export function formatNumber(num: number): string {
  if (isNaN(num)) return 'NaN';
  if (!isFinite(num)) return num > 0 ? '∞' : '-∞';

  // If very close to 0
  if (Math.abs(num) < 1e-12) return '0';

  // If integer
  if (Math.abs(num - Math.round(num)) < 1e-11) {
    return Math.round(num).toLocaleString('en-US');
  }

  // Very large or very small
  if (Math.abs(num) >= 1e11 || Math.abs(num) <= 1e-6) {
    return num.toExponential(8).replace(/\.?0+e/, 'e');
  }

  // Standard float
  const str = num.toFixed(10);
  return parseFloat(str).toLocaleString('en-US', {
    maximumFractionDigits: 10,
  });
}

/**
 * Format complex numbers: a + bi or polar form
 */
export function formatComplex(c: Complex): string {
  const re = Math.abs(c.re) < 1e-12 ? 0 : c.re;
  const im = Math.abs(c.im) < 1e-12 ? 0 : c.im;

  if (im === 0) return formatNumber(re);
  if (re === 0) {
    if (im === 1) return 'i';
    if (im === -1) return '-i';
    return `${formatNumber(im)}i`;
  }

  const sign = im > 0 ? '+' : '-';
  const absIm = Math.abs(im);
  const imStr = absIm === 1 ? 'i' : `${formatNumber(absIm)}i`;
  return `${formatNumber(re)} ${sign} ${imStr}`;
}

/**
 * Safely evaluates mathematical expression with support for complex numbers
 */
export function evaluateMath(
  expression: string,
  angleMode: AngleMode = 'RAD',
  numberMode: NumberMode = 'COMPLEX'
): CalculationResult {
  if (!expression.trim()) {
    return { raw: 0, formatted: '0', isComplex: false };
  }

  try {
    const sanitized = sanitizeExpression(expression, angleMode);
    
    // Evaluate using mathjs
    const evaluated = math.evaluate(sanitized);

    // Check if result is a complex number
    if (typeof evaluated === 'object' && evaluated !== null && 're' in evaluated && 'im' in evaluated) {
      const c = evaluated as Complex;
      const mag = Math.hypot(c.re, c.im);
      const angleRad = Math.atan2(c.im, c.re);
      const angleDeg = (angleRad * 180) / Math.PI;

      if (numberMode === 'REAL' && Math.abs(c.im) > 1e-12) {
        return {
          raw: evaluated,
          formatted: 'Non-real complex result (switch to Complex mode to view)',
          isComplex: true,
          realPart: c.re,
          imagPart: c.im,
          magnitude: mag,
          angleRad,
          angleDeg,
          error: 'Complex result in Real mode',
        };
      }

      return {
        raw: evaluated,
        formatted: formatComplex(c),
        isComplex: Math.abs(c.im) > 1e-12,
        realPart: c.re,
        imagPart: c.im,
        magnitude: mag,
        angleRad,
        angleDeg,
      };
    }

    if (typeof evaluated === 'number') {
      return {
        raw: evaluated,
        formatted: formatNumber(evaluated),
        isComplex: false,
        realPart: evaluated,
        imagPart: 0,
      };
    }

    if (typeof evaluated === 'boolean') {
      return {
        raw: evaluated,
        formatted: evaluated ? 'True' : 'False',
        isComplex: false,
      };
    }

    return {
      raw: evaluated,
      formatted: String(evaluated),
      isComplex: false,
    };
  } catch (err: any) {
    return {
      raw: null,
      formatted: 'Error',
      isComplex: false,
      error: err.message || 'Syntax error',
    };
  }
}

/**
 * Quadratic Equation Solver: ax^2 + bx + c = 0
 * Returns both roots, discriminant, and step-by-step breakdown
 */
export interface QuadraticSolution {
  a: number;
  b: number;
  c: number;
  discriminant: number;
  isComplex: boolean;
  root1: string;
  root2: string;
  vertexX: number;
  vertexY: number;
  steps: string[];
}

export function solveQuadratic(a: number, b: number, c: number): QuadraticSolution {
  if (a === 0) {
    throw new Error("Coefficient 'a' cannot be zero in a quadratic equation.");
  }

  const d = b * b - 4 * a * c;
  const vertexX = -b / (2 * a);
  const vertexY = c - (b * b) / (4 * a);

  const steps: string[] = [
    `Standard Form: ${a}x² ${b >= 0 ? `+ ${b}` : `- ${Math.abs(b)}`}x ${c >= 0 ? `+ ${c}` : `- ${Math.abs(c)}`} = 0`,
    `Discriminant Δ = b² - 4ac = (${b})² - 4(${a})(${c}) = ${formatNumber(d)}`,
  ];

  if (d > 0) {
    const sqrtD = Math.sqrt(d);
    const r1 = (-b + sqrtD) / (2 * a);
    const r2 = (-b - sqrtD) / (2 * a);
    steps.push(`Since Δ > 0, there are 2 distinct real roots.`);
    steps.push(`x₁ = (-(${b}) + √${formatNumber(d)}) / (2 · ${a}) = ${formatNumber(r1)}`);
    steps.push(`x₂ = (-(${b}) - √${formatNumber(d)}) / (2 · ${a}) = ${formatNumber(r2)}`);

    return {
      a,
      b,
      c,
      discriminant: d,
      isComplex: false,
      root1: formatNumber(r1),
      root2: formatNumber(r2),
      vertexX,
      vertexY,
      steps,
    };
  } else if (d === 0) {
    const r = -b / (2 * a);
    steps.push(`Since Δ = 0, there is 1 repeated real root.`);
    steps.push(`x = -(${b}) / (2 · ${a}) = ${formatNumber(r)}`);

    return {
      a,
      b,
      c,
      discriminant: 0,
      isComplex: false,
      root1: formatNumber(r),
      root2: formatNumber(r),
      vertexX,
      vertexY,
      steps,
    };
  } else {
    // Complex roots
    const realPart = -b / (2 * a);
    const imagPart = Math.sqrt(-d) / (2 * a);
    steps.push(`Since Δ < 0, there are 2 complex conjugate roots.`);
    steps.push(`x₁,₂ = (${formatNumber(realPart)}) ± (${formatNumber(Math.abs(imagPart))})i`);

    const r1 = `${formatNumber(realPart)} + ${formatNumber(Math.abs(imagPart))}i`;
    const r2 = `${formatNumber(realPart)} - ${formatNumber(Math.abs(imagPart))}i`;

    return {
      a,
      b,
      c,
      discriminant: d,
      isComplex: true,
      root1: r1,
      root2: r2,
      vertexX,
      vertexY,
      steps,
    };
  }
}

/**
 * 2x2 System of Linear Equations Solver:
 * a1*x + b1*y = c1
 * a2*x + b2*y = c2
 */
export interface LinearSystemSolution {
  x: string;
  y: string;
  determinant: number;
  steps: string[];
}

export function solveLinearSystem(
  a1: number,
  b1: number,
  c1: number,
  a2: number,
  b2: number,
  c2: number
): LinearSystemSolution {
  const det = a1 * b2 - a2 * b1;
  const steps: string[] = [
    `Equation 1: ${a1}x + ${b1}y = ${c1}`,
    `Equation 2: ${a2}x + ${b2}y = ${c2}`,
    `Main Determinant D = (${a1})(${b2}) - (${a2})(${b1}) = ${formatNumber(det)}`,
  ];

  if (Math.abs(det) < 1e-12) {
    throw new Error('Determinant is zero. The system has either no solutions or infinitely many solutions.');
  }

  const detX = c1 * b2 - c2 * b1;
  const detY = a1 * c2 - a2 * c1;
  const x = detX / det;
  const y = detY / det;

  steps.push(`Determinant Dx = (${c1})(${b2}) - (${c2})(${b1}) = ${formatNumber(detX)}`);
  steps.push(`Determinant Dy = (${a1})(${c2}) - (${a2})(${c1}) = ${formatNumber(detY)}`);
  steps.push(`x = Dx / D = ${formatNumber(x)}`);
  steps.push(`y = Dy / D = ${formatNumber(y)}`);

  return {
    x: formatNumber(x),
    y: formatNumber(y),
    determinant: det,
    steps,
  };
}

/**
 * Numerical Derivative at a point using central finite difference: f'(x)
 */
export function numericalDerivative(fnExpr: string, x0: number, h: number = 1e-5): number {
  const scope1 = { x: x0 + h };
  const scope2 = { x: x0 - h };
  const y1 = Number(math.evaluate(fnExpr, scope1));
  const y2 = Number(math.evaluate(fnExpr, scope2));
  return (y1 - y2) / (2 * h);
}

/**
 * Numerical Definite Integral from a to b using Simpson's rule: ∫_a^b f(x) dx
 */
export function numericalIntegral(fnExpr: string, a: number, b: number, n: number = 100): number {
  if (n % 2 !== 0) n += 1;
  const h = (b - a) / n;
  let sum = Number(math.evaluate(fnExpr, { x: a })) + Number(math.evaluate(fnExpr, { x: b }));

  for (let i = 1; i < n; i++) {
    const x = a + i * h;
    const y = Number(math.evaluate(fnExpr, { x }));
    sum += (i % 2 === 0 ? 2 : 4) * y;
  }

  return (h / 3) * sum;
}
