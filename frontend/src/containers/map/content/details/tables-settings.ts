import GlobalRegionalTable from '@/containers/map/content/details/tables/global-regional';
import NationalHighSeasTable from '@/containers/map/content/details/tables/national-highseas';

const tablesSettings = {
  worldwideRegion: {
    locationTypes: ['worldwide', 'region'],
    component: GlobalRegionalTable,
    title: {
      worldwide: 'Marine Conservation at National and Regional Levels',
      region: 'Marine Conservation for {location}',
      // Fallback to use in case the slug/code isn't defined, in order to prevent crashes
      fallback: 'Marine Conservation',
    },
  },
  countryHighseas: {
    locationTypes: ['country', 'highseas'],
    component: NationalHighSeasTable,
    title: {
      country: 'Marine Conservation for {location}',
      highseas: 'Marine Conservation for High Seas',
      // Fallback to use in case the slug/code isn't defined, in order to prevent crashes
      fallback: 'Marine Conservation',
    },
  },
};

export default tablesSettings;
