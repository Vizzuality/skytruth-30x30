import { useAtomValue } from 'jotai';

import { cardFiltersAtom } from '@/containers/knowledge-hub/store';
import { useGetDataToolsInfinite } from '@/types/generated/data-tool';

import CardItem from './card-item';

const CardList = (): JSX.Element => {
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
          data_tool_resource_type: {
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
      'pagination[pageSize]': 3,
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
      <ul className="grid-cols:1 my-4 grid gap-10 md:grid-cols-3">
        {dataToolsQuery.data?.pages?.map((page) => {
          return page?.data?.map((dataTool) => (
            <li key={dataTool.id}>
              <CardItem data={dataTool} />
            </li>
          ));
        })}
      </ul>
      <div className="flex justify-center">
        {dataToolsQuery.hasNextPage && (
          <button
            type="button"
            className="font-mono text-xs uppercase underline"
            onClick={() => dataToolsQuery.fetchNextPage()}
          >
            Load more
          </button>
        )}
      </div>
    </div>
  );
};

export default CardList;
