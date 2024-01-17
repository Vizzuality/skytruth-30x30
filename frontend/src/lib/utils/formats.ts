export function formatPercentage(value: number, options?: Intl.NumberFormatOptions) {
  const v = Intl.NumberFormat('en-US', {
    maximumFractionDigits: 3,
    style: 'percent',
    ...options,
  });

  return v.format(value);
}

export function formatKM(value: number, options?: Intl.NumberFormatOptions) {
  const v = Intl.NumberFormat('en-US', {
    notation: 'standard',
    compactDisplay: 'short',
    unit: 'kilometer',
    unitDisplay: 'short',
    maximumFractionDigits: 0,
    ...options,
  });

  return v.format(value);
}

const FORMATS = {
  formatPercentage,
  formatKM,
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
