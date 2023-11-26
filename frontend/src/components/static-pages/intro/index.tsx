import { ReactNode } from 'react';

import { VariantProps, cva } from 'class-variance-authority';

import Icon from '@/components/ui/icon';
import { cn } from '@/lib/classnames';
import ArrowRight from '@/styles/icons/arrow-right.svg?sprite';

const BACKGROUND_IMAGES = {
  computer2: '/images/static-pages/bg-images/card-1.png',
  magnifyingGlass: '/images/static-pages/bg-images/card-4.png',
};

const introVariants = cva('', {
  variants: {
    color: {
      green: 'bg-green',
      purple: 'bg-purple-400',
    },
  },
  defaultVariants: {
    color: 'green',
  },
});

type IntroProps = VariantProps<typeof introVariants> & {
  title: string;
  description?: string | ReactNode;
  image?: string;
  onScrollClick: () => void;
};

const Intro: React.FC<IntroProps> = ({
  title,
  description,
  color,
  image = 'computer2',
  onScrollClick,
}) => (
  <div className={cn('bg-black', introVariants({ color }))}>
    <div className="flex flex-col md:mx-auto md:max-w-7xl md:flex-row">
      <div className="mt-6 mb-2 flex flex-1 flex-col px-8">
        <div className="pr-10 text-5xl font-extrabold leading-tight md:text-6xl">{title}</div>
        <div className="flex flex-1 flex-col justify-end pb-8">
          {description && <div className="pr-[20%] text-xl">{description}</div>}
        </div>
      </div>
      <div className="w-full border-l border-black md:w-[40%]">
        <div className="flex h-full flex-col">
          <span
            className="aspect-square max-h-[200px] border-b border-black bg-cover bg-center bg-no-repeat md:max-h-full"
            style={{
              backgroundImage: `url(${BACKGROUND_IMAGES[image]})`,
            }}
          />
          <div className="flex h-full max-h-[140px] w-full justify-center py-6 md:max-h-[50%] md:min-h-0">
            <button
              className="flex w-full items-center justify-center md:w-auto"
              type="button"
              onClick={onScrollClick}
            >
              <Icon icon={ArrowRight} className="h-[80%] rotate-90 fill-black md:h-[60%]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default Intro;
