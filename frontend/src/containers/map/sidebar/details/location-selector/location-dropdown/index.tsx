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
import { useGetLocations } from '@/types/generated/location';
import { LocationListResponseDataItem } from '@/types/generated/strapi.schemas';

type LocationDropdownProps = {
  className?: HTMLDivElement['className'];
  searchPlaceholder?: string;
  locations: LocationListResponseDataItem[];
  onSelected: (code: string) => void;
};

const LocationDropdown: React.FC<LocationDropdownProps> = ({
  className,
  searchPlaceholder = 'Search',
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
      <CommandInput placeholder={searchPlaceholder} />
      <CommandEmpty>No result</CommandEmpty>
      <CommandGroup className="mt-4 max-h-64 overflow-y-auto">
        {locations.map(({ attributes }) => {
          const { name, code, type } = attributes;

          return (
            <CommandItem key={code} value={name} onSelect={() => onSelected(code)}>
              <div className="flex w-full cursor-pointer justify-between gap-x-4">
                <div className="flex text-base font-bold">
                  {locationsQuery.data?.code === code && (
                    <Check className="relative top-1 mr-1 inline-block h-4 w-4 flex-shrink-0" />
                  )}
                  {name}
                </div>
                <span className="flex-shrink-0 font-mono text-xs capitalize text-gray-300">
                  {type}
                </span>
              </div>
            </CommandItem>
          );
        })}
      </CommandGroup>
    </Command>
  );
};

export default LocationDropdown;
