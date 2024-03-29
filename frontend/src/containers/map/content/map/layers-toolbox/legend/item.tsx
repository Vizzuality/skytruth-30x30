import { FC, ReactElement, isValidElement, useMemo } from 'react';

import TooltipButton from '@/components/tooltip-button';
import Icon from '@/components/ui/icon';
import { parseConfig } from '@/lib/json-converter';
import EEZIcon from '@/styles/icons/eez.svg?sprite';
import MPAIcon from '@/styles/icons/mpa.svg?sprite';
import OECMIcon from '@/styles/icons/oecm.svg?sprite';
import EEZSelectedIcon from '@/styles/icons/selected-eez.svg?sprite';
import EEZMultipleIcon from '@/styles/icons/several-eez.svg?sprite';
import { LayerTyped, LegendConfig } from '@/types/layers';
export interface LegendItemsProps {
  config: LayerTyped['legend_config'];
}

const ICONS_MAPPING = {
  eez: EEZIcon,
  'eez-selected': EEZSelectedIcon,
  'eez-multiple': EEZMultipleIcon,
  oecm: OECMIcon,
  mpa: MPAIcon,
};

const LegendItem: FC<LegendItemsProps> = ({ config }) => {
  const { type, items } = config;

  const LEGEND_ITEM_COMPONENT = useMemo(() => {
    const l = parseConfig<LegendConfig | ReactElement | null>({
      config,
      params_config: [],
      settings: {},
    });

    if (!l) return null;

    if (isValidElement(l)) {
      return l;
    }

    return null;
  }, [config]);

  switch (type) {
    case 'basic':
      return (
        <ul className="flex w-full flex-col space-y-1">
          {items.map(({ value, color, description }) => (
            <li key={`${value}`} className="flex items-center space-x-2 p-1 text-xs">
              <div
                className={'h-6 w-6 flex-shrink-0 rounded-full'}
                style={{
                  backgroundColor: color,
                }}
              />
              <span className="flex">
                <span className="font-mono">{value}</span>
                {description && <TooltipButton className="-my-1" text={description} />}
              </span>
            </li>
          ))}
        </ul>
      );

    case 'icon':
      return (
        <ul className="flex w-full flex-col space-y-1">
          {items.map(({ value, icon, description }) => (
            <li key={`${value}`} className="flex space-x-2 p-1">
              <span className="h-7 w-7">
                <Icon icon={ICONS_MAPPING[icon]} className="h-7 w-7" />
              </span>
              <span className="flex items-center text-xs">
                <span className="font-mono">{value}</span>
                {description && <TooltipButton className="-my-1" text={description} />}
              </span>
            </li>
          ))}
        </ul>
      );

    case 'choropleth':
      return (
        <>
          <ul className="flex w-full">
            {items.map(({ color }) => (
              <li
                key={`${color}`}
                className="h-2 flex-shrink-0"
                style={{
                  width: `${100 / items.length}%`,
                  backgroundColor: color,
                }}
              />
            ))}
          </ul>

          <ul className="mt-1 flex w-full">
            {items.map(({ value }) => (
              <li
                key={`${value}`}
                className="flex-shrink-0 text-center text-xs"
                style={{
                  width: `${100 / items.length}%`,
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
              backgroundImage: `linear-gradient(to right, ${items.map((i) => i.color).join(',')})`,
            }}
          />

          <ul className="mt-1 flex w-full justify-between">
            {items
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
      return LEGEND_ITEM_COMPONENT;
  }
};

export default LegendItem;
