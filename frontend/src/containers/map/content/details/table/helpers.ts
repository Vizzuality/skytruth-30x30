import { format } from 'd3-format';

import { formatPercentage } from '@/lib/utils/formats';

const percentage = (value: number) => {
  return formatPercentage(value, { displayPercentageSign: false });
};

const area = (value: number) => {
  return format(',.2r')(value);
};

const capitalize = (value: string) => {
  return value.charAt(0).toUpperCase() + value.slice(1);
};

export const cellFormatter = {
  percentage,
  area,
  capitalize,
};
