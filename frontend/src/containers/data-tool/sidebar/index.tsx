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
    <Collapsible open={sidebarOpen} onOpenChange={setSidebarOpen}>
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
      <CollapsibleContent className="relative top-0 left-0 z-20 h-full w-[430px] flex-shrink-0 bg-white py-4 fill-mode-none data-[state=closed]:animate-out-absolute data-[state=open]:animate-in-absolute data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left">
        <div className="border-b border-black px-8 py-2">
          <h1 className="text-5xl font-black">{location.name}</h1>
          <LocationSelector className="my-2" />
        </div>
        <div className="px-8 py-4">
          <Widgets />
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default DataToolSidebar;
