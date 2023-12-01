import { useCallback } from 'react';

import { useSetAtom } from 'jotai';
import { useResetAtom } from 'jotai/utils';

import { Button } from '@/components/ui/button';
import { analysisAtom, drawStateAtom } from '@/containers/map/store';

const AnalysisButtons: React.FC = () => {
  const setDrawState = useSetAtom(drawStateAtom);
  const resetAnalysis = useResetAtom(analysisAtom);

  const resetDrawing = useCallback(() => {
    setDrawState((prevState) => ({
      ...prevState,
      feature: null,
    }));
  }, [setDrawState]);

  return (
    <div className="mt-4 flex gap-4 py-1 font-mono text-sm font-semibold uppercase underline">
      <Button
        type="button"
        className="m-0 p-0"
        variant="text-link"
        size="sm"
        onClick={resetAnalysis}
      >
        Clear analysis
      </Button>
      <Button
        type="button"
        className="m-0 p-0"
        variant="text-link"
        size="sm"
        onClick={resetDrawing}
      >
        Re-draw
      </Button>
    </div>
  );
};

export default AnalysisButtons;
