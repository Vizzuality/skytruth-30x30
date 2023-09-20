import { useRecoilState } from 'recoil';

import { Button } from '@/components/ui/button';
import { drawStateAtom } from '@/store/map';

const OverviewStateContent = {
  Content: () => (
    <>
      <h1 className="text-4xl font-black uppercase">Worldwide</h1>
      <p className="text-xs text-gray-500">Status last updated: August 2023</p>
    </>
  ),
  Footer: () => {
    const [drawState, setDrawState] = useRecoilState(drawStateAtom);

    return (
      <Button
        type="button"
        className="w-full text-xs"
        onClick={() => setDrawState({ ...drawState, active: true })}
      >
        Analyze an area
      </Button>
    );
  },
};

export default OverviewStateContent;
