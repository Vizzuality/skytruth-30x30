import { useCallback } from 'react';

import { useRouter } from 'next/router';

import { useQueryClient } from '@tanstack/react-query';
import { useAtom } from 'jotai';
import { LuChevronLeft, LuChevronRight } from 'react-icons/lu';

import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { sidebarAtom, drawStateAtom } from '@/containers/map/store';
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
  const [{ active: isDrawingActive }, setDrawState] = useAtom(drawStateAtom);

  const onClickDrawing = useCallback(() => {
    setDrawState((prevState) => ({
      ...prevState,
      active: true,
    }));
  }, [setDrawState]);

  return (
    <Collapsible
      className="h-full overflow-hidden"
      open={isSidebarOpen}
      onOpenChange={setSidebarOpen}
    >
      {process.env.NEXT_PUBLIC_FEATURE_FLAG_ANALYSIS === 'true' && !isDrawingActive && (
        <Button
          type="button"
          variant="white"
          className={cn(
            'absolute top-0 z-10 flex h-12 items-center space-x-2 border-l-0 border-t-0 px-6 py-3 font-mono text-xs',
            {
              'hidden md:flex': true,
              'left-0': !isSidebarOpen,
              'left-[430px] transition-[left] delay-500': isSidebarOpen,
            }
          )}
          onClick={onClickDrawing}
        >
          <span>Marine Conservation Modelling</span>
          <LuChevronRight className="h-6 w-6 -translate-y-[1px]" />
        </Button>
      )}
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
          <LuChevronLeft className={cn('h-6 w-6', { 'rotate-180': !isSidebarOpen })} aria-hidden />
          <span className="sr-only">Toggle sidebar</span>
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="relative z-20 h-full flex-shrink-0 bg-white fill-mode-none md:w-[430px]">
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
