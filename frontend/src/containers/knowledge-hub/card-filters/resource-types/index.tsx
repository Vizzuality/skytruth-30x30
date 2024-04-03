import { useAtom } from 'jotai';

import FiltersButton from '@/components/filters-button';
import { cardFiltersAtom } from '@/containers/knowledge-hub/store';
import { useGetDataToolResourceTypes } from '@/types/generated/data-tool-resource-type';

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

  const handleFiltersChange = (field, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [field]: value,
    }));
  };

  const options =
    resourceTypesQuery?.data?.map((resourceType) => ({
      name: resourceType,
      value: resourceType,
    })) || [];

  return (
    <div className="flex items-center font-mono text-xs font-semibold">
      <FiltersButton
        field="resourceType"
        options={options}
        values={filters?.resourceType}
        onChange={handleFiltersChange}
      />
      <span>Filter by resource type</span>
    </div>
  );
};

export default CardFiltersResourceTypes;
