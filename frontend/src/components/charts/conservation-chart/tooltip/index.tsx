import React from 'react';

import { useRouter } from 'next/router';

import { useTranslations } from 'next-intl';

import { formatPercentage } from '@/lib/utils/formats';
import { FCWithMessages } from '@/types';

const ChartTooltip: FCWithMessages<{
  active: boolean;
  payload?: { dataKey: string; payload?: { percentage: number; year: number } }[];
}> = ({ active, payload }) => {
  const t = useTranslations('components.chart-conservation');

  const { locale } = useRouter();

  if (!active || !payload) return null;

  const percentageData = payload?.find(({ dataKey }) => dataKey === 'percentage');
  if (!percentageData?.payload) return null;

  const { percentage, year } = percentageData?.payload;

  return (
    <div className="flex flex-col gap-px border border-black bg-white p-4 font-mono text-xs">
      <span>{t('year-value', { value: year })}</span>
      <span>{t('coverage-value', { percentage: formatPercentage(locale, percentage) })}</span>
    </div>
  );
};

ChartTooltip.messages = ['components.chart-conservation'];

export default ChartTooltip;
