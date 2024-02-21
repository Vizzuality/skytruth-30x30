import { useCallback } from 'react';

import { useAtom } from 'jotai';
import { useResetAtom } from 'jotai/utils';
import { ArrowDownNarrowWide, ArrowUpNarrowWide } from 'lucide-react';

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cardFiltersAtom } from '@/containers/knowledge-hub/store';

import CardFiltersEcosystems from './ecosystems';
import CardFiltersLanguages from './languages';
import CardFiltersResourceTypes from './resource-types';

const CardFilters = (): JSX.Element => {
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
      <Popover>
        <PopoverTrigger asChild>
          <button
            type="button"
            className="flex items-center space-x-1 font-mono text-xs uppercase underline"
          >
            Change resource category
          </button>
        </PopoverTrigger>
        <PopoverContent>
          <CardFiltersResourceTypes />
        </PopoverContent>
      </Popover>
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
            <span className="font-mono text-xs font-semibold">Name</span>
          </div>
          <CardFiltersLanguages />
          <CardFiltersEcosystems />
        </div>
        <button
          type="button"
          onClick={resetFiltersAtom}
          className="font-mono text-xs uppercase underline"
        >
          Clear filters
        </button>
      </div>
    </div>
  );
};

export default CardFilters;
