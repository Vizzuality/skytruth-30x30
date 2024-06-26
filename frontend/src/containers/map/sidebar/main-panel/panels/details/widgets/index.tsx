import { useRouter } from 'next/router';

import { useLocale } from 'next-intl';

import { useSyncMapContentSettings } from '@/containers/map/sync-settings';
import { cn } from '@/lib/classnames';
import { FCWithMessages } from '@/types';
import { useGetLocations } from '@/types/generated/location';

import HabitatWidget from './habitat';
import MarineConservationWidget from './marine-conservation';
import ProtectionTypesWidget from './protection-types';

// import EstablishmentStagesWidget from './establishment-stages';
// import FishingProtectionWidget from './fishing-protection';

const DetailsWidgets: FCWithMessages = () => {
  const locale = useLocale();

  const {
    query: { locationCode = 'GLOB' },
  } = useRouter();

  const [{ showDetails }] = useSyncMapContentSettings();

  const { data: locationsData } = useGetLocations({
    locale,
    filters: {
      code: locationCode,
    },
  });

  return (
    <div
      className={cn({
        'flex flex-col divide-y-[1px] divide-black font-mono': true,
        'pb-40': showDetails,
      })}
    >
      <MarineConservationWidget location={locationsData?.data[0]?.attributes} />
      <ProtectionTypesWidget location={locationsData?.data[0]?.attributes} />
      {/* <FishingProtectionWidget location={locationsData?.data[0]?.attributes} /> */}
      {/* <EstablishmentStagesWidget location={locationsData?.data[0]?.attributes} /> */}
      <HabitatWidget location={locationsData?.data[0]?.attributes} />
    </div>
  );
};

DetailsWidgets.messages = [
  ...MarineConservationWidget.messages,
  ...ProtectionTypesWidget.messages,
  ...HabitatWidget.messages,
];

export default DetailsWidgets;
