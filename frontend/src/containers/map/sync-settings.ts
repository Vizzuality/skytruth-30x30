import { useQueryState } from 'next-usequerystate';
import { parseAsJson } from 'next-usequerystate/parsers';

const DEFAULT_SYNC_CONTENT_SETTINGS = {
  showDetails: false,
  tab: 'summary',
};

export const useSyncMapContentSettings = () => {
  return useQueryState(
    'content',
    parseAsJson<typeof DEFAULT_SYNC_CONTENT_SETTINGS>().withDefault(DEFAULT_SYNC_CONTENT_SETTINGS)
  );
};
