import { BAR_BACKGROUNDS } from '@/components/charts/horizontal-bar-chart/constants';

export const ESTABLISHMENT_STAGES_CHART_BAR_BACKGROUNDS = {
  'proposed-committed': 'dots',
  implemented: 'crosses',
  designated: 'arrows',
  unknown: 'dashes',
  'actively-managed': 'dashes',
  'designated-unimplemented': 'arrows',
} satisfies Record<string, keyof typeof BAR_BACKGROUNDS>;
