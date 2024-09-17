import { ReactElement, isValidElement, useMemo } from 'react';

import { useLocale } from 'next-intl';

import EEZLayerLegend from '@/containers/map/content/map/layers-toolbox/legend/eez';
import EstablishmentLayerLegend from '@/containers/map/content/map/layers-toolbox/legend/establishment';
import EEZLayerPopup from '@/containers/map/content/map/popup/eez';
import GenericPopup from '@/containers/map/content/map/popup/generic';
import ProtectedAreaPopup from '@/containers/map/content/map/popup/protected-area';
import RegionsPopup from '@/containers/map/content/map/popup/regions';
import { parseConfig } from '@/lib/json-converter';
import { FCWithMessages } from '@/types';
import { useGetLayersId } from '@/types/generated/layer';
import { InteractionConfig, LayerTyped } from '@/types/layers';

export interface PopupItemProps {
  id: number;
}
const PopupItem: FCWithMessages<PopupItemProps> = ({ id }) => {
  const locale = useLocale();

  const { data } = useGetLayersId(id, {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    locale,
    populate: 'metadata',
  });

  const attributes = data?.data?.attributes as LayerTyped;

  const { interaction_config, params_config } = attributes;

  const INTERACTION_COMPONENT = useMemo(() => {
    const l = parseConfig<InteractionConfig | ReactElement | null>({
      config: {
        ...interaction_config,
        layerId: id,
      },
      params_config,
      settings: {},
    });

    if (!l) return null;

    if (isValidElement(l)) {
      return l;
    }

    return null;
  }, [interaction_config, params_config, id]);

  return INTERACTION_COMPONENT;
};

PopupItem.messages = [
  // These components are used by `parseConfig`
  ...EEZLayerPopup.messages,
  ...EEZLayerLegend.messages,
  ...GenericPopup.messages,
  ...ProtectedAreaPopup.messages,
  ...RegionsPopup.messages,
  ...EstablishmentLayerLegend.messages,
];

export default PopupItem;
