import { useAtom } from 'jotai';

import { Button } from '@/components/ui/button';
import { drawStateAtom } from '@/containers/data-tool/store';

const OverviewStateContent = {
  Content: () => (
    <>
      <h1 className="text-4xl font-black uppercase">Worldwide</h1>
      <p className="text-xs text-gray-500">Status last updated: August 2023</p>
    </>
  ),
  Footer: () => {
    const [drawState, setDrawState] = useAtom(drawStateAtom);

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
