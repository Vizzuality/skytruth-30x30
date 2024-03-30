import { useAtom } from 'jotai';
import { LuChevronLeft } from 'react-icons/lu';

import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { sidebarAtom } from '@/containers/map/store';
import { cn } from '@/lib/classnames';

import Details from './details';
import Modelling from './modelling';

const SIDEBAR_COMPONENTS = {
  'progress-tracker': Details,
  'conservation-builder': Modelling,
};

type MapSidebarProps = {
  type: 'progress-tracker' | 'conservation-builder';
};

const MapSidebar: React.FC<MapSidebarProps> = ({ type }) => {
  const [isSidebarOpen, setSidebarOpen] = useAtom(sidebarAtom);

  const ContentComponent = SIDEBAR_COMPONENTS[type] || Details;

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
          className={cn('absolute bottom-0 z-10 h-10 border-l-0 px-1 !py-3', {
            'hidden md:flex': true,
            'left-0': !isSidebarOpen,
            'left-[460px] transition-[left] delay-500': isSidebarOpen,
          })}
        >
          <LuChevronLeft className={cn('h-6 w-6', { 'rotate-180': !isSidebarOpen })} aria-hidden />
          <span className="sr-only">Toggle sidebar</span>
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="relative top-0 left-0 z-20 h-full flex-shrink-0 bg-white fill-mode-none md:w-[460px]">
        <ContentComponent />
      </CollapsibleContent>
    </Collapsible>
  );
};

export default MapSidebar;
