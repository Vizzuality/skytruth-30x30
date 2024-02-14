import { useCallback } from 'react';

import { useAtom } from 'jotai';
import { useResetAtom } from 'jotai/utils';

import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import VideoPlayer from '@/components/video-player';
import { drawStateAtom } from '@/containers/map/store';
import Graph from '@/styles/icons/graph.svg?sprite';

const AnalysisIntro: React.FC = () => {
  const [{ active: isDrawStateActive }, setDrawState] = useAtom(drawStateAtom);
  const resetDrawState = useResetAtom(drawStateAtom);

  const onClickDraw = useCallback(() => {
    setDrawState((prevState) => ({
      ...prevState,
      active: true,
    }));
  }, [setDrawState]);

  return (
    <div className="flex flex-col gap-4 py-4 px-4 md:px-8">
      <span className="flex items-center font-bold">
        <Icon icon={Graph} className="mr-2.5 inline h-4 w-5 fill-black" />
        Start modelling yor own <span className="ml-1.5 text-blue">custom area</span>.
      </span>
      <VideoPlayer
        source="/videos/modelling-instructions.mp4"
        stillImage="/images/video-stills/modelling-instructions.png"
        type="video/mp4"
      />
      <p>Draw in the map the area you want to model through on-the-fly calculations.</p>
      <span>
        {isDrawStateActive && (
          <Button
            type="button"
            variant="blue"
            className="w-full font-mono text-xs"
            onClick={resetDrawState}
          >
            Start drawing on the map
          </Button>
        )}
        {!isDrawStateActive && (
          <Button
            type="button"
            variant="white"
            className="w-full font-mono text-xs"
            onClick={onClickDraw}
          >
            Draw a shape
          </Button>
        )}
      </span>
    </div>
  );
};

export default AnalysisIntro;
