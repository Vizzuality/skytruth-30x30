import { useState } from 'react';

import { ChevronLeft } from 'lucide-react';

import Map from '@/components/map';
import SidebarContent from '@/components/sidebar-content';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import FullscreenLayout from '@/layouts/fullscreen';
import { cn } from '@/lib/utils';

const MapPage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <FullscreenLayout title="Map">
      <div className="relative flex h-full w-full flex-col md:flex-row">
        <Collapsible open={sidebarOpen} onOpenChange={setSidebarOpen} className="hidden md:block">
          <CollapsibleTrigger asChild>
            <Button
              type="button"
              size="icon"
              className={cn('absolute bottom-3 z-10', {
                'left-0': !sidebarOpen,
                'left-[430px] transition-[left] delay-500': sidebarOpen,
              })}
            >
              <ChevronLeft className={cn('h-6 w-6', { 'rotate-180': !sidebarOpen })} aria-hidden />
              <span className="sr-only">Toggle sidebar</span>
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="relative top-0 left-0 z-20 h-full w-[430px] flex-shrink-0 bg-white p-8 pb-3 fill-mode-none data-[state=closed]:animate-out-absolute data-[state=open]:animate-in-absolute data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left">
            <SidebarContent />
          </CollapsibleContent>
        </Collapsible>
        <Map />
        <div className="h-2/3 flex-shrink-0 bg-white p-6 pb-3 md:hidden">
          <SidebarContent />
        </div>
      </div>
    </FullscreenLayout>
  );
};

export default MapPage;
