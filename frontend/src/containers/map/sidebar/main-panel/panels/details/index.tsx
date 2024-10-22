import { useCallback, useEffect, useMemo, useRef } from 'react';

import { useRouter } from 'next/router';

import { BBox } from '@turf/turf';
import { useAtom } from 'jotai';
import { useLocale, useTranslations } from 'next-intl';

import { CustomMapProps } from '@/components/map/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PAGES } from '@/constants/pages';
import { useMapSearchParams } from '@/containers/map/content/map/sync-settings';
import { bboxLocationAtom } from '@/containers/map/store';
import { useSyncMapContentSettings } from '@/containers/map/sync-settings';
import useMapDefaultLayers from '@/hooks/use-map-default-layers';
import useScrollPosition from '@/hooks/use-scroll-position';
import { cn } from '@/lib/classnames';
import { combineBoundingBoxes } from '@/lib/utils/geo';
import { FCWithMessages } from '@/types';
import { useGetLocations } from '@/types/generated/location';
import { Location } from '@/types/generated/strapi.schemas';

import LocationSelector from '../../location-selector';

import CountriesList from './countries-list';
import DetailsButton from './details-button';
import MarineWidgets from './widgets/marine-widgets';
import SummaryWidgets from './widgets/summary-widgets';
import TerrestrialWidgets from './widgets/terrestrial-widgets';

const SidebarDetails: FCWithMessages = () => {
  const locale = useLocale();
  const t = useTranslations('containers.map-sidebar-main-panel');

  const containerRef = useRef<HTMLDivElement | null>(null);
  const containerScroll = useScrollPosition(containerRef);

  const {
    push,
    query: { locationCode = 'GLOB' },
  } = useRouter();
  const searchParams = useMapSearchParams();

  const [{ tab }, setSettings] = useSyncMapContentSettings();
  const [, setLocationBBox] = useAtom(bboxLocationAtom);

  const { data: locationsData } = useGetLocations({
    locale,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    fields: ['name', 'name_es', 'name_fr', 'marine_bounds', 'terrestrial_bounds'],
    filters: {
      code: locationCode,
    },
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    populate: {
      members: {
        fields: ['code', 'name', 'name_es', 'name_fr'],
      },
    },
  });

  const locationNameField = useMemo(() => {
    let res = 'name';
    if (locale === 'es') {
      res = 'name_es';
    }
    if (locale === 'fr') {
      res = 'name_fr';
    }
    return res;
  }, [locale]);

  const locationBounds = useMemo(() => {
    const { terrestrial_bounds, marine_bounds } =
      locationsData?.data[0]?.attributes ?? ({} as Location);

    if (tab === 'terrestrial') {
      return terrestrial_bounds;
    }

    if (tab === 'marine') {
      return marine_bounds;
    }

    if (terrestrial_bounds === undefined && marine_bounds === undefined) {
      return null;
    }

    return combineBoundingBoxes(
      // Falling back to the marine bounds because some locations don't have terrestrial bounds e.g.
      // ABJN and Gibraltar
      (terrestrial_bounds ?? marine_bounds) as BBox,
      // Falling back to the terrestrial bounds because some locations don't have marine bounds e.g.
      // any country without coast
      (marine_bounds ?? terrestrial_bounds) as BBox
    );
  }, [locationsData, tab]);

  const memberCountries = useMemo(() => {
    return locationsData?.data[0]?.attributes?.members?.data?.map(({ attributes }) => ({
      code: attributes?.code,
      name: attributes?.[locationNameField],
    }));
  }, [locationsData?.data, locationNameField]);

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

  // Scroll to the top when the tab changes (whether that's initiated by clicking on the tab trigger
  // or programmatically via `setSettings` in a different component) or when the location changes
  useEffect(() => {
    containerRef.current?.scrollTo({ top: 0 });
  }, [tab, locationCode]);

  // Zoom the map to the location's bounds (terrestrial bounds, marine bounds or both)
  useEffect(() => {
    if (locationBounds) {
      setLocationBBox(locationBounds as CustomMapProps['bounds']['bbox']);
    }
  }, [setLocationBBox, locationBounds]);

  // Update the map's default layers based on the tab
  useMapDefaultLayers();

  return (
    <Tabs value={tab} onValueChange={handleTabChange} className="flex h-full w-full flex-col">
      <div
        className={cn({
          'flex flex-shrink-0 gap-y-2 gap-x-5 border-b border-black bg-orange px-4 pt-4 md:px-8 md:pt-6':
            true,
          'flex-col': containerScroll === 0,
          'flex-row flex-wrap': containerScroll > 0,
        })}
      >
        <h1
          className={cn({
            'text-ellipsis font-black transition-all': true,
            'text-5xl': containerScroll === 0,
            'text-xl': containerScroll > 0,
          })}
        >
          {locationsData?.data[0]?.attributes?.[locationNameField]}
        </h1>
        <LocationSelector
          className="flex-shrink-0"
          theme="orange"
          size={containerScroll > 0 ? 'small' : 'default'}
          onChange={handleLocationSelected}
        />
        <CountriesList
          className="w-full shrink-0"
          bgColorClassName="bg-orange"
          countries={memberCountries}
        />
        <TabsList className="relative top-px mt-5 w-full flex-shrink-0">
          <TabsTrigger value="summary">{t('summary')}</TabsTrigger>
          <TabsTrigger value="terrestrial">{t('terrestrial')}</TabsTrigger>
          <TabsTrigger value="marine">{t('marine')}</TabsTrigger>
        </TabsList>
      </div>
      <div ref={containerRef} className="flex-grow overflow-y-auto">
        <TabsContent value="summary">
          <SummaryWidgets />
        </TabsContent>
        <TabsContent value="terrestrial">
          <TerrestrialWidgets />
        </TabsContent>
        <TabsContent value="marine">
          <MarineWidgets />
        </TabsContent>
      </div>
      <div className="shrink-0 border-t border-t-black bg-white px-4 py-5 md:px-8">
        <DetailsButton locationType={locationsData?.data[0]?.attributes.type} />
      </div>
    </Tabs>
  );
};

SidebarDetails.messages = [
  'containers.map-sidebar-main-panel',
  ...LocationSelector.messages,
  ...CountriesList.messages,
  ...DetailsButton.messages,
  ...SummaryWidgets.messages,
  ...MarineWidgets.messages,
];

export default SidebarDetails;
