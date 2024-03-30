import { useAtom } from 'jotai';
import { LuChevronLeft } from 'react-icons/lu';

import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { sidebarAtom, layersAtom } from '@/containers/map/store';
import { cn } from '@/lib/classnames';

import Details from './details';
import Layers from './layers';
import Modelling from './modelling';

const SIDEBAR_TYPES = {
  progress_tracker: 'progress-tracker',
  conservation_builder: 'conservation-builder',
};

const SIDEBAR_COMPONENTS = {
  [SIDEBAR_TYPES.progress_tracker]: Details,
  [SIDEBAR_TYPES.conservation_builder]: Modelling,
};

type MapSidebarProps = {
  type: keyof typeof SIDEBAR_TYPES;
};

const MapSidebar: React.FC<MapSidebarProps> = ({ type }) => {
  const [isSidebarOpen, setSidebarOpen] = useAtom(sidebarAtom);
  const [isLayersOpen, setLayersOpen] = useAtom(layersAtom);

  const ContentComponent = SIDEBAR_COMPONENTS[type] || Details;

  return (
    <div className="relative z-20 flex h-full bg-white">
      <div className={cn('relative', { 'border-r border-black': isSidebarOpen })}>
        <Collapsible
          className="h-full overflow-hidden"
          open={isSidebarOpen}
          onOpenChange={setSidebarOpen}
        >
          <CollapsibleTrigger asChild>
            <Button
              type="button"
              variant="white"
              className={cn('absolute bottom-0 z-10 ml-px h-10 border-l-0 px-1 !py-3', {
                'hidden md:flex': true,
                'left-0': !isSidebarOpen,
                'left-full': isSidebarOpen,
              })}
            >
              <LuChevronLeft
                className={cn('h-6 w-6', { 'rotate-180': !isSidebarOpen })}
                aria-hidden
              />
              <span className="sr-only">Toggle sidebar</span>
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="left-00 relative top-0 h-full flex-shrink-0 bg-white fill-mode-none data-[state=closed]:animate-collapsible-left data-[state=open]:animate-collapsible-right">
            <div className="h-full md:w-[460px]">
              <ContentComponent />
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
      <div className={cn('relative', { 'border-r border-black': isLayersOpen })}>
        <Collapsible
          className="h-full overflow-hidden"
          open={isLayersOpen}
          onOpenChange={setLayersOpen}
        >
          <CollapsibleTrigger asChild>
            <Button
              type="button"
              variant="white"
              className={cn('z-1 absolute bottom-0 z-10 ml-px h-10 border-l-0 px-1 !py-3', {
                'hidden md:flex': true,
                'left-0': !isLayersOpen,
                'left-full': isLayersOpen,
              })}
            >
              <LuChevronLeft
                className={cn('h-6 w-6', { 'rotate-180': !isLayersOpen })}
                aria-hidden
              />
              <span className="sr-only">Toggle layers</span>
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="relative top-0 left-0 h-full flex-shrink-0 bg-white fill-mode-none data-[state=closed]:animate-collapsible-left data-[state=open]:animate-collapsible-right">
            <div className="h-full md:w-[280px]">
              <Layers />
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
};

export default MapSidebar;
