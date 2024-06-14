import { useMemo } from 'react';

import { useRouter } from 'next/router';

import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import tablesSettings from '@/containers/map/content/details/tables-settings';
import { useSyncMapContentSettings } from '@/containers/map/sync-settings';
import CloseIcon from '@/styles/icons/close.svg?sprite';
import { getGetLocationsQueryOptions, useGetLocations } from '@/types/generated/location';

import ScrollingIndicators from './table/scrolling-indicators';

const MapDetails: React.FC = () => {
  const [, setSettings] = useSyncMapContentSettings();
  const {
    query: { locationCode = 'GLOB' },
  } = useRouter();

  const locationsQuery = useGetLocations(
    {
      filters: {
        code: locationCode,
      },
    },
    {
      query: {
        ...getGetLocationsQueryOptions(
          {
            filters: {
              code: locationCode,
            },
          },
          {
            query: {
              select: ({ data }) => data?.[0]?.attributes,
            },
          }
        ),
      },
    }
  );

  const handleOnCloseClick = () => {
    setSettings((prevSettings) => ({ ...prevSettings, showDetails: false }));
  };

  const table = useMemo(() => {
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
  }, [locationsQuery.data]);

  return (
    <div className="absolute h-full w-full overflow-scroll bg-white px-4 py-4 md:px-6">
      <div className="sticky left-0 mb-8 flex gap-8 md:justify-between">
        <span className="max-w-lg">
          <h2 className="text-4xl font-extrabold">{table.title}</h2>
        </span>
        <Button
          variant="text-link"
          className="m-0 cursor-pointer p-0 font-mono text-xs normal-case no-underline"
          onClick={handleOnCloseClick}
        >
          Close
          <Icon icon={CloseIcon} className=" ml-2 h-3 w-3 pb-px" />
        </Button>
      </div>
      <div className="relative z-0 mb-10">
        <ScrollingIndicators className="mt-4 overflow-x-scroll">
          <table.component />
        </ScrollingIndicators>
      </div>
    </div>
  );
};

export default MapDetails;
