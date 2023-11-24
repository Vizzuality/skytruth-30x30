import { useSetAtom } from 'jotai';

import { Button } from '@/components/ui/button';
import { drawStateAtom } from '@/containers/data-tool/store';

const AnalysisStateContent = {
  Content: () => {
    const setDrawState = useSetAtom(drawStateAtom);

    return (
      <>
        <Button
          size="sm"
          className="mb-3 block w-fit text-xs font-bold"
          onClick={() => setDrawState({ active: false, feature: undefined })}
        >
          Worldwide
        </Button>
        <h1 className="text-4xl font-black uppercase">Custom Area</h1>
        <p className="text-xs text-gray-500">Status last updated: August 2023</p>
      </>
    );
  },
  Footer: () => {
    const setDrawState = useSetAtom(drawStateAtom);

    return (
      <Button
        type="button"
        className="w-full text-xs"
        onClick={() => setDrawState({ active: false, feature: undefined })}
      >
        Cancel
      </Button>
    );
  },
};

export default AnalysisStateContent;
