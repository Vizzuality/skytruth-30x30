import Link from 'next/link';

import { cva, type VariantProps } from 'class-variance-authority';

import Icon from '@/components/ui/icon';
import { cn } from '@/lib/classnames';
import ArrowRight from '@/styles/icons/arrow-right.svg?sprite';

const BACKGROUND_IMAGES = {
  computer: '/images/static-pages/bg-images/card-1.png',
  magnifyingGlass: '/images/static-pages/bg-images/card-2.png',
};

const linkCardVariants = cva('', {
  variants: {
    color: {
      blue: 'bg-blue',
      green: 'bg-green',
    },
  },
  defaultVariants: {
    color: 'blue',
  },
});

type LinkCardProps = VariantProps<typeof linkCardVariants> & {
  title: string;
  subtitle: string;
  description: string;
  link: string;
  linkLabel: string;
  image?: keyof typeof BACKGROUND_IMAGES;
};

const LinkCard: React.FC<LinkCardProps> = ({
  title,
  subtitle,
  description,
  color,
  link,
  linkLabel,
  image = 'computer',
}) => (
  <div className={cn('flex flex-col border border-black md:flex-row', linkCardVariants({ color }))}>
    <div className="flex w-full flex-col gap-4 border-r border-black p-6 md:w-[50%]">
      <span className="mb-2 text-3xl font-extrabold">{title}</span>
      <span className="flex-1 text-lg">{subtitle}</span>
      <span>{description}</span>
    </div>
    <div className="flex flex-1 flex-col">
      <span
        className="aspect-square max-h-[160px] w-full flex-shrink-0 border-b border-t border-black bg-cover bg-center bg-no-repeat mix-blend-multiply md:max-h-[70%] md:border-t-0"
        style={{
          backgroundImage: `url(${BACKGROUND_IMAGES[image]})`,
        }}
      />
      <span className="flex max-h-[10%] min-h-[30%] items-center justify-end px-10 py-4 md:max-h-full md:py-0">
        <Link href={link} aria-label={linkLabel}>
          <Icon icon={ArrowRight} className="w-14" />
        </Link>
      </span>
    </div>
  </div>
);

export default LinkCard;
