import { ArrowRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useSyncDataToolContentSettings } from '@/containers/data-tool/sync-settings';

const DetailsButton: React.FC = () => {
  const [settings, setSettings] = useSyncDataToolContentSettings();

  const handleButtonClick = () => {
    setSettings({ ...settings, showDetails: true });
  };

  return (
    <Button
      className="flex justify-between"
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
