import { useAtom } from 'jotai';
import { useTranslations } from 'use-intl';

import FiltersButton from '@/components/filters-button';
import { cardFiltersAtom } from '@/containers/knowledge-hub/store';
import { FCWithMessages } from '@/types';
import { useGetDataToolLanguages } from '@/types/generated/data-tool-language';

const CardFiltersLanguages: FCWithMessages = (): JSX.Element => {
  const t = useTranslations('containers.knowledge-hub-card-filters');

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
      <span>{t('filter-by-language')}</span>
    </div>
  );
};

CardFiltersLanguages.messages = [
  'containers.knowledge-hub-card-filters',
  ...FiltersButton.messages,
];

export default CardFiltersLanguages;
