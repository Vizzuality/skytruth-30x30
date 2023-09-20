import { useRecoilState } from 'recoil';

import { Button } from '@/components/ui/button';
import { drawStateAtom } from '@/store/map';

const DrawingStateContent = {
  Content: () => (
    <>
      <h1 className="text-4xl font-black uppercase">Analyze an area</h1>
      <p className="mt-4 text-sm">Use the drawing tool to draw an area on the map.</p>
    </>
  ),
  Footer: () => {
    const [drawState, setDrawState] = useRecoilState(drawStateAtom);

    return (
      <Button
        type="button"
        className="w-full text-xs"
        onClick={() => setDrawState({ ...drawState, active: false })}
      >
        Cancel
      </Button>
    );
  },
};

export default DrawingStateContent;
