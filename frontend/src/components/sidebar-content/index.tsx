import { FC } from 'react';

import { useAtomValue } from 'jotai';

import { drawStateAtom } from '@/containers/map/store';

import AnalysisStateContent from './analysis';
import DrawingStateContent from './drawing';
import OverviewStateContent from './overview';

const SidebarContent: FC = () => {
  const drawState = useAtomValue(drawStateAtom);

  let content: { Content: FC; Footer: FC };
  if (drawState.active) {
    content = DrawingStateContent;
  } else if (drawState.feature) {
    content = AnalysisStateContent;
  } else {
    content = OverviewStateContent;
  }

  return (
    <div className="flex h-full flex-col gap-y-3">
      <div className="flex-grow overflow-y-auto">
        <content.Content />
      </div>
      <div className="flex-shrink-0">
        <content.Footer />
      </div>
    </div>
  );
};

export default SidebarContent;
