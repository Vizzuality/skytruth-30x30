import GlobalRegionalTable from '@/containers/data-tool/content/details/tables/global-regional';
import NationalHighSeasTable from '@/containers/data-tool/content/details/tables/national-highseas';

const tablesSettings = {
  worldwideRegion: {
    locationTypes: ['worldwide', 'region'],
    component: GlobalRegionalTable,
    title: {
      worldwide: 'Marine Conservation at National and Regional Levels',
      region: 'Marine Conservation for {location}',
    },
  },
  countryHighseas: {
    locationTypes: ['country', 'highseas'],
    component: NationalHighSeasTable,
    title: {
      country: 'Marine Conservation for {location}',
      highseas: 'Marine Conservation for High Seas',
    },
  },
};

export default tablesSettings;
