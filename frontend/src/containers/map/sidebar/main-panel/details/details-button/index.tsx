import { useCallback } from 'react';

import { Button } from '@/components/ui/button';
import { useSyncMapContentSettings } from '@/containers/map/sync-settings';
import { cn } from '@/lib/classnames';

type DetailsButtonProps = {
  className?: HTMLDivElement['className'];
};

const DetailsButton: React.FC<DetailsButtonProps> = ({ className }) => {
  const [, setSettings] = useSyncMapContentSettings();

  const handleButtonClick = useCallback(() => {
    setSettings((prevSettings) => ({ ...prevSettings, showDetails: !prevSettings.showDetails }));
  }, [setSettings]);

  return (
    <Button
      className={cn('flex h-10 justify-between border-t border-black px-5 md:px-8', className)}
      variant="transparent"
      size="full"
      onClick={handleButtonClick}
    >
      <span className="w-full pt-1 font-mono text-xs font-semibold normal-case">More details</span>
    </Button>
  );
};

export default DetailsButton;
