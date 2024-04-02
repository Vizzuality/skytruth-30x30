import { useCallback } from 'react';

import { useAtom, useSetAtom } from 'jotai';
import { useResetAtom } from 'jotai/utils';

import { Button } from '@/components/ui/button';
import { modellingAtom, drawStateAtom } from '@/containers/map/store';

const COMMON_BUTTON_CLASSES = 'w-full text-xs normal-case';

const ModellingButtons: React.FC = () => {
  const setModelling = useSetAtom(modellingAtom);
  const resetModelling = useResetAtom(modellingAtom);
  const resetDrawState = useResetAtom(drawStateAtom);
  const [{ active, status }, setDrawState] = useAtom(drawStateAtom);

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
    <div className="flex font-mono">
      {status !== 'drawing' && status !== 'success' && (
        <Button
          type="button"
          variant="blue"
          className={COMMON_BUTTON_CLASSES}
          size="sm"
          onClick={() => setDrawState((prevState) => ({ ...prevState, active: true }))}
        >
          {active ? 'Start drawing on the map' : 'Draw a shape'}
        </Button>
      )}
      {(status === 'drawing' || status === 'success') && (
        <div className="flex w-full space-x-2">
          <Button
            type="button"
            variant="blue"
            className={COMMON_BUTTON_CLASSES}
            size="sm"
            onClick={onClickClearModelling}
          >
            Clear shape
          </Button>
          <Button
            type="button"
            variant="blue"
            className={COMMON_BUTTON_CLASSES}
            size="sm"
            onClick={onClickRedraw}
          >
            Re-draw
          </Button>
        </div>
      )}
    </div>
  );
};

export default ModellingButtons;
