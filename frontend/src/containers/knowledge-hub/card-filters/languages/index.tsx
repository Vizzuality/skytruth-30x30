import { useAtom } from 'jotai';

import FiltersButton from '@/components/filters-button';
import { cardFiltersAtom } from '@/containers/knowledge-hub/store';
import { useGetDataToolLanguages } from '@/types/generated/data-tool-language';

const CardFiltersLanguages = (): JSX.Element => {
  const [filters, setFilters] = useAtom(cardFiltersAtom);

  const languagesQuery = useGetDataToolLanguages(
    {},
    {
      query: {
        select: ({ data }) => data.map(({ attributes }) => attributes.name),
      },
    }
  );

  const options =
    languagesQuery?.data?.map((language) => ({ name: language, value: language })) || [];

  const handleFiltersChange = (field, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [field]: value,
    }));
  };

  return (
    <div className="flex items-center font-mono text-xs font-semibold">
      <FiltersButton
        field="language"
        options={options}
        values={filters?.language}
        onChange={handleFiltersChange}
      />
      <span>Filter by language</span>
    </div>
  );
};

export default CardFiltersLanguages;
