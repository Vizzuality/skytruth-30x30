import TooltipButton from '@/components/tooltip-button';
import { cn } from '@/lib/classnames';
import { formatPercentage, formatKM } from '@/lib/utils/formats';

const DEFAULT_MAX_PERCENTAGE = 100;

type StackedHorizontalBarChartProps = {
  className: string;
  title?: string;
  info?: string;
  totalProtectedArea: number;
  totalArea: number;
  highlightedPercentage: number;
  data: {
    background: string;
    total: number;
    totalPercentage: number;
  }[];
  showLegend?: boolean;
  showTarget?: boolean;
};

const StackedHorizontalBarChart: React.FC<StackedHorizontalBarChartProps> = ({
  className,
  data,
  title,
  info,
  totalProtectedArea,
  totalArea,
  highlightedPercentage,
  showLegend = true,
  showTarget = true,
}) => {
  return (
    <div className={cn('font-mono', className)}>
      <div className="flex items-end justify-end text-3xl font-bold">
        {formatPercentage(highlightedPercentage, { displayPercentageSign: false })}
        <span className="pb-1.5 pl-1 text-xs">%</span>
      </div>
      <div className="flex justify-between text-xs">
        <span className="flex items-center">
          {title && title}
          {info && <TooltipButton text={info} />}
        </span>
        <span className="text-right">
          {formatKM(totalProtectedArea)} km<sup>2</sup> out of {formatKM(totalArea)} km<sup>2</sup>
        </span>
      </div>
      <div className="relative my-2 flex h-3.5">
        <span className="absolute top-1/2 h-px w-full border-b border-dashed border-black"></span>
        {data.map((item, index) => (
          <span
            key={index}
            className="absolute top-0 bottom-0 left-0  !bg-cover"
            style={{
              background: item.background,
              width: `${item.totalPercentage}%`,
              ...(index > 0 && { left: `${data[index - 1].totalPercentage}%` }),
            }}
          />
        ))}
        {showTarget && (
          <span className="absolute top-0 bottom-0 left-[30%] w-1 border-x border-white bg-orange">
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

export default StackedHorizontalBarChart;
