export interface UnitItem {
  id: string;
  name: string;
  symbol: string;
  factor: number; // Ratio to base unit (e.g., 1 km = 1000 m)
  description?: string;
}

export interface UnitCategory {
  id: string;
  name: string;
  baseUnit: string;
  iconName: string;
  units: UnitItem[];
}

export const UNIT_CATEGORIES: UnitCategory[] = [
  {
    id: 'length',
    name: 'Length & Distance',
    baseUnit: 'm',
    iconName: 'Ruler',
    units: [
      { id: 'm', name: 'Meter', symbol: 'm', factor: 1 },
      { id: 'km', name: 'Kilometer', symbol: 'km', factor: 1000 },
      { id: 'cm', name: 'Centimeter', symbol: 'cm', factor: 0.01 },
      { id: 'mm', name: 'Millimeter', symbol: 'mm', factor: 0.001 },
      { id: 'um', name: 'Micrometer', symbol: 'µm', factor: 1e-6 },
      { id: 'nm', name: 'Nanometer', symbol: 'nm', factor: 1e-9 },
      { id: 'angstrom', name: 'Angstrom', symbol: 'Å', factor: 1e-10 },
      { id: 'in', name: 'Inch', symbol: 'in', factor: 0.0254 },
      { id: 'ft', name: 'Foot', symbol: 'ft', factor: 0.3048 },
      { id: 'yd', name: 'Yard', symbol: 'yd', factor: 0.9144 },
      { id: 'mi', name: 'Mile', symbol: 'mi', factor: 1609.344 },
      { id: 'nmi', name: 'Nautical Mile', symbol: 'nmi', factor: 1852 },
      { id: 'au', name: 'Astronomical Unit', symbol: 'AU', factor: 1.495978707e11 },
      { id: 'ly', name: 'Light Year', symbol: 'ly', factor: 9.460730472e15 },
    ],
  },
  {
    id: 'mass',
    name: 'Mass & Weight',
    baseUnit: 'kg',
    iconName: 'Scale',
    units: [
      { id: 'kg', name: 'Kilogram', symbol: 'kg', factor: 1 },
      { id: 'g', name: 'Gram', symbol: 'g', factor: 0.001 },
      { id: 'mg', name: 'Milligram', symbol: 'mg', factor: 1e-6 },
      { id: 'ug', name: 'Microgram', symbol: 'µg', factor: 1e-9 },
      { id: 'tonne', name: 'Metric Ton', symbol: 't', factor: 1000 },
      { id: 'lb', name: 'Pound', symbol: 'lb', factor: 0.45359237 },
      { id: 'oz', name: 'Ounce', symbol: 'oz', factor: 0.028349523125 },
      { id: 'st', name: 'Stone', symbol: 'st', factor: 6.35029318 },
      { id: 'carat', name: 'Carat', symbol: 'ct', factor: 0.0002 },
      { id: 'amu', name: 'Atomic Mass Unit', symbol: 'u', factor: 1.660539066e-27 },
    ],
  },
  {
    id: 'temperature',
    name: 'Temperature',
    baseUnit: 'c',
    iconName: 'Thermometer',
    units: [
      { id: 'c', name: 'Celsius', symbol: '°C', factor: 1 },
      { id: 'f', name: 'Fahrenheit', symbol: '°F', factor: 1 },
      { id: 'k', name: 'Kelvin', symbol: 'K', factor: 1 },
      { id: 'r', name: 'Rankine', symbol: '°R', factor: 1 },
    ],
  },
  {
    id: 'speed',
    name: 'Speed & Velocity',
    baseUnit: 'm_s',
    iconName: 'Gauge',
    units: [
      { id: 'm_s', name: 'Meters per second', symbol: 'm/s', factor: 1 },
      { id: 'km_h', name: 'Kilometers per hour', symbol: 'km/h', factor: 0.2777777778 },
      { id: 'mph', name: 'Miles per hour', symbol: 'mph', factor: 0.44704 },
      { id: 'knot', name: 'Knot', symbol: 'kn', factor: 0.5144444444 },
      { id: 'ft_s', name: 'Feet per second', symbol: 'ft/s', factor: 0.3048 },
      { id: 'mach', name: 'Mach (Standard Air)', symbol: 'Ma', factor: 340.29 },
      { id: 'c_speed', name: 'Speed of Light (c)', symbol: 'c', factor: 299792458 },
    ],
  },
  {
    id: 'pressure',
    name: 'Pressure',
    baseUnit: 'pa',
    iconName: 'Activity',
    units: [
      { id: 'pa', name: 'Pascal', symbol: 'Pa', factor: 1 },
      { id: 'kpa', name: 'Kilopascal', symbol: 'kPa', factor: 1000 },
      { id: 'mpa', name: 'Megapascal', symbol: 'MPa', factor: 1e6 },
      { id: 'bar', name: 'Bar', symbol: 'bar', factor: 100000 },
      { id: 'mbar', name: 'Millibar', symbol: 'mbar', factor: 100 },
      { id: 'atm', name: 'Standard Atmosphere', symbol: 'atm', factor: 101325 },
      { id: 'psi', name: 'Pound per sq. inch', symbol: 'psi', factor: 6894.75729 },
      { id: 'torr', name: 'Torr / mmHg', symbol: 'Torr', factor: 133.322368 },
    ],
  },
  {
    id: 'energy',
    name: 'Energy & Work',
    baseUnit: 'j',
    iconName: 'Zap',
    units: [
      { id: 'j', name: 'Joule', symbol: 'J', factor: 1 },
      { id: 'kj', name: 'Kilojoule', symbol: 'kJ', factor: 1000 },
      { id: 'cal', name: 'Calorie (Thermochemical)', symbol: 'cal', factor: 4.184 },
      { id: 'kcal', name: 'Kilocalorie (Food)', symbol: 'kcal', factor: 4184 },
      { id: 'wh', name: 'Watt-hour', symbol: 'Wh', factor: 3600 },
      { id: 'kwh', name: 'Kilowatt-hour', symbol: 'kWh', factor: 3.6e6 },
      { id: 'ev', name: 'Electron-volt', symbol: 'eV', factor: 1.602176634e-19 },
      { id: 'mev', name: 'Mega-electronvolt', symbol: 'MeV', factor: 1.602176634e-13 },
      { id: 'btu', name: 'British Thermal Unit', symbol: 'BTU', factor: 1055.056 },
      { id: 'ft_lb', name: 'Foot-pound', symbol: 'ft⋅lb', factor: 1.355817948 },
    ],
  },
  {
    id: 'power',
    name: 'Power',
    baseUnit: 'w',
    iconName: 'Cpu',
    units: [
      { id: 'w', name: 'Watt', symbol: 'W', factor: 1 },
      { id: 'kw', name: 'Kilowatt', symbol: 'kW', factor: 1000 },
      { id: 'mw', name: 'Megawatt', symbol: 'MW', factor: 1e6 },
      { id: 'hp', name: 'Mechanical Horsepower', symbol: 'hp', factor: 745.69987 },
      { id: 'metric_hp', name: 'Metric Horsepower (PS)', symbol: 'PS', factor: 735.49875 },
      { id: 'btu_h', name: 'BTU per hour', symbol: 'BTU/h', factor: 0.293071 },
      { id: 'ft_lb_s', name: 'Foot-pound/sec', symbol: 'ft⋅lb/s', factor: 1.355818 },
    ],
  },
  {
    id: 'area',
    name: 'Area',
    baseUnit: 'm2',
    iconName: 'Square',
    units: [
      { id: 'm2', name: 'Square Meter', symbol: 'm²', factor: 1 },
      { id: 'km2', name: 'Square Kilometer', symbol: 'km²', factor: 1e6 },
      { id: 'cm2', name: 'Square Centimeter', symbol: 'cm²', factor: 1e-4 },
      { id: 'ft2', name: 'Square Foot', symbol: 'ft²', factor: 0.09290304 },
      { id: 'in2', name: 'Square Inch', symbol: 'in²', factor: 0.00064516 },
      { id: 'ac', name: 'Acre', symbol: 'ac', factor: 4046.85642 },
      { id: 'ha', name: 'Hectare', symbol: 'ha', factor: 10000 },
      { id: 'mi2', name: 'Square Mile', symbol: 'mi²', factor: 2589988.11 },
    ],
  },
  {
    id: 'volume',
    name: 'Volume & Capacity',
    baseUnit: 'l',
    iconName: 'Box',
    units: [
      { id: 'l', name: 'Liter', symbol: 'L', factor: 1 },
      { id: 'ml', name: 'Milliliter', symbol: 'mL', factor: 0.001 },
      { id: 'm3', name: 'Cubic Meter', symbol: 'm³', factor: 1000 },
      { id: 'cm3', name: 'Cubic Centimeter', symbol: 'cm³', factor: 0.001 },
      { id: 'gal_us', name: 'US Gallon', symbol: 'gal', factor: 3.785411784 },
      { id: 'qt_us', name: 'US Quart', symbol: 'qt', factor: 0.946352946 },
      { id: 'pt_us', name: 'US Pint', symbol: 'pt', factor: 0.473176473 },
      { id: 'cup_us', name: 'US Cup', symbol: 'cup', factor: 0.24 },
      { id: 'fl_oz', name: 'US Fluid Ounce', symbol: 'fl oz', factor: 0.029573529 },
      { id: 'tbsp', name: 'Tablespoon', symbol: 'tbsp', factor: 0.01478676 },
      { id: 'tsp', name: 'Teaspoon', symbol: 'tsp', factor: 0.00492892 },
    ],
  },
  {
    id: 'digital',
    name: 'Digital Storage',
    baseUnit: 'b',
    iconName: 'HardDrive',
    units: [
      { id: 'b_byte', name: 'Byte', symbol: 'B', factor: 1 },
      { id: 'kb', name: 'Kilobyte', symbol: 'KB', factor: 1000 },
      { id: 'kib', name: 'Kibibyte', symbol: 'KiB', factor: 1024 },
      { id: 'mb', name: 'Megabyte', symbol: 'MB', factor: 1e6 },
      { id: 'mib', name: 'Mebibyte', symbol: 'MiB', factor: 1048576 },
      { id: 'gb', name: 'Gigabyte', symbol: 'GB', factor: 1e9 },
      { id: 'gib', name: 'Gibibyte', symbol: 'GiB', factor: 1073741824 },
      { id: 'tb', name: 'Terabyte', symbol: 'TB', factor: 1e12 },
      { id: 'bit', name: 'Bit', symbol: 'b', factor: 0.125 },
      { id: 'mbit', name: 'Megabit', symbol: 'Mb', factor: 125000 },
    ],
  },
  {
    id: 'angle',
    name: 'Angle',
    baseUnit: 'deg',
    iconName: 'Compass',
    units: [
      { id: 'deg', name: 'Degree', symbol: '°', factor: 1 },
      { id: 'rad', name: 'Radian', symbol: 'rad', factor: 180 / Math.PI },
      { id: 'grad', name: 'Gradian', symbol: 'grad', factor: 0.9 },
      { id: 'arcmin', name: 'Arcminute', symbol: 'arcmin', factor: 1 / 60 },
      { id: 'arcsec', name: 'Arcsecond', symbol: 'arcsec', factor: 1 / 3600 },
      { id: 'turn', name: 'Revolution (Turn)', symbol: 'turn', factor: 360 },
    ],
  },
  {
    id: 'force',
    name: 'Force',
    baseUnit: 'n',
    iconName: 'Anchor',
    units: [
      { id: 'n', name: 'Newton', symbol: 'N', factor: 1 },
      { id: 'kn', name: 'Kilonewton', symbol: 'kN', factor: 1000 },
      { id: 'dyn', name: 'Dyne', symbol: 'dyn', factor: 1e-5 },
      { id: 'lbf', name: 'Pound-force', symbol: 'lbf', factor: 4.448222 },
      { id: 'kgf', name: 'Kilogram-force', symbol: 'kgf', factor: 9.80665 },
    ],
  },
];

