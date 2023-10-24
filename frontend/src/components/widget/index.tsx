import { PropsWithChildren } from 'react';

type WidgetProps = {
  title: string;
  lastUpdated: string;
};

const Widget: React.FC<PropsWithChildren<WidgetProps>> = ({ title, lastUpdated, children }) => {
  return (
    <div className="py-4 px-4 md:px-8">
      <div className="pt-2">
        <h2 className="font-sans text-xl font-bold">{title}</h2>
        <span className="text-xs">Data last updated: {lastUpdated}</span>
      </div>
      <div>{children}</div>
    </div>
  );
};

export default Widget;
