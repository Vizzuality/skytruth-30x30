import { useMemo } from 'react';

import TooltipButton from '@/components/tooltip-button';
import { cn } from '@/lib/classnames';
import { formatPercentage, formatKM } from '@/lib/utils/formats';

const DEFAULT_MAX_PERCENTAGE = 100;
const PROTECTION_TARGET = 30;

type HorizontalBarChartProps = {
  className: string;
  data: {
    background: string;
    title?: string;
    totalArea: number;
    protectedArea: number;
    info?: string;
  };
  showLegend?: boolean;
  showTarget?: boolean;
};

const HorizontalBarChart: React.FC<HorizontalBarChartProps> = ({
  className,
  data,
  showLegend = true,
  showTarget = true,
}) => {
  const { title, background, totalArea, protectedArea, info } = data;

  const targetPositionPercentage = useMemo(() => {
    return (PROTECTION_TARGET * 100) / DEFAULT_MAX_PERCENTAGE;
  }, []);

  const protectedAreaPercentage = useMemo(() => {
    return formatPercentage((protectedArea / totalArea) * 100, { displayPercentageSign: false });
  }, [totalArea, protectedArea]);

  const barFillPercentage = useMemo(() => {
    const totalPercentage = (protectedArea * 100) / totalArea;
    const relativeToMaxPercentage = (totalPercentage * 100) / DEFAULT_MAX_PERCENTAGE;

    // Prevent overflowing if the bar fill exceeds the set max percentage
    return relativeToMaxPercentage > DEFAULT_MAX_PERCENTAGE ? 100 : relativeToMaxPercentage;
  }, [protectedArea, totalArea]);

  const formattedArea = useMemo(() => {
    return formatKM(totalArea);
  }, [totalArea]);

  return (
    <div className={cn('font-mono', className)}>
      <div className="flex items-end justify-end text-3xl font-bold">
        {protectedAreaPercentage}
        <span className="pb-1.5 pl-1 text-xs">%</span>
      </div>
      <div className="flex justify-between text-xs">
        <span className="flex items-center">
          {title && title}
          {info && <TooltipButton text={info} />}
        </span>
        <span>
          out of {formattedArea} km<sup>2</sup>
        </span>
      </div>
      <div className="relative my-2 flex h-3.5">
        <span className="absolute top-1/2 h-px w-full border-b border-dashed border-black"></span>
        <span
          className="absolute top-0 bottom-0 left-0 border border-black !bg-cover"
          style={{
            background,
            width: `${barFillPercentage}%`,
          }}
        />
        {showTarget && (
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
        )}
      </div>
      {showLegend && (
        <div className="flex justify-between text-xs">
          <span>0%</span>
          <span>{DEFAULT_MAX_PERCENTAGE}%</span>
        </div>
      )}
    </div>
  );
};

export default HorizontalBarChart;
