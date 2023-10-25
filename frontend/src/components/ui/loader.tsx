import { PropsWithChildren } from 'react';

import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/classnames';

export interface ContentLoaderProps extends PropsWithChildren {
  skeletonClassName?: string;
  data: unknown | undefined;
  isPlaceholderData: boolean;
  isFetching: boolean;
  isFetched: boolean;
  isError: boolean;
}

const ContentLoader = ({
  skeletonClassName,
  children,
  data,
  isPlaceholderData,
  isFetching,
  isFetched,
  isError,
}: ContentLoaderProps) => {
  return (
    <div className="relative">
      {isFetching && !isFetched && <Skeleton className={cn('h-20 w-full', skeletonClassName)} />}

      {isError && isFetched && !isFetching && 'Error'}

      {!isPlaceholderData && !isError && isFetched && !!data && children}

      {!isPlaceholderData && !isError && isFetched && !data && 'No data'}
    </div>
  );
};

export default ContentLoader;
