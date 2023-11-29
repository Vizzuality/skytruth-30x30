import { useMemo } from 'react';

import { useRouter } from 'next/router';

import { useQueryClient } from '@tanstack/react-query';

import { Button } from '@/components/ui/button';
import tablesSettings from '@/containers/data-tool/content/details/tables-settings';
import { useSyncDataToolContentSettings } from '@/containers/data-tool/sync-settings';
import { LocationGroupsDataItemAttributes } from '@/types/generated/strapi.schemas';

const DataToolDetails: React.FC = () => {
  const [, setSettings] = useSyncDataToolContentSettings();
  const {
    query: { locationCode },
  } = useRouter();

  const queryClient = useQueryClient();

  const location = queryClient.getQueryData<LocationGroupsDataItemAttributes>([
    'locations',
    locationCode,
  ]);

  const handleOnCloseClick = () => {
    setSettings((prevSettings) => ({ ...prevSettings, showDetails: false }));
  };

  const table = useMemo(() => {
    if (location) {
      // TODO: Improve to support more entries (although not needed right now)
      const tableSettings = tablesSettings.worldwideRegion.locationTypes.includes(location.type)
        ? tablesSettings.worldwideRegion
        : tablesSettings.countryHighseas;

      const parsedTitle =
        tableSettings.title[location.type]?.replace('{location}', location.name) ||
        tableSettings.title.fallback;

      return {
        title: parsedTitle,
        component: tableSettings.component,
      };
    }
  }, [location]);

  return (
    <div className="absolute h-full w-full overflow-x-hidden overflow-y-scroll bg-white px-4 py-4 md:px-6">
      <div className="mb-8 flex gap-8 md:justify-between">
        <span className="max-w-lg">
          <h2 className="text-4xl font-extrabold">{table.title}</h2>
        </span>
        <Button variant="text-link" className="m-0 cursor-pointer p-0" onClick={handleOnCloseClick}>
          Close
        </Button>
      </div>
      <div className="overflow-x-auto overflow-y-auto">
        <div className="mt-4">
          <table.component />
        </div>
      </div>
    </div>
  );
};

export default DataToolDetails;
