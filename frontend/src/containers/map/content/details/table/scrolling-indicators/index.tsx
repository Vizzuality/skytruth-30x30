import { PropsWithChildren, useState } from 'react';

import { LuChevronLeft, LuChevronRight } from 'react-icons/lu';

import PositionalScroll, { ScrollPositions } from '@/components/positional-scroll';
import { cn } from '@/lib/classnames';

const COMMON_CLASSNAMES = {
  border: 'absolute top-0 z-20 h-full border-r border-black',
  iconWrapper: 'absolute top-0 -translate-y-full border border-black p-px',
  icon: 'h-4 w-4',
};

export type ScrollingIndicatorsProps = PropsWithChildren<{
  className?: string;
}>;

const ScrollingIndicators: React.FC<ScrollingIndicatorsProps> = ({ className, children }) => {
  const [xScrollPosition, setXScrollPosition] = useState<ScrollPositions>('start');

  return (
    <PositionalScroll className={cn(className)} onXScrollPositionChange={setXScrollPosition}>
      {xScrollPosition !== 'end' && (
        <span className={cn(COMMON_CLASSNAMES.border, 'right-0')}>
          <span className={cn(COMMON_CLASSNAMES.iconWrapper, '-right-px')}>
            <LuChevronRight className={COMMON_CLASSNAMES.icon} />
          </span>
        </span>
      )}
      {xScrollPosition !== 'start' && (
        <span className={cn(COMMON_CLASSNAMES.border, 'left-0')}>
          <span className={cn(COMMON_CLASSNAMES.iconWrapper, 'left-0')}>
            <LuChevronLeft className={COMMON_CLASSNAMES.icon} />
          </span>
        </span>
      )}
      {children}
    </PositionalScroll>
  );
};

export default ScrollingIndicators;
