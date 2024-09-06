import { useCallback, useMemo } from 'react';

import { useRouter } from 'next/router';

import { useLocale, useTranslations } from 'next-intl';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PAGES } from '@/constants/pages';
import { useMapSearchParams } from '@/containers/map/content/map/sync-settings';
import { useSyncMapContentSettings } from '@/containers/map/sync-settings';
import { FCWithMessages } from '@/types';
import { useGetLocations } from '@/types/generated/location';

import LocationSelector from '../../location-selector';

import CountriesList from './countries-list';
import DetailsButton from './details-button';
import DetailsWidgets from './widgets';

const SidebarDetails: FCWithMessages = () => {
  const locale = useLocale();
  const t = useTranslations('containers.map-sidebar-main-panel');

  const {
    push,
    query: { locationCode = 'GLOB' },
  } = useRouter();
  const searchParams = useMapSearchParams();

  const [{ tab }, setSettings] = useSyncMapContentSettings();

  const { data: locationsData } = useGetLocations({
    locale,
    filters: {
      code: locationCode,
    },
    populate: 'members',
  });

  const memberCountries = useMemo(() => {
    return locationsData?.data[0]?.attributes?.members?.data?.map(({ attributes }) => ({
      code: attributes?.code,
      name: attributes?.name,
    }));
  }, [locationsData?.data]);

  const handleLocationSelected = useCallback(
    (locationCode) => {
      push(`${PAGES.progressTracker}/${locationCode}?${searchParams.toString()}`);
    },
    [push, searchParams]
  );

  const handleTabChange = useCallback(
    (tab: string) => setSettings((prevSettings) => ({ ...prevSettings, tab })),
    [setSettings]
  );

  return (
    <Tabs value={tab} onValueChange={handleTabChange} className="flex h-full w-full flex-col">
      <div className="shrink-0 border-b border-black bg-orange px-4 pt-4 md:px-8 md:pt-6">
        <h1 className="text-5xl font-black">{locationsData?.data[0]?.attributes?.name}</h1>
        <LocationSelector className="mt-2" theme="orange" onChange={handleLocationSelected} />
        <CountriesList className="mt-2" bgColorClassName="bg-orange" countries={memberCountries} />
        <TabsList className="relative top-px mt-5">
          <TabsTrigger value="summary">{t('summary')}</TabsTrigger>
          <TabsTrigger value="terrestrial">{t('terrestrial')}</TabsTrigger>
          <TabsTrigger value="marine">{t('marine')}</TabsTrigger>
        </TabsList>
        {/* <DetailsButton className="mt-4" /> */}
      </div>
      <div className="flex-grow overflow-y-auto">
        <TabsContent value="summary">{t('summary')}</TabsContent>
        <TabsContent value="terrestrial">{t('terrestrial')}</TabsContent>
        <TabsContent value="marine">
          <DetailsWidgets />
        </TabsContent>
      </div>
    </Tabs>
  );
};

SidebarDetails.messages = [
  'containers.map-sidebar-main-panel',
  ...LocationSelector.messages,
  ...CountriesList.messages,
  ...DetailsButton.messages,
  ...DetailsWidgets.messages,
];

export default SidebarDetails;
