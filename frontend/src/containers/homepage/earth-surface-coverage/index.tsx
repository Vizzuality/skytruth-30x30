import { useLocale, useTranslations } from 'next-intl';

import { formatPercentage } from '@/lib/utils/formats';
import { FCWithMessages } from '@/types';

const EarthSurfaceCoverage: FCWithMessages = () => {
  const t = useTranslations('containers.homepage-earth-surface-coverage');
  const locale = useLocale();

  return (
    <div className="relative mt-4 flex w-full justify-center md:-mt-[80px]">
      <div className="max-h-sm aspect-square h-auto w-full max-w-sm rounded-full border border-orange p-12">
        <div className="flex h-full w-full items-center justify-center rounded-full bg-orange p-16 text-center font-mono text-xs font-medium">
          <div>
            {t.rich('percent-earth-surface-coverage', {
              b: (chunks) => <div className="mb-3 text-7xl font-bold">{chunks}</div>,
              percent: formatPercentage(locale, 71, { minimumFractionDigits: 0 }),
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

EarthSurfaceCoverage.messages = ['containers.homepage-earth-surface-coverage'];

export default EarthSurfaceCoverage;
