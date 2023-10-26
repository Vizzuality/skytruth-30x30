import { useQueryState } from 'next-usequerystate';
import { parseAsJson } from 'next-usequerystate/parsers';

const DEFAULT_SYNC_CONTENT_SETTINGS: {
  details: boolean;
} = {
  details: false,
};

export const useSyncDataToolContentSettings = () => {
  return useQueryState(
    'content',
    parseAsJson<typeof DEFAULT_SYNC_CONTENT_SETTINGS>().withDefault(DEFAULT_SYNC_CONTENT_SETTINGS)
  );
};
