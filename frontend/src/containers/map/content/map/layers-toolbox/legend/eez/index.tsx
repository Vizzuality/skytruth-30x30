import { useLocale, useTranslations } from 'next-intl';

import Icon from '@/components/ui/icon';
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import EEZIcon from '@/styles/icons/eez.svg';
import InfoIcon from '@/styles/icons/info.svg';
import SelectedEEZIcon from '@/styles/icons/selected-eez.svg';
import SeveralEEZIcon from '@/styles/icons/several-eez.svg';
import { FCWithMessages } from '@/types';
import { useGetDataInfos } from '@/types/generated/data-info';

const ITEM_LIST_CLASSES = 'flex items-center space-x-2';
const ICON_CLASSES = 'h-3.5 w-3.5';

const EEZLayerLegend: FCWithMessages = () => {
  const t = useTranslations('containers.map');
  const locale = useLocale();

  const EEZInfoQuery = useGetDataInfos(
    {
      locale,
      filters: {
        slug: 'eez-legend',
      },
    },
    {
      query: {
        select: ({ data }) => data?.[0].attributes,
      },
    }
  );

  return (
    <ul className="space-y-3 font-mono text-xs">
      <li className={ITEM_LIST_CLASSES}>
        <Icon icon={EEZIcon} className={ICON_CLASSES} />
        <span>{t('eezs')}</span>
      </li>
      <li className={ITEM_LIST_CLASSES}>
        <Icon icon={SelectedEEZIcon} className={ICON_CLASSES} />
        <span>{t('selected-eez')}</span>
      </li>
      <li className={ITEM_LIST_CLASSES}>
        <Icon icon={SeveralEEZIcon} className={ICON_CLASSES} />
        <div className="max-w-[195px] space-x-1">
          <span>
            {t.rich('area-corresponding-to-more-than-1-eez', {
              br: () => <br />,
            })}
          </span>
          <TooltipProvider skipDelayDuration={0} delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button type="button" className="translate-y-[4px]">
                  <Icon icon={InfoIcon} className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <div className="max-w-[235px] p-4">{EEZInfoQuery.data?.content}</div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </li>
    </ul>
  );
};

EEZLayerLegend.messages = ['containers.map'];

export default EEZLayerLegend;
