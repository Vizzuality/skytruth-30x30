import { useCallback } from 'react';

import { Button } from '@/components/ui/button';
import { useSyncMapContentSettings } from '@/containers/map/sync-settings';

const DetailsButton: React.FC = () => {
  const [, setSettings] = useSyncMapContentSettings();

  const handleButtonClick = useCallback(() => {
    setSettings((prevSettings) => ({ ...prevSettings, showDetails: !prevSettings.showDetails }));
  }, [setSettings]);

  return (
    <Button
      className="flex h-10 justify-between border-t border-black px-5 md:px-8"
      variant="sidebar-details"
      size="full"
      onClick={handleButtonClick}
    >
      <span className="w-full pt-1 font-mono text-xs">Marine Conservation Details</span>
    </Button>
  );
};

export default DetailsButton;
