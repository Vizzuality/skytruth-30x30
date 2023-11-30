import { ReactElement, isValidElement, useMemo } from 'react';

import { parseConfig } from '@/lib/json-converter';
import { useGetLayersId } from '@/types/generated/layer';
import { InteractionConfig, LayerTyped } from '@/types/layers';

export interface PopupItemProps {
  id: number;
}
const PopupItem = ({ id }: PopupItemProps) => {
  const { data } = useGetLayersId(id, {
    populate: 'metadata',
  });

  const attributes = data?.data?.attributes as LayerTyped;

  const { interaction_config, params_config } = attributes;

  const INTERACTION_COMPONENT = useMemo(() => {
    const l = parseConfig<InteractionConfig | ReactElement | null>({
      config: {
        ...interaction_config,
        locationId: id,
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

export default PopupItem;
