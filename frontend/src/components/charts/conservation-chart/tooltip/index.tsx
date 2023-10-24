import React, { useMemo } from 'react';

import { format } from 'd3-format';

const ChartTooltip = ({ active, payload }) => {
  const { percentage, year, protectedArea, totalArea, future } = payload[0]?.payload || {};

  const formattedAreas = useMemo(() => {
    return {
      protected: format(',.2r')(protectedArea),
      total: format(',.2r')(totalArea),
    };
  }, [protectedArea, totalArea]);

  if (!active || !payload?.length) return null;

  return (
    <div className="flex flex-col gap-px rounded-md border border-black bg-white p-4 text-sm">
      <span>Year: {year}</span>
      {!future && (
        <>
          <span>Protection percentage: {percentage}%</span>
          <span>
            Protected area: {formattedAreas.protected} km<sup>2</sup>
          </span>
          <span>
            Total area: {formattedAreas.total} km<sup>2</sup>
          </span>
        </>
      )}
    </div>
  );
};

export default ChartTooltip;
