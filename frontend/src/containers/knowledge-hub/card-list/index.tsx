import { useAtomValue } from 'jotai';
import { useTranslations } from 'next-intl';

import { cardFiltersAtom } from '@/containers/knowledge-hub/store';
import { FCWithMessages } from '@/types';
import { useGetDataToolsInfinite } from '@/types/generated/data-tool';

import CardItem from './card-item';

const CardList: FCWithMessages = (): JSX.Element => {
  const t = useTranslations('containers.knowledge-hub-card-filters');

  const filters = useAtomValue(cardFiltersAtom);

  const dataToolsQuery = useGetDataToolsInfinite(
    {
      sort: filters.name,
      filters: {
        ...(filters.language && {
          languages: {
            name: filters.language,
          },
        }),
        ...(filters.resourceType && {
          data_tool_resource_types: {
            name: filters.resourceType,
          },
        }),
        ...(filters.ecosystem && {
          data_tool_ecosystems: {
            name: filters.ecosystem,
          },
        }),
      },
      populate: '*',
      'pagination[pageSize]': 9,
    },
    {
      query: {
        getNextPageParam: (lastPage) => {
          if (lastPage.meta.pagination.page < lastPage.meta.pagination.pageCount) {
            return lastPage.meta.pagination.page + 1;
          }
          return false;
        },
      },
    }
  );

  return (
    <div className="min-h-[225px] space-y-8">
      <ul className="grid gap-10 md:grid-cols-3">
        {dataToolsQuery.data?.pages?.map((page) => {
          return page?.data?.map((dataTool) => (
            <li key={dataTool.id}>
              <CardItem data={dataTool} />
            </li>
          ));
        })}
      </ul>
      {dataToolsQuery.hasNextPage && (
        <div className="flex justify-center">
          <button
            type="button"
            className="font-mono text-xs uppercase underline"
            onClick={() => dataToolsQuery.fetchNextPage()}
          >
            {t('load-more')}
          </button>
        </div>
      )}
    </div>
  );
};

CardList.messages = ['containers.knowledge-hub-card-filters', ...CardItem.messages];

export default CardList;
