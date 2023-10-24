import { useState } from 'react';

import { useAtomValue } from 'jotai';
import { ChevronLeft } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';
import { locationAtom } from '@/store/location';

import LocationSelector from './location-selector';
import Widgets from './widgets';

const DataToolSidebar: React.FC = () => {
  const location = useAtomValue(locationAtom);

  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <Collapsible
      className="h-full overflow-hidden"
      open={sidebarOpen}
      onOpenChange={setSidebarOpen}
    >
      <CollapsibleTrigger asChild>
        <Button
          type="button"
          size="icon"
          className={cn('absolute bottom-3 z-10', {
            'hidden md:flex': true,
            'left-0': !sidebarOpen,
            'left-[430px] transition-[left] delay-500': sidebarOpen,
          })}
        >
          <ChevronLeft className={cn('h-6 w-6', { 'rotate-180': !sidebarOpen })} aria-hidden />
          <span className="sr-only">Toggle sidebar</span>
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="relative top-0 left-0 z-20 h-full flex-shrink-0 bg-white fill-mode-none data-[state=closed]:animate-out-absolute data-[state=open]:animate-in-absolute data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left md:w-[430px]">
        <div className="h-full w-full overflow-y-scroll">
          <div className="border-b border-black px-4 pt-4 pb-2 md:px-8">
            <h1 className="text-5xl font-black">{location.name}</h1>
            <LocationSelector className="my-2" />
          </div>
          <div className="h-full">
            <Widgets />
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default DataToolSidebar;
