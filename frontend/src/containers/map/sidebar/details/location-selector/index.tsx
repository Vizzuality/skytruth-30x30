import { useCallback, useMemo, useState } from 'react';

import { useRouter } from 'next/router';

import { useSetAtom } from 'jotai';

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { PAGES } from '@/constants/pages';
import { bboxLocation, popupAtom } from '@/containers/map/store';
import { cn } from '@/lib/classnames';
import { useGetLocations } from '@/types/generated/location';
import { LocationGroupsDataItemAttributes } from '@/types/generated/strapi.schemas';

import { useMapSearchParams } from '../../../content/map/sync-settings';

import LocationDropdown from './location-dropdown';
import LocationTypeToggle from './type-toggle';

export const FILTERS_SEARCH_LABELS = {
  all: 'Search Country or Region',
  countryHighseas: 'Search Country or Highseas',
  regions: 'Search Region',
};

export const FILTERS = {
  all: ['country', 'highseas', 'region', 'worldwide'],
  countryHighseas: ['country', 'highseas'],
  regions: ['region'],
};

type LocationSelectorProps = {
  className: HTMLDivElement['className'];
};

const LocationSelector: React.FC<LocationSelectorProps> = ({ className }) => {
  const { push } = useRouter();

  // @ts-expect-error to work properly, strict mode should be enabled
  const setLocationBBox = useSetAtom(bboxLocation);
  const setPopup = useSetAtom(popupAtom);

  const searchParams = useMapSearchParams();

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

  const handleLocationsFilterChange = (value) => {
    setLocationsFilter(value);
  };

  const handleLocationSelected = useCallback(
    async (locationCode: LocationGroupsDataItemAttributes['code']) => {
      setLocationPopoverOpen(false);
      setPopup({});

      const selectedLocation = locationsData.find(
        ({ attributes: { code } }) => code === locationCode
      );

      if (selectedLocation) {
        setLocationBBox(selectedLocation?.attributes.bounds);
        await push(`${PAGES.map}/${locationCode.toUpperCase()}?${searchParams.toString()}`);
      }
    },
    [push, searchParams, setLocationBBox, locationsData, setPopup]
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
    <div className={cn(className)}>
      <Popover open={locationPopoverOpen} onOpenChange={setLocationPopoverOpen}>
        <PopoverTrigger className="font-mono text-xs font-semibold uppercase underline ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2">
          Change Location
        </PopoverTrigger>
        <PopoverContent className="w-96 max-w-screen" align="start">
          <LocationTypeToggle
            defaultValue={locationsFilter}
            value={locationsFilter}
            className="mb-4"
            onChange={handleLocationsFilterChange}
          />
          <LocationDropdown
            searchPlaceholder={FILTERS_SEARCH_LABELS[locationsFilter]}
            locations={filteredLocations}
            onSelected={handleLocationSelected}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default LocationSelector;
