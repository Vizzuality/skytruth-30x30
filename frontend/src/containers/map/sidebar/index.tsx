import { useRouter } from 'next/router';

import { useQueryClient } from '@tanstack/react-query';
import { useAtom } from 'jotai';
import { ChevronLeft } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { sidebarAtom } from '@/containers/map/store';
import { cn } from '@/lib/classnames';
import { LocationGroupsDataItemAttributes } from '@/types/generated/strapi.schemas';

import { useSyncMapContentSettings } from '../sync-settings';

import DetailsButton from './details-button';
import LocationSelector from './location-selector';
import Widgets from './widgets';

const MapSidebar: React.FC = () => {
  const {
    query: { locationCode },
  } = useRouter();
  const queryClient = useQueryClient();
  const [{ showDetails }] = useSyncMapContentSettings();

  const location = queryClient.getQueryData<LocationGroupsDataItemAttributes>([
    'locations',
    locationCode,
  ]);

  const [isSidebarOpen, setSidebarOpen] = useAtom(sidebarAtom);

  return (
    <Collapsible
      className="h-full overflow-hidden"
      open={isSidebarOpen}
      onOpenChange={setSidebarOpen}
    >
      <CollapsibleTrigger asChild>
        <Button
          type="button"
          variant="white"
          className={cn('absolute bottom-0 z-10 h-12 border-l-0 px-1 !py-3', {
            'hidden md:flex': true,
            'left-0': !isSidebarOpen,
            'left-[430px] transition-[left] delay-500': isSidebarOpen,
          })}
        >
          <ChevronLeft className={cn('h-6 w-6', { 'rotate-180': !isSidebarOpen })} aria-hidden />
          <span className="sr-only">Toggle sidebar</span>
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="relative top-0 left-0 z-20 h-full flex-shrink-0 bg-white fill-mode-none data-[state=closed]:animate-out-absolute data-[state=open]:animate-in-absolute data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left md:w-[430px]">
        <div className="h-full w-full overflow-y-scroll border-x border-black pb-12">
          <div className="border-b border-black px-4 pt-4 pb-2 md:px-8">
            <h1 className="text-5xl font-black">{location?.name}</h1>
            <LocationSelector className="my-2" />
          </div>
          <Widgets />
        </div>
        <div
          className={cn('absolute bottom-0 left-px', {
            'right-px': !showDetails,
          })}
        >
          <DetailsButton />
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default MapSidebar;
