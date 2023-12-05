import { useCallback } from 'react';

import { VariantProps, cva } from 'class-variance-authority';
import { useAtom } from 'jotai';
import { LuChevronLeft, LuChevronRight } from 'react-icons/lu';

import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { analysisAtom, sidebarAtom } from '@/containers/map/store';
import { cn } from '@/lib/classnames';

import { useSyncMapContentSettings } from '../sync-settings';

import Analysis from './analysis';
import Details from './details';

const mapSidebarVariants = cva('', {
  variants: {
    layout: {
      desktop:
        'absolute data-[state=closed]:animate-out-absolute data-[state=open]:animate-in-absolute data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left',
      mobile: 'relative',
    },
  },
  defaultVariants: {
    layout: 'desktop',
  },
});

type MapSideBarProps = VariantProps<typeof mapSidebarVariants>;

const MapSidebar: React.FC<MapSideBarProps> = ({ layout }) => {
  const [isSidebarOpen, setSidebarOpen] = useAtom(sidebarAtom);
  const [{ active: isAnalysisActive }, setAnalysisActive] = useAtom(analysisAtom);
  const [{ showDetails }] = useSyncMapContentSettings();

  const onClickAnalysis = useCallback(() => {
    setAnalysisActive((prevState) => ({
      ...prevState,
      active: true,
    }));
  }, [setAnalysisActive]);

  const analysisFeatureActive = process.env.NEXT_PUBLIC_FEATURE_FLAG_ANALYSIS === 'true';
  const showAnalysisButton = analysisFeatureActive && !isAnalysisActive && !showDetails;
  const showAnalysisSidebar = analysisFeatureActive && isAnalysisActive;
  const showDetailsSidebar = !showAnalysisSidebar;

  return (
    <Collapsible
      className="h-full overflow-hidden"
      open={isSidebarOpen}
      onOpenChange={setSidebarOpen}
    >
      {showAnalysisButton && (
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
          onClick={onClickAnalysis}
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
      <CollapsibleContent
        className={cn(
          'top-0 left-0 z-20 h-full flex-shrink-0 bg-white fill-mode-none md:w-[430px]',
          mapSidebarVariants({ layout })
        )}
      >
        {showAnalysisSidebar && <Analysis />}
        {showDetailsSidebar && <Details />}
      </CollapsibleContent>
    </Collapsible>
  );
};

export default MapSidebar;
