import { useRouter } from 'next/router';

import { useAtomValue } from 'jotai';

import { PAGES } from '@/constants/pages';
import { useMapSearchParams } from '@/containers/map/content/map/sync-settings';
import { modellingAtom } from '@/containers/map/store';

import LocationSelector from '../../location-selector';

import ModellingButtons from './modelling-buttons';
import ModellingIntro from './modelling-intro';
import ModellingWidget from './widget';

const SidebarModelling: React.FC = () => {
  const { push } = useRouter();
  const searchParams = useMapSearchParams();
  const { status: modellingStatus } = useAtomValue(modellingAtom);

  const showIntro = modellingStatus === 'idle';

  const handleLocationSelected = (locationCode) => {
    push(`${PAGES.conservationBuilder}/${locationCode}?${searchParams.toString()}`);
  };

  return (
    <>
      <div className="h-full w-full overflow-y-auto pb-12">
        <div className="sticky border-b border-black bg-blue px-4 py-4 md:py-6 md:px-8">
          {showIntro && (
            <h1 className="text-5xl font-black">Conservation scenarios with custom areas.</h1>
          )}
          {!showIntro && (
            <div className="space-y-2 text-xl font-black">
              <h1 className="text-5xl font-black">Custom Area</h1>
              <p>
                Activate more layers for additional contextual information about your custom area
                conservation scenario.
              </p>
            </div>
          )}

          <LocationSelector className="mt-2" theme="blue" onChange={handleLocationSelected} />
          <ModellingButtons className="mt-4" />
        </div>
        {showIntro && <ModellingIntro />}
        {!showIntro && <ModellingWidget />}
      </div>
    </>
  );
};

export default SidebarModelling;
