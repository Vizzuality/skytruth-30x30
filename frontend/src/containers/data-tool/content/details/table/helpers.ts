import { format } from 'd3-format';

const percentage = (value: number) => {
  return format(',.2r')(value) == '0.0' ? '0' : format(',.2r')(value);
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
