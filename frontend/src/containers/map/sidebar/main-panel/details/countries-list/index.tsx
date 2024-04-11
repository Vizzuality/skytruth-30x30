import { useEffect, useState } from 'react';

import Link from 'next/link';

import { PAGES } from '@/constants/pages';
import { useMapSearchParams } from '@/containers/map/content/map/sync-settings';
import { cn } from '@/lib/classnames';

type CountriesListProps = {
  className?: HTMLDivElement['className'];
  bgColorClassName: string;
  countries: {
    code: string;
    name: string;
  }[];
};

const CountriesList: React.FC<CountriesListProps> = ({
  className,
  countries,
  bgColorClassName,
}) => {
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
          <span className="absolute right-0 -bottom-0.5 flex pl-2">
            <span className="block w-10 bg-gradient-to-l from-orange to-transparent" />
            <span className={cn('px-2', bgColorClassName)}>....</span>
            <span
              className={cn('cursor-pointer underline', bgColorClassName)}
              onClick={() => setListOpen(!isListOpen)}
            >
              View all countries
            </span>
          </span>
        )}
      </div>
      <div className="mt-2">
        <span className="cursor-pointer underline" onClick={() => setListOpen(!isListOpen)}>
          {isListOpen && <>Hide some countries</>}
        </span>
      </div>
    </div>
  );
};

export default CountriesList;
