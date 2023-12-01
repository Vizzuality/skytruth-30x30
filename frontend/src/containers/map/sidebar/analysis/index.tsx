import { useAtomValue } from 'jotai';

import { analysisAtom } from '../../store';

import AnalysisButtons from './analysis-buttons';
import AnalysisIntro from './analysis-intro';
import AnalysisWidget from './widget';

const SidebarAnalysis: React.FC = () => {
  const { status: analysisStatus } = useAtomValue(analysisAtom);

  const showIntro = analysisStatus === 'idle';

  return (
    <div className="h-full w-full overflow-y-scroll border-x border-black pb-12">
      <div className="border-b border-black px-4 pt-4 pb-2 md:px-8">
        <h1 className="text-5xl font-black">Marine Conservation Modelling</h1>
        <div className="my-2">
          <AnalysisButtons />
        </div>
      </div>
      {showIntro && <AnalysisIntro />}
      {!showIntro && <AnalysisWidget />}
    </div>
  );
};

export default SidebarAnalysis;
