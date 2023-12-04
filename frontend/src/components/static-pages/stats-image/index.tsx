import { ReactNode } from 'react';

import Image from 'next/image';

import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/classnames';

const IMAGES = {
  stats1: '/images/static-pages/bg-images/stats-1.png',
  stats2: '/images/static-pages/bg-images/stats-2.png',
  stats3: '/images/static-pages/bg-images/stats-3.png',
  stats4: '/images/static-pages/bg-images/stats-4.png',
};

const statsImageVariants = cva('', {
  variants: {
    color: {
      orange: 'text-orange',
      purple: 'text-purple-500',
    },
    valueSize: {
      small: 'text-4xl',
      large: 'text-6xl',
    },
  },
  defaultVariants: {
    color: 'orange',
    valueSize: 'large',
  },
});

export type StatsImageProps = VariantProps<typeof statsImageVariants> & {
  value: string | ReactNode;
  description: string | ReactNode;
  image?: keyof typeof IMAGES;
};

const StatsImage: React.FC<StatsImageProps> = ({
  value,
  description,
  color,
  valueSize,
  image = 'stats3',
}) => (
  <div className="flex flex-row gap-8 pb-10 md:mt-20">
    <div className="flex w-full flex-col items-center justify-end gap-5 pt-5 text-center font-mono md:w-[32%]">
      <div className="flex flex-col md:max-w-[240px]">
        <span className={cn('font-bold', statsImageVariants({ color, valueSize }))}>{value}</span>
        <span className="mt-5 text-xs">{description}</span>
      </div>
    </div>
    <div className="hidden justify-end md:flex md:w-[68%]">
      <Image
        className="h-auto w-full max-w-4xl"
        src={IMAGES[image]}
        alt="Statistics image"
        width="0"
        height="0"
        sizes="100vw"
        priority
      />
    </div>
  </div>
);

export default StatsImage;
