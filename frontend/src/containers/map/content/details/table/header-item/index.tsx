import { PropsWithChildren } from 'react';

import { cn } from '@/lib/classnames';

type HeaderItemProps = PropsWithChildren<{
  className?: string;
}>;

const HeaderItem: React.FC<HeaderItemProps> = ({ className, children }) => {
  return <span className={cn('flex items-center gap-0', className)}>{children}</span>;
};

export default HeaderItem;
