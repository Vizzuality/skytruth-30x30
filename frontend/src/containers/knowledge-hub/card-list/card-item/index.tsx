import { useTranslations } from 'next-intl';

import Icon from '@/components/ui/icon';
import ExternalLinkIcon from '@/styles/icons/external-link-square.svg';
import ListIcon from '@/styles/icons/list.svg';
import StarIcon from '@/styles/icons/star.svg';
import WorldIcon from '@/styles/icons/world.svg';
import { FCWithMessages } from '@/types';
import { DataToolListResponseDataItem } from '@/types/generated/strapi.schemas';

const CIRCLE_ICON_CLASSES =
  'flex h-7 min-h-[28px] w-7 min-w-[28px] items-center justify-center rounded-full border border-black fill-black';

const CardItem: FCWithMessages<{
  data: DataToolListResponseDataItem;
}> = ({ data }): JSX.Element => {
  const t = useTranslations('containers.knowledge-hub-card-filters');

  return (
    <div className="h-full divide-y divide-black border border-black p-5 transition-shadow hover:shadow-[4px_4px_0_0_black]">
      <div className="space-y-2">
        <h4 className="text-[20px] font-black">{data.attributes.name}</h4>
        {data.attributes.site && (
          <div className="flex items-center space-x-2">
            <Icon icon={ExternalLinkIcon} className="h-4 w-4 fill-black" />
            <a href={data.attributes.site} target="_blank" rel="noreferrer" className="underline">
              {t('website')}
            </a>
          </div>
        )}
        {data.attributes.description && (
          <p title={data.attributes.description} className="line-clamp-5">
            {data.attributes.description}
          </p>
        )}
      </div>
      <div className="mt-5 pt-5">
        <ul className="space-y-4">
          {data.attributes.data_tool_resource_types.data && (
            <li className="flex gap-4">
              <div className={CIRCLE_ICON_CLASSES}>
                <Icon icon={ListIcon} className="h-4 w-4" />
              </div>
              <div className="col-span-1">
                <h5 className="font-bold">{t('resource-category')}</h5>
                {data.attributes.data_tool_resource_types.data
                  .map(({ attributes: { name } }) => name)
                  .join(', ')}
              </div>
            </li>
          )}
          {data.attributes.geography && (
            <li className="flex gap-4">
              <div className={CIRCLE_ICON_CLASSES}>
                <Icon icon={StarIcon} className="h-4 w-4" />
              </div>
              <div className="grow">
                <h5 className="font-bold">{t('geography')}</h5>
                <span>{data.attributes.geography}</span>
              </div>
            </li>
          )}
          {data.attributes.data_tool_ecosystems.data?.length > 0 && (
            <li className="flex gap-4">
              <div className={CIRCLE_ICON_CLASSES}>
                <Icon icon={WorldIcon} className="h-4 w-4" />
              </div>
              <div className="columns-auto">
                <h5 className="font-bold ">{t('ecosystems')}</h5>
                <span>
                  {data.attributes.data_tool_ecosystems.data
                    .map(({ attributes: { name } }) => name)
                    .join(', ')}
                </span>
              </div>
            </li>
          )}
          {data.attributes.languages.data?.length > 0 && (
            <li className="flex gap-4">
              <div className={CIRCLE_ICON_CLASSES}>
                <Icon icon={WorldIcon} className="h-4 w-4" />
              </div>
              <div className="columns-auto">
                <h5 className="font-bold ">{t('languages')}</h5>
                <span>
                  {data.attributes.languages.data
                    .map(({ attributes: { name } }) => name)
                    .join(', ')}
                </span>
              </div>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

CardItem.messages = ['containers.knowledge-hub-card-filters'];

export default CardItem;
