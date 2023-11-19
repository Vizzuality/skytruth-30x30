import { ReactNode } from 'react';

import { VariantProps, cva } from 'class-variance-authority';

import Icon from '@/components/ui/icon';
import { cn } from '@/lib/classnames';
import ArrowRight from '@/styles/icons/arrow-right.svg?sprite';

const BACKGROUND_IMAGES = {
  computer: '/images/static-pages/bg-images/card-1.png',
  clock: '/images/static-pages/bg-images/card-2.png',
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
  image = 'computer',
  onScrollClick,
}) => (
  <div className={cn('border-b border-black bg-black', introVariants({ color }))}>
    <div className="flex md:mx-auto md:max-w-7xl">
      <div className="mt-6 mb-2 flex flex-1 flex-col px-8">
        <div className="pr-10 text-6xl font-extrabold leading-tight">{title}</div>
        <div className="flex flex-1 flex-col justify-end pb-8">
          {description && <div className="pr-[20%] text-xl">{description}</div>}
        </div>
      </div>
      <div className="w-[40%] border-l border-black">
        <div className="flex h-full flex-col">
          <span
            className="aspect-square border-b border-black bg-cover bg-center bg-no-repeat mix-blend-multiply"
            style={{
              backgroundImage: `url(${BACKGROUND_IMAGES[image]})`,
            }}
          />
          <div className="flex h-full max-h-[50%] w-full justify-center py-6">
            <button type="button" onClick={onScrollClick}>
              <Icon icon={ArrowRight} className="h-[60%] rotate-90 fill-black" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default Intro;
