export function formatPercentage(value: number, options?: Intl.NumberFormatOptions) {
  const v = Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
    style: 'percent',
    ...options,
  });

  return v.format(value);
}

export function formatHA(value: number, options?: Intl.NumberFormatOptions) {
  const v = Intl.NumberFormat('en-US', {
    notation: 'compact',
    compactDisplay: 'short',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
    style: 'unit',
    unit: 'hectare',
    unitDisplay: 'short',
    ...options,
  });

  return v.format(value);
}

const FORMATS = {
  formatPercentage,
  formatHA,
} as const;

export type FormatProps = {
  value: unknown;
  id?: keyof typeof FORMATS;
  options?: Intl.NumberFormatOptions;
};

export function format({ id, value, options }: FormatProps) {
  const fn = id ? FORMATS[id] : undefined;

  if (typeof fn === 'function' && typeof value === 'number') {
    return fn(value, options);
  }

  if (typeof value === 'number') {
    return value.toLocaleString();
  }

  if (typeof value === 'string') {
    return value;
  }
}

export default FORMATS;
