import { useState } from 'react';

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@radix-ui/react-collapsible';
import { ChevronDown } from 'lucide-react';

import Icon from '@/components/ui/icon';
import LegendIcon from '@/styles/icons/layers.svg?sprite';

import LayersLegend from './legend';

const LayersToolbox: React.FC = () => {
  const [open, setOpen] = useState(true);

  return (
    <div className="bg-red absolute bottom-0 right-0 z-20">
      <div className="relative">
        <Collapsible className="bg-red relative" open={open} onOpenChange={setOpen}>
          <CollapsibleTrigger className="absolute top-0 right-0 -translate-y-full border border-b-0 border-black bg-white">
            {open && <ChevronDown className="mx-3 my-px h-6 w-6" />}
            {!open && (
              <span className="flex gap-3 py-2.5 pl-3 pr-4 font-mono text-xs">
                <Icon icon={LegendIcon} className="ml-0.5 h-4 w-4 pb-px" />
                <span>Legend</span>
              </span>
            )}
          </CollapsibleTrigger>
          <CollapsibleContent className="relative h-[180px] w-[300px] border-l border-t border-black bg-white fill-mode-none data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
            <div className="h-full w-full overflow-y-scroll border">
              <LayersLegend />
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
};

export default LayersToolbox;
