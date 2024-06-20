import { useTranslations } from 'next-intl';

import { FCWithMessages } from '@/types';

const ChartLegend: FCWithMessages = () => {
  const t = useTranslations('components.chart-conservation');

  return (
    <div className="mt-2 ml-8 flex justify-between gap-3">
      <span className="inline-flex items-center gap-3">
        <span className="block h-[2px] w-10 border-b-2 border-violet"></span>
        <span>{t('historical-trend')}</span>
      </span>
      <span className="inline-flex items-center gap-3">
        <span className="block h-[2px] w-10 border-b-2 border-dashed border-violet"></span>
        <span>{t('future-projection')}</span>
      </span>
    </div>
  );
};

ChartLegend.messages = ['components.chart-conservation'];

export default ChartLegend;
