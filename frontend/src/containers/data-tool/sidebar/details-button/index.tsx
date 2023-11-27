import { ComponentProps, useCallback } from 'react';

import { ArrowRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useSyncDataToolContentSettings } from '@/containers/data-tool/sync-settings';
import { cn } from '@/lib/classnames';

const DetailsButton: React.FC = () => {
  const [{ showDetails }, setSettings] = useSyncDataToolContentSettings();

  const handleButtonClick = useCallback(() => {
    setSettings((prevSettings) => ({ ...prevSettings, showDetails: !prevSettings.showDetails }));
  }, [setSettings]);

  return (
    <Button
      className={cn('h-12 border-t border-black', {
        'border-r !px-2': showDetails,
        'flex justify-between px-5 md:px-8': !showDetails,
      })}
      variant="sidebar-details"
      size={
        cn({
          default: showDetails,
          full: !showDetails,
        }) as ComponentProps<typeof Button>['size']
      }
      onClick={handleButtonClick}
    >
      {!showDetails && <span className="pt-1 font-mono">Marine Conservation Details</span>}
      <ArrowRight aria-hidden />
    </Button>
  );
};

export default DetailsButton;
