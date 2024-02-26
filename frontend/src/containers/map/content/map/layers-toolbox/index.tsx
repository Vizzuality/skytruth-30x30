// import { LuChevronDown, LuChevronUp } from 'react-icons/lu';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { useSyncMapLayers } from '../sync-settings';

import LayersDropdown from './layers-list';
import Legend from './legend';

const TABS_TRIGGER_CLASSES =
  'group flex flex-1 items-center space-x-1 rounded-none border border-b-0 border-black py-3 px-6 font-mono text-sm font-bold uppercase leading-none text-black last:border-l-0 data-[state=active]:bg-orange';
// const TABS_ICONS_CLASSES = 'w-6 h-6 -translate-y-[2px]';

const LayersToolbox = (): JSX.Element => {
  const [activeLayers] = useSyncMapLayers();

  return (
    <Tabs
      className="absolute bottom-0 right-0 flex max-h-[calc(100%-100px)] w-[335px] flex-col items-end"
      defaultValue={activeLayers.length ? 'legend' : 'layers-list'}
    >
      <TabsList className="h-auto rounded-none bg-white p-0">
        <TabsTrigger value="layers-list" className={TABS_TRIGGER_CLASSES} tabIndex={0}>
          <span>layers</span>
          {/* <LuChevronDown
            className={`hidden group-data-[state=active]:block ${TABS_ICONS_CLASSES}`}
          />
          <LuChevronUp
            className={`hidden group-data-[state=inactive]:block ${TABS_ICONS_CLASSES}`}
          /> */}
        </TabsTrigger>
        <TabsTrigger value="legend" className={TABS_TRIGGER_CLASSES} tabIndex={0}>
          <span>legend</span>
          {/* <LuChevronDown
            className={`hidden group-data-[state=active]:block ${TABS_ICONS_CLASSES}`}
          />
          <LuChevronUp
            className={`hidden group-data-[state=inactive]:block ${TABS_ICONS_CLASSES}`}
          /> */}
        </TabsTrigger>
      </TabsList>
      <div className="w-full overflow-y-scroll border border-black bg-white py-3 px-6">
        <TabsContent value="layers-list" className="m-0">
          <LayersDropdown />
        </TabsContent>
        <TabsContent value="legend">
          <Legend />
        </TabsContent>
      </div>
    </Tabs>
  );
};

export default LayersToolbox;
