import { FC, useCallback, useMemo, useState } from 'react';

import { useAtom } from 'jotai';
import { Trash2 } from 'lucide-react';

import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import { Button } from '@/components/ui/button';
import { drawStateAtom } from '@/containers/data-tool/store';

import { useMapboxDraw, UseMapboxDrawProps } from './hooks';

const DrawControls: FC = () => {
  const [startedDrawing, setStartedDrawing] = useState(false);
  const [drawState, setDrawState] = useAtom(drawStateAtom);

  const onCreate: UseMapboxDrawProps['onCreate'] = useCallback(
    ({ features }) => {
      setDrawState({ active: false, feature: features[0] });
      setStartedDrawing(false);
    },
    [setDrawState]
  );

  const onClick: UseMapboxDrawProps['onClick'] = useCallback(
    () => setStartedDrawing(true),
    [setStartedDrawing]
  );

  const useMapboxDrawProps = useMemo(
    () => ({
      enabled: drawState.active,
      onCreate,
      onClick,
    }),
    [drawState.active, onClick, onCreate]
  );

  const draw = useMapboxDraw(useMapboxDrawProps);

  if (!drawState.active) {
    return null;
  }

  return (
    <div className="absolute top-3 left-3 z-10 flex items-center bg-black md:left-1/2 md:top-3 md:-translate-x-1/2">
      <p className="pl-4 text-sm font-bold text-white">
        {!startedDrawing && 'Start drawing'}
        {startedDrawing && 'Close the shape to analyze'}
      </p>
      <div className="ml-4 mr-2 h-5 w-px bg-gray-500" />
      <Button
        type="button"
        size="icon"
        onClick={() => {
          draw.trash();
          setStartedDrawing(false);
        }}
      >
        <Trash2 className="h-6 w-6" aria-hidden />
        <span className="sr-only">Delete drawing</span>
      </Button>
    </div>
  );
};

export default DrawControls;
