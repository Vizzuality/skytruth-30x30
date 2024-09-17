import { useMemo } from 'react';

import Image from 'next/image';

import { VariantProps, cva } from 'class-variance-authority';
import { useTranslations } from 'next-intl';

import { cn } from '@/lib/classnames';
import { FCWithMessages } from '@/types';

import { LOGOS_PATH } from './constants';

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

const LogosGrid: FCWithMessages<LogosGridProps> = ({ className, type, columns }) => {
  const t = useTranslations('containers.logos-grid');

  const LOGOS = useMemo(
    () => ({
      team: [
        {
          logo: 'skytruth.png',
          alt: 'SkyTruth',
          link: 'https://skytruth.org/',
          description: t('skytruth-description'),
          width: 100,
          height: 75,
        },
        {
          logo: 'vizzuality.png',
          alt: 'Vizzuality',
          link: 'https://www.vizzuality.com/',
          description: t('vizzuality-description'),
          width: 186,
          height: 47,
        },
        {
          logo: 'cea.png',
          alt: 'CEA Consulting',
          link: 'https://www.ceaconsulting.com/',
          description: t('cea-description'),
          width: 191,
          height: 38,
        },
        {
          logo: 'ocean-advocate.png',
          alt: 'An Ocean Advocate',
          link: 'https://www.anoceanadvocate.com/',
          description: t('ocean-advocate-description'),
          width: 104,
          height: 87,
        },
      ],
      funders: [
        {
          logo: 'bloomberg.png',
          alt: 'Bloomberg Philanthropies Ocean Initiative',
          link: 'https://www.bloomberg.org/environment/protecting-the-oceans/bloomberg-ocean/',
          description: t('bloomberg-description'),
          width: 384,
          height: 49,
        },
      ],
    }),
    [t]
  );

  return (
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
          <span className="min-h-[60px] max-w-[250px] text-center md:text-left">{description}</span>
        </div>
      ))}
    </div>
  );
};

LogosGrid.messages = ['containers.logos-grid'];

export default LogosGrid;
