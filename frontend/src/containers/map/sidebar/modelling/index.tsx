import { useAtomValue } from 'jotai';

import { modellingAtom } from '../../store';

import BackButton from './back-button';
import ModellingButtons from './modelling-buttons';
import ModellingIntro from './modelling-intro';
import ModellingWidget from './widget';

const SidebarModelling: React.FC = () => {
  const { status: modellingStatus } = useAtomValue(modellingAtom);

  const showIntro = modellingStatus === 'idle';
  const showButtons = ['success', 'error'].includes(modellingStatus);

  return (
    <>
      <div className="h-full w-full overflow-y-scroll border-x border-black pb-12">
        <div className="border-b border-black px-4 pt-4 pb-2 md:px-8">
          <h1 className="text-5xl font-black">
            {showIntro ? 'Marine Conservation Modelling' : 'Custom Area'}
          </h1>
          <div className="my-2">{showButtons && <ModellingButtons />}</div>
        </div>
        {showIntro && <ModellingIntro />}
        {!showIntro && <ModellingWidget />}
      </div>
      <div className="absolute bottom-0 left-px">
        <BackButton />
      </div>
    </>
  );
};

export default SidebarModelling;
