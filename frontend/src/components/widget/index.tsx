import { PropsWithChildren, useMemo } from 'react';

import { timeFormat } from 'd3-time-format';

import Loading from './loading';
import NoData from './no-data';
import SourceButton from './source-button';

type WidgetProps = {
  title: string;
  lastUpdated: string;
  source?: string;
  noData?: boolean;
  loading?: boolean;
};

const Widget: React.FC<PropsWithChildren<WidgetProps>> = ({
  title,
  lastUpdated,
  source,
  noData = false,
  loading = false,
  children,
}) => {
  const formattedLastUpdated = useMemo(
    () => timeFormat('%B %Y')(new Date(lastUpdated)),
    [lastUpdated]
  );

  const showNoData = !loading && noData;

  return (
    <div className="py-4 px-4 md:px-8">
      <div className="pt-2">
        <span className="flex justify-between">
          <h2 className="font-sans text-xl font-bold">{title}</h2>
          {!showNoData && <SourceButton source={source} />}
        </span>
        {!showNoData && <span className="text-xs">Data last updated: {formattedLastUpdated}</span>}
      </div>
      {loading && <Loading />}
      {showNoData && <NoData />}
      {!loading && !showNoData && <div>{children}</div>}
    </div>
  );
};

export default Widget;
