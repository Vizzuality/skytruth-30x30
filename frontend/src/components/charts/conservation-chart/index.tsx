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

import TooltipButton from '@/components/tooltip-button';
import { cn } from '@/lib/classnames';
import { useGetDataInfos } from '@/types/generated/data-info';

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

const TARGET_YEAR = 2030;
const LINE_LAST_COLUMN_OFFSET = 0.5;

const ConservationChart: React.FC<ConservationChartProps> = ({ className, data }) => {
  const barChartData = useMemo(() => {
    // Last year of data available
    const lastEntryYear = data[data.length - 1]?.year;

    // Add bogus values from the last year to the target year (2030) to the array, so that the chart
    // displays years from the beginning of the historical data, until the target year (projection).
    const missingYearsArr = [...Array(TARGET_YEAR - lastEntryYear).keys()].map(
      (i) => i + lastEntryYear + 1
    );

    const missingYearsData = missingYearsArr.map((year) => {
      return {
        percentage: 0,
        year: year,
        active: false,
        totalArea: null,
        protectedArea: null,
        future: true,
      };
    });

    // Cap results to the least 20 entries, or chart will be too big
    return [...data, ...missingYearsData].slice(-20);
  }, [data]);

  // Not using useMemo as it may not be worth the overhead, performance wise
  const firstYearData = barChartData[0];
  const lastYearData = barChartData[barChartData?.length - 1];
  const activeYearData = barChartData.find(({ active }) => active);
  const xAxisTicks = [firstYearData.year, activeYearData.year, lastYearData.year];

  // Calculate data for the historical line; first and active year are known, years in between
  // need to be extrapolated.
  const historicalLineData = useMemo(() => {
    const missingYearsArr = [...Array(activeYearData.year - firstYearData.year - 1).keys()].map(
      (i) => i + firstYearData.year + 1
    );

    const delta =
      (activeYearData.percentage - firstYearData.percentage) / (13 + LINE_LAST_COLUMN_OFFSET);

    const extrapolatedHistoricalYears = missingYearsArr.map((year, idx) => {
      return {
        year,
        percentage: firstYearData.percentage + delta * (idx + 1),
      };
    });

    return [
      { year: firstYearData.year, percentage: firstYearData.percentage },
      ...extrapolatedHistoricalYears,
      {
        year: activeYearData.year + LINE_LAST_COLUMN_OFFSET,
        percentage: activeYearData.percentage,
      },
    ];
  }, [activeYearData, firstYearData]);

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

  const { data: dataInfo } = useGetDataInfos(
    {
      filters: {
        slug: '30x30-target',
      },
    },
    {
      query: {
        select: ({ data }) => data?.[0],
        placeholderData: { data: [] },
      },
    }
  );

  return (
    <div className={cn(className, 'text-xs text-black')}>
      <ResponsiveContainer>
        <ComposedChart data={barChartData}>
          <CartesianGrid vertical={false} strokeDasharray="3 3" />
          <ReferenceLine
            xAxisId={1}
            y={30}
            label={(props) => {
              const { viewBox } = props;
              return (
                <g>
                  <text {...viewBox} x={viewBox.x + 5} y={viewBox.y - 2}>
                    30x30 Target
                  </text>
                  <foreignObject
                    {...viewBox}
                    x={viewBox.x + 90}
                    y={viewBox.y - 17}
                    width="160"
                    height="160"
                  >
                    <TooltipButton
                      text={dataInfo?.attributes.content}
                      className="hover:bg-transparent"
                    />
                  </foreignObject>
                </g>
              );
            }}
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
            {barChartData.map((entry, index) => (
              <Cell
                stroke="black"
                fill={entry?.active ? '#4879FF' : 'transparent'}
                key={`cell-${index}`}
              />
            ))}
          </Bar>

          {/* <Tooltip /> */}
        </ComposedChart>
      </ResponsiveContainer>
      <ChartLegend />
    </div>
  );
};

export default ConservationChart;
