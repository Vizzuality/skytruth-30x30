import { useCallback } from 'react';

import { useSetAtom } from 'jotai';
import { useResetAtom } from 'jotai/utils';

import { Button } from '@/components/ui/button';
import { modellingAtom, drawStateAtom } from '@/containers/map/store';

const ModellingButtons: React.FC = () => {
  const setModelling = useSetAtom(modellingAtom);
  const resetModelling = useResetAtom(modellingAtom);
  const resetDrawState = useResetAtom(drawStateAtom);

  const onClickClearModelling = useCallback(() => {
    resetDrawState();
    resetModelling();
  }, [resetModelling, resetDrawState]);

  const onClickRedraw = useCallback(() => {
    resetDrawState();
    resetModelling();
    setModelling((prevState) => ({ ...prevState, active: true }));
  }, [resetModelling, resetDrawState, setModelling]);

  return (
    <div className="mt-4 flex gap-4 py-1 font-mono text-sm font-semibold uppercase underline">
      <Button
        type="button"
        className="m-0 p-0"
        variant="text-link"
        size="sm"
        onClick={onClickClearModelling}
      >
        Clear model
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

export default ModellingButtons;
