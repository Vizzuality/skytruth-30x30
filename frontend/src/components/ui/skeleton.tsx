import { cn } from '@/lib/classnames';

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('animate-pulse bg-slate-100 dark:bg-slate-800', className)} {...props} />
  );
}

export { Skeleton };
