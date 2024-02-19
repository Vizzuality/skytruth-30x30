import { useCallback } from 'react';

import { useResetAtom } from 'jotai/utils';
import { LuChevronLeft } from 'react-icons/lu';

import { Button } from '@/components/ui/button';
import { modellingAtom, drawStateAtom } from '@/containers/map/store';

const BackButton: React.FC = () => {
  const resetModelling = useResetAtom(modellingAtom);
  const resetDrawState = useResetAtom(drawStateAtom);

  const onClickBack = useCallback(() => {
    resetDrawState();
    resetModelling();
  }, [resetModelling, resetDrawState]);

  return (
    <Button
      className="flex h-10 justify-between border-l-0 px-5 font-mono text-xs md:px-8"
      variant="blue"
      onClick={onClickBack}
    >
      <LuChevronLeft className="-ml-2 mr-2 h-5 w-5 -translate-y-[1px]" />
      Back to dashboard
    </Button>
  );
};

export default BackButton;
