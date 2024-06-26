import { ComponentProps, PropsWithChildren, useMemo } from 'react';

import { timeFormat } from 'd3-time-format';
import { useTranslations } from 'next-intl';

import { cn } from '@/lib/classnames';
import { FCWithMessages } from '@/types';

import TooltipButton from '../tooltip-button';

import Loading from './loading';
import NoData from './no-data';

type WidgetProps = {
  className?: string;
  title?: string;
  lastUpdated?: string;
  noData?: boolean;
  loading?: boolean;
  error?: boolean;
  messageError?: ComponentProps<typeof NoData>['message'];
  info?: ComponentProps<typeof TooltipButton>['text'];
  sources?: ComponentProps<typeof TooltipButton>['sources'];
};

const Widget: FCWithMessages<PropsWithChildren<WidgetProps>> = ({
  className,
  title,
  lastUpdated,
  noData = false,
  loading = false,
  error = false,
  messageError = undefined,
  info,
  sources,
  children,
}) => {
  const t = useTranslations('components.widget');

  const formattedLastUpdated = useMemo(
    () => timeFormat('%B %Y')(new Date(lastUpdated)),
    [lastUpdated]
  );

  const showNoData = !loading && (noData || error);

  return (
    <div className={cn('py-4 px-4 md:px-8', className)}>
      <div className="pt-2">
        <span className="flex items-baseline justify-between">
          {title && <h2 className="font-sans text-xl font-bold leading-tight">{title}</h2>}
          {(info || sources) && <TooltipButton text={info} sources={sources} />}
        </span>
        {!showNoData && lastUpdated && (
          <span className="text-xs">{t('updated-on', { date: formattedLastUpdated })}</span>
        )}
      </div>
      {loading && <Loading />}
      {showNoData && <NoData error={error} message={messageError} />}
      {!loading && !showNoData && <div>{children}</div>}
    </div>
  );
};

Widget.messages = ['components.widget', ...Loading.messages, ...NoData.messages];

export default Widget;
