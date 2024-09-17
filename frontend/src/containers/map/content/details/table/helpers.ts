import { formatPercentage, formatKM } from '@/lib/utils/formats';

const percentage = (locale: string, value: number) => {
  return formatPercentage(locale, value, { displayPercentageSign: false });
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
