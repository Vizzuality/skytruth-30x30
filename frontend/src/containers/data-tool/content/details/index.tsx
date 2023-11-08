import { useMemo } from 'react';

import { useAtomValue } from 'jotai';

import { Button } from '@/components/ui/button';
import tablesSettings from '@/containers/data-tool/content/details/tables-settings';
import { useSyncDataToolContentSettings } from '@/containers/data-tool/sync-settings';
import { locationAtom } from '@/store/location';

const DataToolDetails: React.FC = () => {
  const [, setSettings] = useSyncDataToolContentSettings();
  const location = useAtomValue(locationAtom);

  const handleOnCloseClick = () => {
    setSettings((prevSettings) => ({ ...prevSettings, showDetails: false }));
  };

  const table = useMemo(() => {
    // TODO: Improve to support more entries (although not needed right now)
    const tableSettings = tablesSettings.worldwideRegion.locationTypes.includes(location.type)
      ? tablesSettings.worldwideRegion
      : tablesSettings.countryHighseas;

    const parsedTitle = tableSettings.title[location.type].replace('{location}', location.name);

    return {
      title: parsedTitle,
      component: tableSettings.component,
    };
  }, [location]);

  return (
    <div className="overflow-none absolute h-full w-full bg-white px-4 py-4 md:px-6">
      <div className="mb-8 flex gap-8 md:justify-between">
        <span className="max-w-lg">
          <h2 className="text-4xl font-extrabold">{table.title}</h2>
        </span>
        <Button variant="text-link" className="m-0 cursor-pointer p-0" onClick={handleOnCloseClick}>
          Close
        </Button>
      </div>
      <div className="overflow-scroll">
        <div className="mt-4">
          <table.component />
        </div>
      </div>
    </div>
  );
};

export default DataToolDetails;
