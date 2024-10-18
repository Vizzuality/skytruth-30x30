import { formatPercentage, formatKM } from '@/lib/utils/formats';

const percentage = (
  locale: string,
  value: number,
  options: { displayPercentageSign?: boolean; displayZeroValue?: boolean } = {
    displayPercentageSign: false,
  }
) => {
  return formatPercentage(locale, value, options);
};

const area = (locale: string, value: number) => {
  return formatKM(locale, value);
};

const capitalize = (value: string) => {
  return value.charAt(0).toUpperCase() + value.slice(1);
};

export const cellFormatter = {
  percentage,
  area,
  capitalize,
};
