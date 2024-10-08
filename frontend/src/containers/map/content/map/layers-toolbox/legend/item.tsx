import { ReactElement, isValidElement, useMemo } from 'react';

import TooltipButton from '@/components/tooltip-button';
import Icon from '@/components/ui/icon';
import EEZLayerLegend from '@/containers/map/content/map/layers-toolbox/legend/eez';
import EstablishmentLayerLegend from '@/containers/map/content/map/layers-toolbox/legend/establishment';
import EEZLayerPopup from '@/containers/map/content/map/popup/eez';
import GenericPopup from '@/containers/map/content/map/popup/generic';
import ProtectedAreaPopup from '@/containers/map/content/map/popup/protected-area';
import RegionsPopup from '@/containers/map/content/map/popup/regions';
import { cn } from '@/lib/classnames';
import { parseConfig } from '@/lib/json-converter';
import EstablishmentDesignatedIcon from '@/styles/icons/designated.svg';
import EEZIcon from '@/styles/icons/eez.svg';
import EstablishmentImplementedIcon from '@/styles/icons/implemented.svg';
import EstablishmentManagedIcon from '@/styles/icons/managed.svg';
import MPAIcon from '@/styles/icons/mpa.svg';
import OECMIcon from '@/styles/icons/oecm.svg';
import EstablishmentProposedIcon from '@/styles/icons/proposed.svg';
import EEZSelectedIcon from '@/styles/icons/selected-eez.svg';
import EEZMultipleIcon from '@/styles/icons/several-eez.svg';
import { FCWithMessages } from '@/types';
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
  'establishment-proposed': EstablishmentProposedIcon,
  'establishment-managed': EstablishmentManagedIcon,
  'establishment-designated': EstablishmentDesignatedIcon,
  'establishment-implemented': EstablishmentImplementedIcon,
};

const LegendItem: FCWithMessages<LegendItemsProps> = ({ config }) => {
  const { type, items } = config || {};

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
        <ul className="flex w-full flex-col">
          {items.map(({ value, color, description }) => (
            <li key={`${value}`} className="flex items-center space-x-2 p-1 text-xs">
              <div
                className={'h-3 w-3 flex-shrink-0 rounded-full'}
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
        <ul className="flex w-full flex-col">
          {items.map(({ value, icon, description }) => (
            <li key={`${value}`} className="flex items-center space-x-2 p-1">
              <span className="h-3.5 w-3.5">
                <Icon
                  icon={ICONS_MAPPING[icon]}
                  className={cn({
                    'h-3.5 w-3.5': true,
                    'rounded-full border border-black': icon.startsWith('establishment'),
                  })}
                />
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

LegendItem.messages = [
  // Imported by `parseConfig`
  ...EEZLayerPopup.messages,
  ...EEZLayerLegend.messages,
  ...GenericPopup.messages,
  ...ProtectedAreaPopup.messages,
  ...RegionsPopup.messages,
  ...EstablishmentLayerLegend.messages,
];

export default LegendItem;
