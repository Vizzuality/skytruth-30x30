import { useCallback } from 'react';

import { useSetAtom } from 'jotai';
import { useResetAtom } from 'jotai/utils';

import { Button } from '@/components/ui/button';
import { analysisAtom, drawStateAtom } from '@/containers/map/store';

const AnalysisButtons: React.FC = () => {
  const setAnalysis = useSetAtom(analysisAtom);
  const resetAnalysis = useResetAtom(analysisAtom);
  const resetDrawState = useResetAtom(drawStateAtom);

  const onClickClearAnalysis = useCallback(() => {
    resetDrawState();
    resetAnalysis();
  }, [resetAnalysis, resetDrawState]);

  const onClickRedraw = useCallback(() => {
    resetDrawState();
    resetAnalysis();
    setAnalysis((prevState) => ({ ...prevState, active: true }));
  }, [resetAnalysis, resetDrawState, setAnalysis]);

  return (
    <div className="mt-4 flex gap-4 py-1 font-mono text-sm font-semibold uppercase underline">
      <Button
        type="button"
        className="m-0 p-0"
        variant="text-link"
        size="sm"
        onClick={onClickClearAnalysis}
      >
        Clear analysis
      </Button>
      <Button
        type="button"
        className="m-0 p-0"
        variant="text-link"
        size="sm"
        onClick={onClickRedraw}
      >
        Re-draw
      </Button>
    </div>
  );
};

export default AnalysisButtons;
