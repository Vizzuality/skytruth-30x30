import { useCallback } from 'react';

import { useAtom, useSetAtom } from 'jotai';
import { useResetAtom } from 'jotai/utils';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { modellingAtom, drawStateAtom } from '@/containers/map/store';
import { cn } from '@/lib/classnames';
import { FCWithMessages } from '@/types';

const COMMON_BUTTON_CLASSES =
  'flex h-10 justify-between border-t border-black px-5 md:px-8 w-full pt-1 font-mono text-xs normal-case justify-center';

type ModellingButtonsProps = {
  className?: HTMLDivElement['className'];
};

const ModellingButtons: FCWithMessages<ModellingButtonsProps> = ({ className }) => {
  const t = useTranslations('containers.map-sidebar-main-panel');

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
    setDrawState({
      active: true,
      status: 'drawing',
      feature: null,
    });
    setModelling((prevState) => ({ ...prevState, active: true }));
  }, [resetModelling, resetDrawState, setModelling, setDrawState]);

  return (
    <div className={cn('flex font-mono', className)}>
      {status !== 'drawing' && status !== 'success' && (
        <Button
          variant="transparent"
          className={COMMON_BUTTON_CLASSES}
          size="full"
          onClick={() => setDrawState((prevState) => ({ ...prevState, active: true }))}
        >
          {active ? t('start-drawing-on-map') : t('draw-shape')}
        </Button>
      )}
      {(status === 'drawing' || status === 'success') && (
        <div className="flex w-full space-x-2">
          <Button
            variant="transparent"
            className={COMMON_BUTTON_CLASSES}
            size="full"
            onClick={onClickClearModelling}
          >
            {t('clear-shape')}
          </Button>
          <Button
            variant="transparent"
            className={COMMON_BUTTON_CLASSES}
            size="full"
            onClick={onClickRedraw}
          >
            {t('re-draw')}
          </Button>
        </div>
      )}
    </div>
  );
};

ModellingButtons.messages = ['containers.map-sidebar-main-panel'];

export default ModellingButtons;
