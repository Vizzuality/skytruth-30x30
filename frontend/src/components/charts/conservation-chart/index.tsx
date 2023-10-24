import { useMemo } from 'react';

import {
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Cell,
  // Tooltip,
  ReferenceLine,
  Line,
} from 'recharts';

import { cn } from '@/lib/utils';

import ChartLegend from './legend';

// import ChartTooltip from './tooltip';

type ConservationChartProps = {
  className?: string;
  data: {
    year?: number;
    percentage: number;
    protectedArea: number;
    totalArea: number;
    active?: boolean;
    future?: boolean;
  }[];
};

const ConservationChart: React.FC<ConservationChartProps> = ({ className, data }) => {
  const firstYearData = data[0];
  const lastYearData = data[data?.length - 1];
  const activeYearData = data.find(({ active }) => active);
  const xAxisTicks = [firstYearData.year, activeYearData.year, lastYearData.year];

  const historicalLineData = [
    { year: firstYearData.year, percentage: firstYearData.percentage },
    { year: activeYearData.year + 0.5, percentage: activeYearData.percentage },
  ];

  const projectedPercentage = useMemo(() => {
    const numHistoricalYears = activeYearData.year - firstYearData.year;
    const numProjectedYears = lastYearData.year - activeYearData.year;

    const projectedPercentageChange =
      ((activeYearData.percentage - firstYearData.percentage) / numHistoricalYears) *
      numProjectedYears;

    return activeYearData.percentage + projectedPercentageChange;
  }, [
    activeYearData.percentage,
    activeYearData.year,
    firstYearData.percentage,
    firstYearData.year,
    lastYearData.year,
  ]);

  const projectedLineData = [
    { year: activeYearData.year + 0.5, percentage: activeYearData.percentage },
    { year: lastYearData.year, percentage: projectedPercentage },
  ];

  return (
    <div className={cn(className, 'text-xs text-black')}>
      <ResponsiveContainer>
        <ComposedChart data={data}>
          <CartesianGrid vertical={false} strokeDasharray="3 3" />
          <ReferenceLine
            xAxisId={1}
            y={30}
            label={{ position: 'insideBottomLeft', value: '30x30 Target', fill: '#FD8E28' }}
            stroke="#FD8E28"
            strokeDasharray="3 3"
          />
          <ReferenceLine
            xAxisId={1}
            x={firstYearData.year - 0.4}
            label={{ position: 'insideTopLeft', value: 'Historical', fill: '#000' }}
            stroke="#000"
          />
          <ReferenceLine
            xAxisId={1}
            x={activeYearData.year + 0.4}
            label={{ position: 'insideTopLeft', value: 'Future Projection', fill: '#000' }}
            stroke="#000"
          />
          <XAxis
            xAxisId={1}
            type="number"
            dataKey="year"
            ticks={xAxisTicks}
            domain={[firstYearData.year - 0.4, lastYearData.year]}
          />
          <XAxis
            xAxisId={2}
            type="number"
            dataKey="year"
            hide={true}
            domain={[firstYearData.year, lastYearData.year]}
          />
          <YAxis
            domain={[0, 55]}
            ticks={[0, 15, 30, 45, 55]}
            tickFormatter={(value) => `${value}%`}
          />
          {/*
            // TODO: Investigate tooltip
            // Tooltip does not play nice when the Line charts are used (no payload)
            <Tooltip content={<ChartTooltip />} />
          */}
          <Line
            xAxisId={2}
            type="monotone"
            data={historicalLineData}
            strokeWidth={2}
            dataKey="percentage"
            stroke="#4879FF"
            dot={false}
          />
          <Line
            xAxisId={2}
            type="monotone"
            data={projectedLineData}
            strokeWidth={2}
            strokeDasharray="4 4"
            dataKey="percentage"
            stroke="#4879FF"
            dot={false}
          />
          <Bar dataKey="percentage" xAxisId={1}>
            {data.map((entry, index) => (
              <Cell
                stroke="black"
                fill={entry?.active ? '#4879FF' : 'transparent'}
                key={`cell-${index}`}
              />
            ))}
          </Bar>
        </ComposedChart>
      </ResponsiveContainer>
      <ChartLegend />
    </div>
  );
};

export default ConservationChart;
