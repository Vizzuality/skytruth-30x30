import { useCallback } from 'react';

import { useAtom } from 'jotai';

import Icon from '@/components/ui/icon';
import { cardFiltersAtom } from '@/store/knowledge-hub';
import CheckIcon from '@/styles/icons/check.svg?sprite';
import { useGetDataToolEcosystems } from '@/types/generated/data-tool-ecosystem';
import { DataToolEcosystem } from 'types/generated/strapi.schemas';

const CardFiltersEcosystems = (): JSX.Element => {
  const [filters, setFilters] = useAtom(cardFiltersAtom);

  const ecosystemsQuery = useGetDataToolEcosystems(
    {},
    {
      query: {
        select: ({ data }) => data.map(({ attributes }) => attributes.name),
      },
    }
  );

  const onSelectLanguage = useCallback(
    (ecosystem: DataToolEcosystem['name']) => {
      setFilters((prevFilters) => ({
        ...prevFilters,
        ecosystem: prevFilters.ecosystem === ecosystem ? null : ecosystem,
      }));
    },
    [setFilters]
  );

  return (
    <ul className="space-y-1">
      {ecosystemsQuery.data?.map((ecosystem) => (
        <li
          key={ecosystem}
          className="flex cursor-pointer items-center space-x-1 text-base font-black hover:underline"
          onClick={() => onSelectLanguage(ecosystem)}
        >
          {filters.ecosystem === ecosystem && <Icon icon={CheckIcon} className="h-3 w-3" />}
          <span>{ecosystem}</span>
        </li>
      ))}
    </ul>
  );
};

export default CardFiltersEcosystems;
