import { useCallback } from 'react';

import { useAtom } from 'jotai';
import { useResetAtom } from 'jotai/utils';

import Icon from '@/components/ui/icon';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cardFiltersAtom } from '@/containers/knowledge-hub/store';
import ArrowDown from '@/styles/icons/triangle-down.svg?sprite';
import ArrowUp from '@/styles/icons/triangle-up.svg?sprite';

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
          <button
            type="button"
            className="flex items-center space-x-2 font-mono text-xs"
            onClick={handleSortByName}
          >
            <span>Name</span>
            {/* {!filters.name && (
              <div className="flex flex-col justify-center">
                <Icon icon={ArrowUp} className="h-2 w-2" />
                <Icon icon={ArrowDown} className="h-2 w-2" />
              </div>
            )} */}
            {filters.name === 'name:asc' && <Icon icon={ArrowUp} className="h-2 w-2" />}
            {filters.name === 'name:desc' && <Icon icon={ArrowDown} className="h-2 w-2" />}
          </button>
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
