import { ReactElement, isValidElement, useMemo } from 'react';

import { useLocale } from 'next-intl';

import BoundariesPopup from '@/containers/map/content/map/popup/boundaries';
import GenericPopup from '@/containers/map/content/map/popup/generic';
import ProtectedAreaPopup from '@/containers/map/content/map/popup/protected-area';
import useResolvedConfig from '@/hooks/use-resolved-config';
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

  const configParams = useMemo(
    () => ({
      config: {
        ...interaction_config,
        layerId: id,
      },
      params_config,
      settings: {},
    }),
    [id, interaction_config, params_config]
  );

  const parsedConfig = useResolvedConfig<InteractionConfig | ReactElement>(configParams);

  const INTERACTION_COMPONENT = useMemo(() => {
    if (!parsedConfig) return null;

    if (isValidElement(parsedConfig)) {
      return parsedConfig;
    }

    return null;
  }, [parsedConfig]);

  return INTERACTION_COMPONENT;
};

PopupItem.messages = [
  // These components are used by `parseConfig`
  ...GenericPopup.messages,
  ...ProtectedAreaPopup.messages,
  ...BoundariesPopup.messages,
];

export default PopupItem;
