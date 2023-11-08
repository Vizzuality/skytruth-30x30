import { ArrowRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useSyncDataToolContentSettings } from '@/containers/data-tool/sync-settings';

const DetailsButton: React.FC = () => {
  const [, setSettings] = useSyncDataToolContentSettings();

  const handleButtonClick = () => {
    setSettings((prevSettings) => ({ ...prevSettings, showDetails: true }));
  };

  return (
    <Button
      className="flex justify-between px-5 md:px-8"
      variant="sidebar-details"
      size="full"
      onClick={handleButtonClick}
    >
      <span className="pt-1">Marine Conservation Details</span>
      <ArrowRight aria-hidden />
    </Button>
  );
};

export default DetailsButton;
