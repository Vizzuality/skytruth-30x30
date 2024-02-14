import { useCallback } from 'react';

import { useAtom } from 'jotai';
import { LuChevronLeft } from 'react-icons/lu';

import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { modellingAtom, sidebarAtom } from '@/containers/map/store';
import { cn } from '@/lib/classnames';

import { useSyncMapContentSettings } from '../sync-settings';

import Details from './details';
import Modelling from './modelling';

const MapSidebar: React.FC = () => {
  const [isSidebarOpen, setSidebarOpen] = useAtom(sidebarAtom);
  const [{ active: isModellingActive }, setModellingActive] = useAtom(modellingAtom);
  const [{ showDetails }] = useSyncMapContentSettings();

  const onClickModelling = useCallback(() => {
    setModellingActive((prevState) => ({
      ...prevState,
      active: true,
    }));
  }, [setModellingActive]);

  const modellingFeatureActive = process.env.NEXT_PUBLIC_FEATURE_FLAG_ANALYSIS === 'true';
  const showModellingButton = modellingFeatureActive && !isModellingActive && !showDetails;
  const showModellingSidebar = modellingFeatureActive && isModellingActive;
  const showDetailsSidebar = !showModellingSidebar;

  return (
    <Collapsible
      className="h-full overflow-hidden"
      open={isSidebarOpen}
      onOpenChange={setSidebarOpen}
    >
      {showModellingButton && (
        <Button
          type="button"
          variant="white"
          className={cn(
            'absolute top-0 z-10 flex h-10 items-center space-x-2 border-l-0 border-t-0 px-6 py-3 font-mono text-xs',
            {
              'hidden md:flex': true,
              'left-0': !isSidebarOpen,
              'left-[460px] transition-[left] delay-500': isSidebarOpen,
            }
          )}
          onClick={onClickModelling}
        >
          <span>Marine Conservation Modelling</span>
        </Button>
      )}
      <CollapsibleTrigger asChild>
        <Button
          type="button"
          variant="white"
          className={cn('absolute bottom-0 z-10 h-12 border-l-0 px-1 !py-3', {
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
        {showModellingSidebar && <Modelling />}
        {showDetailsSidebar && <Details />}
      </CollapsibleContent>
    </Collapsible>
  );
};

export default MapSidebar;
