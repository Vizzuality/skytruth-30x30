import { useEffect, useState } from 'react';

import Link from 'next/link';

import { useTranslations } from 'next-intl';

import { PAGES } from '@/constants/pages';
import { useMapSearchParams } from '@/containers/map/content/map/sync-settings';
import { cn } from '@/lib/classnames';
import { FCWithMessages } from '@/types';

type CountriesListProps = {
  className?: HTMLDivElement['className'];
  bgColorClassName: string;
  countries: {
    code: string;
    name: string;
  }[];
};

const CountriesList: FCWithMessages<CountriesListProps> = ({
  className,
  countries,
  bgColorClassName,
}) => {
  const t = useTranslations('containers.map-sidebar-main-panel');

  const [isListOpen, setListOpen] = useState(false);
  const searchParams = useMapSearchParams();

  useEffect(() => {
    setListOpen(false);
  }, [countries]);

  if (!countries?.length) return null;

  return (
    <div className={cn('font-mono text-xs leading-5', className)}>
      <div
        className={cn({
          'relative overflow-hidden': true,
          'max-h-[38px]': !isListOpen,
          'max-h-full': isListOpen,
        })}
      >
        {countries.map(({ code, name }, idx) => (
          <span key={code}>
            <Link
              className="underline"
              href={`${PAGES.progressTracker}/${code}?${searchParams.toString()}`}
            >
              {name}
            </Link>
            {idx < countries?.length - 1 && <>, </>}
          </span>
        ))}
        {!isListOpen && (
          <span className="absolute -bottom-0.5 right-0 flex pl-2">
            <span className="block w-10 bg-gradient-to-l from-orange to-transparent" />
            <span className={cn('px-2', bgColorClassName)}>....</span>
            <span
              className={cn('cursor-pointer underline', bgColorClassName)}
              onClick={() => setListOpen(!isListOpen)}
            >
              {t('view-all-countries')}
            </span>
          </span>
        )}
      </div>
      <div className="mt-2">
        <span className="cursor-pointer underline" onClick={() => setListOpen(!isListOpen)}>
          {isListOpen && t('hide-some-countries')}
        </span>
      </div>
    </div>
  );
};

CountriesList.messages = ['containers.map-sidebar-main-panel'];

export default CountriesList;
