import { useState } from 'react';

import cx from 'classnames';
import { ChevronLeft } from 'lucide-react';

import Map from '@/components/map';
import SidebarContent from '@/components/sidebar-content';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import FullscreenLayout from '@/layouts/fullscreen';

const MapPage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <FullscreenLayout title="Map">
      <div className="relative flex h-full w-full flex-col md:flex-row">
        <Collapsible open={sidebarOpen} onOpenChange={setSidebarOpen} className="hidden md:block">
          <CollapsibleTrigger asChild>
            <button
              type="button"
              className={cx(
                'absolute bottom-6 z-10 block rounded-lg rounded-l-none bg-black p-1 text-white ring-offset-white transition-colors hover:bg-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-70',
                { 'left-0': !sidebarOpen, 'left-[430px] transition-[left] delay-500': sidebarOpen }
              )}
            >
              <ChevronLeft className={cx('h-6 w-6', { 'rotate-180': !sidebarOpen })} aria-hidden />
              <span className="sr-only">Toggle sidebar</span>
            </button>
          </CollapsibleTrigger>
          <CollapsibleContent className="relative top-0 left-0 z-20 h-full w-[430px] flex-shrink-0 bg-white p-8 pb-2.5 fill-mode-none data-[state=closed]:animate-out-absolute data-[state=open]:animate-in-absolute data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left">
            <SidebarContent />
          </CollapsibleContent>
        </Collapsible>
        <Map />
        <div className="h-2/3 flex-shrink-0 bg-white p-6 pb-2.5 md:hidden">
          <SidebarContent />
        </div>
      </div>
    </FullscreenLayout>
  );
};

export default MapPage;
