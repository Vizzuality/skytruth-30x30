import { PropsWithChildren, useMemo } from 'react';

import { timeFormat } from 'd3-time-format';

import SourceButton from './source-button';

type WidgetProps = {
  title: string;
  lastUpdated: string;
  source?: string;
};

const Widget: React.FC<PropsWithChildren<WidgetProps>> = ({ title, lastUpdated, source, children }) => {
  const formattedLastUpdated = useMemo(
    () => timeFormat('%B %Y')(new Date(lastUpdated)),
    [lastUpdated]
  );

  return (
    <div className="py-4 px-4 md:px-8">
      <div className="pt-2">
        <span className="flex justify-between">
          <h2 className="font-sans text-xl font-bold">{title}</h2>
          <SourceButton source={source} />
        </span>
        <span className="text-xs">Data last updated: {formattedLastUpdated}</span>
      </div>
      <div>{children}</div>
    </div>
  );
};

export default Widget;
