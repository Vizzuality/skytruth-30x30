export function formatPercentage(
  value: number,
  options?: Intl.NumberFormatOptions & { displayPercentageSign?: boolean }
) {
  const { displayPercentageSign = true, ...intlNumberFormatOptions } = options || {};

  if (value < 0.1 && value > 0) {
    return displayPercentageSign ? '<0.1%' : '<0.1';
  }

  // Sanity check to prevent the display of percentages over 100.
  // This should never be true, but data can be wonky hence this last resort check.
  if (value > 100) {
    return displayPercentageSign ? '100.0%' : '100.0';
  }

  const v = Intl.NumberFormat('en-US', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
    style: displayPercentageSign ? 'percent' : 'decimal',
    ...intlNumberFormatOptions,
  });

  return v.format(displayPercentageSign ? value / 100 : value);
}

export function formatKM(value: number, options?: Intl.NumberFormatOptions) {
  if (value < 1 && value > 0) return '<1';

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
