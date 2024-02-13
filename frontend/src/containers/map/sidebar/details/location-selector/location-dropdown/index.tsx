import { useRouter } from 'next/router';

import { Check } from 'lucide-react';

import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandEmpty,
} from '@/components/ui/command';
import { cn } from '@/lib/classnames';
import { LocationListResponseDataItem } from '@/types/generated/strapi.schemas';
import { useGetLocations } from '@/types/generated/location';

type LocationDropdownProps = {
  className?: HTMLDivElement['className'];
  locations: LocationListResponseDataItem[];
  onSelected: (code: string) => void;
};

const LocationDropdown: React.FC<LocationDropdownProps> = ({
  className,
  locations,
  onSelected,
}) => {
  const {
    query: { locationCode },
  } = useRouter();

  const locationsQuery = useGetLocations(
    {
      filters: {
        code: locationCode,
      },
    },
    {
      query: {
        queryKey: ['locations', locationCode],
        select: ({ data }) => data?.[0]?.attributes,
      },
    }
  );

  return (
    <Command label="Search country or region" className={cn(className)}>
      <CommandInput placeholder="Search country or region" />
      <CommandEmpty>No result</CommandEmpty>
      <CommandGroup className="mt-4 max-h-64 overflow-y-auto">
        {locations.map(({ attributes }) => {
          const { name, code, type } = attributes;

          return (
            <CommandItem key={code} value={name} onSelect={() => onSelected(code)}>
              <div className="flex w-full cursor-pointer justify-between gap-x-4">
                <div className="flex font-bold underline">
                  <Check
                    className={cn(
                      'relative top-1 mr-2 inline-block h-4 w-4 flex-shrink-0',
                      locationsQuery.data?.code === code ? 'opacity-100' : 'opacity-0'
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
  );
};

export default LocationDropdown;
