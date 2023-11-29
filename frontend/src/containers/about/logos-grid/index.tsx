import Image from 'next/image';

import { VariantProps, cva } from 'class-variance-authority';

import { cn } from '@/lib/classnames';

import { LOGOS, LOGOS_PATH } from './constants';

const logosGridVariants = cva('', {
  variants: {
    columns: {
      2: 'md:grid-cols-2',
      4: 'md:grid-cols-4',
    },
  },
  defaultVariants: {
    columns: 4,
  },
});

type LogosGridProps = VariantProps<typeof logosGridVariants> & {
  className?: string;
  type: 'team' | 'funders';
};

const LogosGrid: React.FC<LogosGridProps> = ({ className, type, columns }) => (
  <div className={cn(className, 'grid gap-4 md:grid-cols-2', logosGridVariants({ columns }))}>
    {LOGOS[type].map(({ logo, alt, link, description, width, height }) => (
      <div key={logo} className="flex flex-col gap-4 pr-4">
        <span className="flex flex-1 items-center justify-center md:justify-start">
          {link && (
            <a target="_blank" href={link} rel="noopener noreferrer">
              <Image src={`${LOGOS_PATH}${logo}`} alt={alt} width={width} height={height} />
            </a>
          )}
          {!link && (
            <span>
              <Image src={`${LOGOS_PATH}${logo}`} alt={alt} width={width} height={height} />
            </span>
          )}
        </span>
        <span className="min-h-[60px] text-center md:text-left">{description}</span>
      </div>
    ))}
  </div>
);

export default LogosGrid;
