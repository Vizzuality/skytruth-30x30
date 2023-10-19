import { useState } from 'react';

import { useRouter } from 'next/router';

import { Check } from 'lucide-react';
import { useRecoilValue } from 'recoil';

import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandEmpty,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { PAGES } from '@/constants/pages';
import { cn } from '@/lib/utils';
import { locationAtom } from '@/store/location';
import { useGetLocations } from '@/types/generated/location';

type LocationSelectorProps = {
  className: string;
};

const LocationSelector: React.FC<LocationSelectorProps> = ({ className }) => {
  const location = useRecoilValue(locationAtom);
  const router = useRouter();

  const [locationPopoverOpen, setLocationPopoverOpen] = useState(false);
  const { data: locationsData } = useGetLocations();

  const locations = locationsData?.data || [];

  const handleLocationSelected = (locationCode: string) => {
    setLocationPopoverOpen(false);
    void router.replace(`${PAGES.dataTool}/${locationCode.toUpperCase()}`);
  };

  return (
    <div className={cn(className)}>
      <Popover open={locationPopoverOpen} onOpenChange={setLocationPopoverOpen}>
        <PopoverTrigger className="text-sm font-semibold uppercase underline ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2">
          Change Location
        </PopoverTrigger>
        <PopoverContent className="w-96 max-w-screen" align="start">
          <Command label="Search country or region">
            <CommandInput placeholder="Search country or region" />
            <CommandEmpty>No result</CommandEmpty>
            <CommandGroup className="mt-4 max-h-64 overflow-y-scroll">
              {locations.map(({ attributes }) => {
                const { name, code, type } = attributes;

                return (
                  <CommandItem key={code} value={code} onSelect={handleLocationSelected}>
                    <div className="flex w-full cursor-pointer justify-between gap-x-4">
                      <div className="flex font-bold underline">
                        <Check
                          className={cn(
                            'relative top-1 mr-2 inline-block h-4 w-4 flex-shrink-0',
                            location.code === code ? 'opacity-100' : 'opacity-0'
                          )}
                        />
                        {name}
                      </div>
                      <span className="flex-shrink-0 capitalize text-gray-400">{type}</span>
                    </div>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default LocationSelector;
