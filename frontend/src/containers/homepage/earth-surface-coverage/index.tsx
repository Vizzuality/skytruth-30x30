import Image from 'next/image';

import { useTranslations } from 'next-intl';

import { FCWithMessages } from '@/types';

const EarthSurfaceCoverage: FCWithMessages = () => {
  const t = useTranslations('containers.homepage-earth-surface-coverage');

  return (
    <div className="relative mt-4 flex justify-center md:-mt-[80px]">
      <Image
        className="h-auto w-full max-w-4xl"
        src="/images/homepage/earth-surface-coverage.svg"
        alt={t('earth-surface-coverage')}
        width="0"
        height="0"
        sizes="100vw"
        priority
      />
    </div>
  );
};

EarthSurfaceCoverage.messages = ['containers.homepage-earth-surface-coverage'];

export default EarthSurfaceCoverage;
