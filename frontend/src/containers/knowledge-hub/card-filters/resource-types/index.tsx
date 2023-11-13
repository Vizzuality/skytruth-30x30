import { useCallback } from 'react';

import { useAtom } from 'jotai';

import Icon from '@/components/ui/icon';
import { cardFiltersAtom } from '@/store/knowledge-hub';
import CheckIcon from '@/styles/icons/check.svg?sprite';
import { useGetDataToolResourceTypes } from '@/types/generated/data-tool-resource-type';
import { DataToolResourceType } from 'types/generated/strapi.schemas';

const CardFiltersResourceTypes = (): JSX.Element => {
  const [filters, setFilters] = useAtom(cardFiltersAtom);

  const resourceTypesQuery = useGetDataToolResourceTypes(
    {},
    {
      query: {
        select: ({ data }) => data.map(({ attributes }) => attributes.name),
      },
    }
  );

  const onSelectResourceType = useCallback(
    (resourceType: DataToolResourceType['name']) => {
      setFilters((prevFilters) => ({
        ...prevFilters,
        resourceType: prevFilters.resourceType === resourceType ? null : resourceType,
      }));
    },
    [setFilters]
  );

  return (
    <ul className="space-y-1">
      {resourceTypesQuery.data?.map((resourceType) => (
        <li
          key={resourceType}
          className="flex cursor-pointer items-center space-x-1 text-base font-black hover:underline"
          onClick={() => onSelectResourceType(resourceType)}
        >
          {filters.resourceType === resourceType && <Icon icon={CheckIcon} className="h-3 w-3" />}
          <span>{resourceType}</span>
        </li>
      ))}
    </ul>
  );
};

export default CardFiltersResourceTypes;
