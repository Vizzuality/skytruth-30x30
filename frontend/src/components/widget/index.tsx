import { PropsWithChildren, useMemo } from 'react';

import { timeFormat } from 'd3-time-format';

import { cn } from '@/lib/classnames';

import Loading from './loading';
import NoData from './no-data';

type WidgetProps = {
  className?: string;
  title?: string;
  lastUpdated?: string;
  noData?: boolean;
  loading?: boolean;
  error?: boolean;
};

const Widget: React.FC<PropsWithChildren<WidgetProps>> = ({
  className,
  title,
  lastUpdated,
  noData = false,
  loading = false,
  error = false,
  children,
}) => {
  const formattedLastUpdated = useMemo(
    () => timeFormat('%B %Y')(new Date(lastUpdated)),
    [lastUpdated]
  );

  const showNoData = !loading && (noData || error);

  return (
    <div className={cn('py-4 px-4 md:px-8', className)}>
      <div className="pt-2">
        <span className="flex justify-between">
          {title && <h2 className="font-sans text-xl font-bold">{title}</h2>}
        </span>
        {!showNoData && lastUpdated && (
          <span className="text-xs">Data last updated: {formattedLastUpdated}</span>
        )}
      </div>
      {loading && <Loading />}
      {showNoData && <NoData error={error} />}
      {!loading && !showNoData && <div>{children}</div>}
    </div>
  );
};

export default Widget;
