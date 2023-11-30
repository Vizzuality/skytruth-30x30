import { useQueryState } from 'next-usequerystate';
import { parseAsJson } from 'next-usequerystate/parsers';

const DEFAULT_SYNC_CONTENT_SETTINGS: {
  showDetails: boolean;
} = {
  showDetails: false,
};

export const useSyncMapContentSettings = () => {
  return useQueryState(
    'content',
    parseAsJson<typeof DEFAULT_SYNC_CONTENT_SETTINGS>().withDefault(DEFAULT_SYNC_CONTENT_SETTINGS)
  );
};
