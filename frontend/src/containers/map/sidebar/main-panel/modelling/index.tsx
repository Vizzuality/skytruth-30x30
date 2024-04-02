import { useAtomValue } from 'jotai';

import { modellingAtom } from '../../../store';

import ModellingButtons from './modelling-buttons';
import ModellingIntro from './modelling-intro';
import ModellingWidget from './widget';

const SidebarModelling: React.FC = () => {
  const { status: modellingStatus } = useAtomValue(modellingAtom);

  const showIntro = modellingStatus === 'idle';

  return (
    <>
      <div className="h-full w-full overflow-y-auto pb-12">
        <div className="space-y-4 border-b border-black bg-blue-600 p-4 md:px-8">
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

          <ModellingButtons />
        </div>
        {showIntro && <ModellingIntro />}
        {!showIntro && <ModellingWidget />}
      </div>
    </>
  );
};

export default SidebarModelling;
