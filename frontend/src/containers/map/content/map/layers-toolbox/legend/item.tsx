import { ReactElement, isValidElement, useMemo } from 'react';

import TooltipButton from '@/components/tooltip-button';
import Icon from '@/components/ui/icon';
import BoundariesPopup from '@/containers/map/content/map/popup/boundaries';
import GenericPopup from '@/containers/map/content/map/popup/generic';
import ProtectedAreaPopup from '@/containers/map/content/map/popup/protected-area';
import useConfig from '@/hooks/use-config';
import { cn } from '@/lib/classnames';
import CircleWithDottedRedStrokeIcon from '@/styles/icons/circle-with-dotted-red-stroke.svg';
import CircleWithFillIcon from '@/styles/icons/circle-with-fill.svg';
import CircleWithoutFillIcon from '@/styles/icons/circle-without-fill.svg';
import EstablishmentDesignatedIcon from '@/styles/icons/designated.svg';
import EstablishmentImplementedIcon from '@/styles/icons/implemented.svg';
import EstablishmentManagedIcon from '@/styles/icons/managed.svg';
import EstablishmentProposedIcon from '@/styles/icons/proposed.svg';
import { FCWithMessages } from '@/types';
import { LayerTyped, LegendConfig } from '@/types/layers';

export interface LegendItemsProps {
  config: LayerTyped['legend_config'];
}

const ICONS_MAPPING = {
  'circle-with-fill': CircleWithFillIcon,
  'circle-without-fill': CircleWithoutFillIcon,
  'circle-with-dotted-red-stroke': CircleWithDottedRedStrokeIcon,
  'establishment-proposed': EstablishmentProposedIcon,
  'establishment-managed': EstablishmentManagedIcon,
  'establishment-designated': EstablishmentDesignatedIcon,
  'establishment-implemented': EstablishmentImplementedIcon,
};

const LegendItem: FCWithMessages<LegendItemsProps> = ({ config }) => {
  const { type, items } = config || {};

  const configParams = useMemo(
    () => ({
      config,
      params_config: [],
      settings: {},
    }),
    [config]
  );

  const parsedConfig = useConfig<LegendConfig | ReactElement>(configParams);

  const LEGEND_ITEM_COMPONENT = useMemo(() => {
    if (!parsedConfig) return null;

    if (isValidElement(parsedConfig)) {
      return parsedConfig;
    }

    return null;
  }, [parsedConfig]);

  switch (type) {
    case 'basic':
      return (
        <ul className="flex w-full flex-col">
          {items.map(({ value, color, description }) => (
            <li key={`${value}`} className="flex items-start space-x-2 p-1 text-xs">
              <div
                className={'h-[18px] w-[18px] shrink-0 rounded-full'}
                style={{
                  backgroundColor: color,
                }}
              />
              <span className="text-xs">
                <span className="font-mono">{value}</span>
                {description && <TooltipButton className="align-bottom" text={description} />}
              </span>
            </li>
          ))}
        </ul>
      );

    case 'icon':
      return (
        <ul className="flex w-full flex-col">
          {items.map(({ value, icon, description, color }) => (
            <li key={`${value}`} className="flex items-start space-x-2 p-1">
              <span className="h-[18px] w-[18px] shrink-0">
                <Icon
                  icon={ICONS_MAPPING[icon]}
                  className={cn({
                    'h-full w-full': true,
                    'rounded-full border border-black': icon.startsWith('establishment'),
                  })}
                  style={color ? { color } : undefined}
                />
              </span>
              <span className="text-xs">
                <span className="font-mono">{value}</span>
                {description && <TooltipButton className="align-bottom" text={description} />}
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

LegendItem.messages = [
  // Imported by `parseConfig`
  ...GenericPopup.messages,
  ...ProtectedAreaPopup.messages,
  ...BoundariesPopup.messages,
];

export default LegendItem;
