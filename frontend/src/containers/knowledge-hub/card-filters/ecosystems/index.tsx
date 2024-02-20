import { useAtom } from 'jotai';

import FiltersButton from '@/components/filters-button';
import { cardFiltersAtom } from '@/containers/knowledge-hub/store';
import { useGetDataToolEcosystems } from '@/types/generated/data-tool-ecosystem';

const CardFiltersEcosystems = (): JSX.Element => {
  const [, setFilters] = useAtom(cardFiltersAtom);

  const ecosystemsQuery = useGetDataToolEcosystems(
    {},
    {
      query: {
        select: ({ data }) => data.map(({ attributes }) => attributes.name),
      },
    }
  );

  const options =
    ecosystemsQuery?.data?.map((ecosystem) => ({ name: ecosystem, value: ecosystem })) || [];
  const values = ecosystemsQuery?.data || [];

  const handleFiltersChange = (field, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [field]: value,
    }));
  };

  return (
    <div className="flex items-center font-mono text-xs font-semibold">
      <FiltersButton
        field="ecosystem"
        options={options}
        values={values}
        onChange={handleFiltersChange}
      />
      <span>Filter by ecosystem</span>
    </div>
  );
};

export default CardFiltersEcosystems;
