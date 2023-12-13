import { useMemo } from 'react';

import { useRouter } from 'next/router';

import { Button } from '@/components/ui/button';
import tablesSettings from '@/containers/map/content/details/tables-settings';
import { useSyncMapContentSettings } from '@/containers/map/sync-settings';
import { useGetLocations } from '@/types/generated/location';

const MapDetails: React.FC = () => {
  const [, setSettings] = useSyncMapContentSettings();
  const {
    query: { locationCode },
  } = useRouter();

  const locationsQuery = useGetLocations(
    {
      filters: {
        code: locationCode,
      },
    },
    {
      query: {
        queryKey: ['locations', locationCode],
        select: ({ data }) => data?.[0]?.attributes,
      },
    }
  );

  const handleOnCloseClick = () => {
    setSettings((prevSettings) => ({ ...prevSettings, showDetails: false }));
  };

  const table = useMemo(() => {
    if (location) {
      // TODO: Improve to support more entries (although not needed right now)
      const tableSettings = tablesSettings.worldwideRegion.locationTypes.includes(
        locationsQuery.data?.type
      )
        ? tablesSettings.worldwideRegion
        : tablesSettings.countryHighseas;

      const parsedTitle =
        tableSettings.title[locationsQuery.data?.type]?.replace(
          '{location}',
          locationsQuery.data?.name
        ) || tableSettings.title.fallback;

      return {
        title: parsedTitle,
        component: tableSettings.component,
      };
    }
  }, [locationsQuery.data]);

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

export default MapDetails;
