import { BAR_BACKGROUNDS } from '@/components/charts/horizontal-bar-chart/constants';

export const ESTABLISHMENT_STAGES_CHART_BAR_BACKGROUNDS = {
  'designated-implemented': 'dots',
  'designated-unimplemented': 'crosses',
  'propose-committed': 'arrows',
} satisfies Record<string, keyof typeof BAR_BACKGROUNDS>;
