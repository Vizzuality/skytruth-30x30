import React from 'react';

import { formatPercentage } from '@/lib/utils/formats';

const ChartTooltip = ({ active, payload }) => {
  if (!active || !payload) return null;

  const percentageData = payload?.find(({ dataKey }) => dataKey === 'percentage');
  if (!percentageData?.payload) return null;

  const { percentage, year } = percentageData?.payload;

  return (
    <div className="flex flex-col gap-px border border-black bg-white p-4 font-mono text-xs">
      <span>Year: {year}</span>
      <span>Coverage: {formatPercentage(percentage)}</span>
    </div>
  );
};

export default ChartTooltip;