/**
 * Convert value between units
 */
export function convertUnit(
  categoryId: string,
  fromUnitId: string,
  toUnitId: string,
  value: number
): { result: number; formula: string; reciprocal: number } {
  if (isNaN(value)) {
    return { result: 0, formula: 'Invalid input', reciprocal: 0 };
  }

  const category = UNIT_CATEGORIES.find((c) => c.id === categoryId);
  if (!category) throw new Error(`Category ${categoryId} not found`);

  const fromUnit = category.units.find((u) => u.id === fromUnitId);
  const toUnit = category.units.find((u) => u.id === toUnitId);

  if (!fromUnit || !toUnit) {
    throw new Error('Unit not found in category');
  }

  // Special handling for Temperature (affine transformations)
  if (categoryId === 'temperature') {
    let celsius = value;
    if (fromUnitId === 'f') celsius = ((value - 32) * 5) / 9;
    else if (fromUnitId === 'k') celsius = value - 273.15;
    else if (fromUnitId === 'r') celsius = ((value - 491.67) * 5) / 9;

    let res = celsius;
    if (toUnitId === 'f') res = (celsius * 9) / 5 + 32;
    else if (toUnitId === 'k') res = celsius + 273.15;
    else if (toUnitId === 'r') res = ((celsius + 273.15) * 9) / 5;

    let formula = '';
    if (fromUnitId === 'c' && toUnitId === 'f') formula = '°F = (°C × 9/5) + 32';
    else if (fromUnitId === 'f' && toUnitId === 'c') formula = '°C = (°F - 32) × 5/9';
    else if (fromUnitId === 'c' && toUnitId === 'k') formula = 'K = °C + 273.15';
    else if (fromUnitId === 'k' && toUnitId === 'c') formula = '°C = K - 273.15';
    else formula = `${fromUnit.symbol} → ${toUnit.symbol}`;

    return {
      result: res,
      formula,
      reciprocal: 0,
    };
  }

  // Standard ratio-based conversion via base unit:
  // baseValue = value * fromUnit.factor
  // result = baseValue / toUnit.factor
  const baseValue = value * fromUnit.factor;
  const result = baseValue / toUnit.factor;
  const ratio = fromUnit.factor / toUnit.factor;
  const reciprocal = ratio !== 0 ? 1 / ratio : 0;

  const formula = `1 ${fromUnit.symbol} = ${(ratio).toPrecision(6)} ${toUnit.symbol}`;

  return {
    result,
    formula,
    reciprocal,
  };
}
