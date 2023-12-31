import { useAtomValue } from 'jotai';

import { analysisAtom } from '../../store';

import AnalysisButtons from './analysis-buttons';
import AnalysisIntro from './analysis-intro';
import BackButton from './back-button';
import AnalysisWidget from './widget';

const SidebarAnalysis: React.FC = () => {
  const { status: analysisStatus } = useAtomValue(analysisAtom);

  const showIntro = analysisStatus === 'idle';
  const showButtons = ['success', 'error'].includes(analysisStatus);

  return (
    <>
      <div className="h-full w-full overflow-y-scroll border-x border-black pb-12">
        <div className="border-b border-black px-4 pt-4 pb-2 md:px-8">
          <h1 className="text-5xl font-black">
            {showIntro ? 'Marine Conservation Modelling' : 'Custom Area'}
          </h1>
          <div className="my-2">{showButtons && <AnalysisButtons />}</div>
        </div>
        {showIntro && <AnalysisIntro />}
        {!showIntro && <AnalysisWidget />}
      </div>
      <div className="absolute bottom-0 left-px">
        <BackButton />
      </div>
    </>
  );
};

export default SidebarAnalysis;
