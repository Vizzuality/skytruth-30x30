import { useCallback, useMemo, useState } from 'react';

import { useRouter } from 'next/router';

import { useSetAtom } from 'jotai';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { popupAtom } from '@/containers/map/store';
import { cn } from '@/lib/classnames';
import GlobeIcon from '@/styles/icons/globe.svg';
import MagnifyingGlassIcon from '@/styles/icons/magnifying-glass.svg';
import { FCWithMessages } from '@/types';
import { useGetLocations } from '@/types/generated/location';
import { LocationGroupsDataItemAttributes } from '@/types/generated/strapi.schemas';

import LocationDropdown from './location-dropdown';
import LocationTypeToggle from './type-toggle';

export const FILTERS = {
  all: ['country', 'highseas', 'region', 'worldwide'],
  countryHighseas: ['country', 'highseas'],
  regions: ['region'],
};

const BUTTON_CLASSES =
  'font-mono text-xs px-0 font-semibold no-underline normal-case ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2';

type LocationSelectorProps = {
  className?: HTMLDivElement['className'];
  theme: 'orange' | 'blue';
  onChange: (locationCode: string) => void;
};

const LocationSelector: FCWithMessages<LocationSelectorProps> = ({
  className,
  theme,
  onChange,
}) => {
  const t = useTranslations('containers.map-sidebar-main-panel');

  const {
    query: { locationCode = 'GLOB' },
  } = useRouter();

  const setPopup = useSetAtom(popupAtom);

  const [locationsFilter, setLocationsFilter] = useState<keyof typeof FILTERS>('all');
  const [locationPopoverOpen, setLocationPopoverOpen] = useState(false);

  const { data: locationsData } = useGetLocations(
    {
      'pagination[limit]': -1,
      sort: 'name:asc',
    },
    {
      query: {
        placeholderData: { data: [] },
        select: ({ data }) => data,
      },
    }
  );

  const filtersSearchLabels = useMemo(
    () => ({
      all: t('search-country-region'),
      countryHighseas: t('search-country-high-seas'),
      regions: t('search-region'),
    }),
    [t]
  );

  const handleLocationsFilterChange = (value) => {
    setLocationsFilter(value);
  };

  const handleLocationSelected = useCallback(
    async (locationCode: LocationGroupsDataItemAttributes['code']) => {
      setLocationPopoverOpen(false);
      setPopup({});
      onChange(locationCode.toUpperCase());
    },
    [setPopup, onChange]
  );

  const reorderedLocations = useMemo(() => {
    const globalLocation = locationsData.find(({ attributes }) => attributes.type === 'worldwide');
    return [globalLocation, ...locationsData.filter(({ id }) => id !== globalLocation.id)].filter(
      Boolean
    );
  }, [locationsData]);

  const filteredLocations = useMemo(() => {
    if (!locationsFilter) return reorderedLocations;

    return reorderedLocations.filter(({ attributes }) =>
      FILTERS[locationsFilter].includes(attributes.type)
    );
  }, [locationsFilter, reorderedLocations]);

  return (
    <div className={cn('flex gap-3.5', className)}>
      <Popover open={locationPopoverOpen} onOpenChange={setLocationPopoverOpen}>
        <PopoverTrigger asChild>
          <Button className={BUTTON_CLASSES} type="button" variant="text-link">
            <Icon icon={MagnifyingGlassIcon} className="mr-2 h-4 w-4 pb-px" />
            {t('change-location')}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-96 max-w-screen" align="start">
          <LocationTypeToggle
            theme={theme}
            defaultValue={locationsFilter}
            value={locationsFilter}
            className="mb-4"
            onChange={handleLocationsFilterChange}
          />
          <LocationDropdown
            searchPlaceholder={filtersSearchLabels[locationsFilter]}
            locations={filteredLocations}
            onSelected={handleLocationSelected}
          />
        </PopoverContent>
      </Popover>
      {locationCode !== 'GLOB' && (
        <Button
          className={BUTTON_CLASSES}
          type="button"
          variant="text-link"
          onClick={() => handleLocationSelected('GLOB')}
        >
          <Icon icon={GlobeIcon} className="mr-2 h-4 w-4 pb-px" />
          {t('global-view')}
        </Button>
      )}
    </div>
  );
};

LocationSelector.messages = [
  'containers.map-sidebar-main-panel',
  ...LocationTypeToggle.messages,
  ...LocationDropdown.messages,
];

export default LocationSelector;
