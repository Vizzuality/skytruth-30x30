import { useMemo } from 'react';

import { format } from 'd3-format';

import { cn } from '@/lib/classnames';

const DEFAULT_BAR_COLOR = '#1E1E1E';
const DEFAULT_MAX_PERCENTAGE = 100;
const PROTECTION_TARGET = 30;

type HorizontalBarChartProps = {
  className: string;
  data: {
    barColor: string;
    title: string;
    totalArea: number;
    protectedArea: number;
  };
};

const HorizontalBarChart: React.FC<HorizontalBarChartProps> = ({ className, data }) => {
  const { title, barColor, totalArea, protectedArea } = data;

  const targetPositionPercentage = useMemo(() => {
    return (PROTECTION_TARGET * 100) / DEFAULT_MAX_PERCENTAGE;
  }, []);

  const protectedAreaPercentage = useMemo(() => {
    return format('.2r')((protectedArea * 100) / totalArea);
  }, [totalArea, protectedArea]);

  const barFillPercentage = useMemo(() => {
    const totalPercentage = (protectedArea * 100) / totalArea;
    const relativeToMaxPercentage = (totalPercentage * 100) / DEFAULT_MAX_PERCENTAGE;

    // Prevent overflowing if the bar fill exceeds the set max percentage
    return relativeToMaxPercentage > DEFAULT_MAX_PERCENTAGE ? 100 : relativeToMaxPercentage;
  }, [protectedArea, totalArea]);

  const formattedArea = useMemo(() => {
    return format(',.2r')(totalArea);
  }, [totalArea]);

  return (
    <div className={cn(className)}>
      <div className="flex items-end justify-end text-3xl font-bold">
        {protectedAreaPercentage}
        <span className="pb-1.5 pl-1.5 text-xs">%</span>
      </div>
      <div className="flex justify-between text-xs">
        <span>{title} (i)</span>
        <span>
          of {formattedArea} km<sup>2</sup>
        </span>
      </div>
      <div className="relative my-2 flex h-3">
        <span className="absolute top-1/2 h-px w-full border-b border-dashed border-black"></span>
        <span
          className="absolute top-0 bottom-0 left-0"
          style={{ backgroundColor: barColor || DEFAULT_BAR_COLOR, width: `${barFillPercentage}%` }}
        ></span>
        <span
          className="absolute top-0 bottom-0 w-1 border-x border-white bg-orange"
          style={{
            left: `${targetPositionPercentage}%`,
          }}
        >
          <span className="absolute right-0 top-5 whitespace-nowrap text-xs text-orange">
            30% target
          </span>
        </span>
      </div>
      <div className="flex justify-between text-xs">
        <span>0%</span>
        <span>{DEFAULT_MAX_PERCENTAGE}%</span>
      </div>
    </div>
  );
};

export default HorizontalBarChart;
