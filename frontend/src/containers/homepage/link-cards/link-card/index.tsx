import Link from 'next/link';

import { cva, type VariantProps } from 'class-variance-authority';

import Icon from '@/components/ui/icon';
import { cn } from '@/lib/classnames';
import ArrowRight from '@/styles/icons/arrow-right.svg?sprite';

const BACKGROUND_IMAGES = {
  computer: '/images/static-pages/bg-images/card-1.png',
  clock: '/images/static-pages/bg-images/card-2.png',
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
  <div className={cn('flex flex-row border border-black', linkCardVariants({ color }))}>
    <div className="flex w-[50%] flex-col gap-4 border-r border-black p-6">
      <span className="mb-2 text-3xl font-extrabold">{title}</span>
      <span className="flex-1 text-lg">{subtitle}</span>
      <span>{description}</span>
    </div>
    <div className="flex flex-1 flex-col">
      <span
        className="aspect-square border-b border-black bg-cover bg-center bg-no-repeat mix-blend-multiply"
        style={{
          backgroundImage: `url(${BACKGROUND_IMAGES[image]})`,
        }}
      />
      <span className="flex min-h-[30%] items-center justify-end px-10">
        <Link href={link} aria-label={linkLabel}>
          <Icon icon={ArrowRight} className="w-14" />
        </Link>
      </span>
    </div>
  </div>
);

export default LinkCard;
