import { useCallback } from 'react';

import { useAtom } from 'jotai';
import { useResetAtom } from 'jotai/utils';
import { ArrowDownNarrowWide, ArrowUpNarrowWide } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { cardFiltersAtom } from '@/containers/knowledge-hub/store';
import { FCWithMessages } from '@/types';

import CardFiltersEcosystems from './ecosystems';
import CardFiltersLanguages from './languages';
import CardFiltersResourceTypes from './resource-types';

const CardFilters: FCWithMessages = (): JSX.Element => {
  const t = useTranslations('containers.knowledge-hub-card-filters');

  const resetFiltersAtom = useResetAtom(cardFiltersAtom);
  const [filters, setFilters] = useAtom(cardFiltersAtom);

  const handleSortByName = useCallback(() => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      name: prevFilters.name === 'name:asc' ? 'name:desc' : 'name:asc',
    }));
  }, [setFilters]);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="flex items-center space-x-2"
              onClick={handleSortByName}
            >
              {filters.name === 'name:asc' && <ArrowUpNarrowWide className="h-4 w-4" aria-hidden />}
              {filters.name === 'name:desc' && (
                <ArrowDownNarrowWide className="h-4 w-4" aria-hidden />
              )}
            </button>
            <span className="font-mono text-xs font-semibold">{t('name')}</span>
          </div>
          <CardFiltersResourceTypes />
          <CardFiltersLanguages />
          <CardFiltersEcosystems />
        </div>
        <button
          type="button"
          onClick={resetFiltersAtom}
          className="font-mono text-xs uppercase underline"
        >
          {t('clear-filters')}
        </button>
      </div>
    </div>
  );
};

CardFilters.messages = [
  'containers.knowledge-hub-card-filters',
  ...CardFiltersResourceTypes.messages,
  ...CardFiltersLanguages.messages,
  ...CardFiltersEcosystems.messages,
];

export default CardFilters;
