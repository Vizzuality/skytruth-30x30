import { formatNumber } from '@/lib/utils/formats';

export const injectLastYearRange = ({ url }: { url: string }) => {
  const endDate = new Date();
  const startDate = new Date(endDate);
  startDate.setMonth(endDate.getMonth() - 12);

  const formatDate = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };

  return url.replace('{{LAST_YEAR_RANGE}}', `${formatDate(startDate)},${formatDate(endDate)}`);
};

export const injectZoom = ({ url, zoom }: { url: string; zoom: number }) => {
  return url.replace('{{ZOOM}}', `${zoom}`);
};

export const getFishingEffortBins = async ({
  url,
  colors,
  zoom,
}: {
  url: string;
  colors: string[];
  zoom: number;
}) => {
  const data = await fetch(
    injectZoom({ url: injectLastYearRange({ url }), zoom: Math.min(12, Math.round(zoom)) }),
    {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_GLOBAL_FISHING_WATCH_TOKEN}`,
      },
    }
  ).then((res) => res.json());

  const entries = data.entries[0] as number[];

  const res = [];
  for (let i = 0, j = colors.length - 1; i < j; i++) {
    res.push(colors[i] ?? '#FFFFFF');
    res.push(entries?.[i] ?? i * 10000000);
  }

  res.push(colors[entries.length - 1] ?? '#FFFFFF');

  return res;
};

export const getFishingEffortLegendConfig = async ({
  url,
  colors,
  zoom,
  locale,
}: {
  url: string;
  colors: string[];
  zoom: number;
  locale: string;
}) => {
  const data = await fetch(
    injectZoom({ url: injectLastYearRange({ url }), zoom: Math.min(12, Math.round(zoom)) }),
    {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_GLOBAL_FISHING_WATCH_TOKEN}`,
      },
    }
  ).then((res) => res.json());

  const entries = data.entries[0] as number[];

  const res = [];
  for (let i = 0, j = colors.length - 1; i <= j; i++) {
    const value = entries?.[i] ?? i * 10000000;
    res.push({
      color: colors[i] ?? '#FFFFFF',
      value:
        i % 3 === 0
          ? `${formatNumber(locale, value, {
              notation: 'compact',
              compactDisplay: 'short',
              maximumFractionDigits: 1,
            })}${i === colors.length - 1 ? '>=' : ''}`
          : '',
    });
  }

  return res;
};

export const getAtIndex = <T>({ array, index }: { array: T[]; index: number }) => {
  return array[index];
};

const GETTERS = {
  injectZoom,
  injectLastYearRange,
  getFishingEffortBins,
  getFishingEffortLegendConfig,
  getAtIndex,
};

export default GETTERS;
