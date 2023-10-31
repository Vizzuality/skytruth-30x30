import { FC } from 'react';

import { LayerTyped } from '@/types/layers';

export interface LegendItemsProps {
  items: LayerTyped['legend_config'];
}

const LegendItems: FC<LegendItemsProps> = ({ items }) => {
  switch (items.type) {
    case 'basic':
      return (
        <ul className="flex w-full flex-col space-y-1">
          {items.items.map(({ value, color }) => (
            <li key={`${value}`} className="flex space-x-2 text-xs">
              <div
                className="mt-0.5 h-3 w-3 flex-shrink-0 border border-gray-300"
                style={{
                  backgroundColor: color,
                }}
              />
              <div>{value}</div>
            </li>
          ))}
        </ul>
      );

    case 'choropleth':
      return (
        <>
          <ul className="flex w-full">
            {items.items.map(({ color }) => (
              <li
                key={`${color}`}
                className="h-2 flex-shrink-0"
                style={{
                  width: `${100 / items.items.length}%`,
                  backgroundColor: color,
                }}
              />
            ))}
          </ul>

          <ul className="mt-1 flex w-full">
            {items.items.map(({ value }) => (
              <li
                key={`${value}`}
                className="flex-shrink-0 text-center text-xs"
                style={{
                  width: `${100 / items.items.length}%`,
                }}
              >
                {value}
              </li>
            ))}
          </ul>
        </>
      );

    case 'gradient':
      return (
        <>
          <div
            className="flex h-2 w-full"
            style={{
              backgroundImage: `linear-gradient(to right, ${items.items
                .map((i) => i.color)
                .join(',')})`,
            }}
          />

          <ul className="mt-1 flex w-full justify-between">
            {items.items
              .filter(({ value }) => typeof value !== 'undefined' && value !== null)
              .map(({ value }) => (
                <li key={`${value}`} className="flex-shrink-0 text-xs">
                  {value}
                </li>
              ))}
          </ul>
        </>
      );

    default:
      return null;
  }
};

export default LegendItems;
