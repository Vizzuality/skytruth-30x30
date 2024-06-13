import { PropsWithChildren, useEffect, useState } from 'react';

import { cn } from '@/lib/classnames';

type ScrollPositions = 'start' | 'middle' | 'end';

export type PositionalScrollProps = PropsWithChildren<{
  className?: string;
  onXScrollPositionChange?: (position: ScrollPositions) => void;
  onYScrollPositionChange?: (position: ScrollPositions) => void;
}>;

const PositionalScroll: React.FC<PositionalScrollProps> = ({
  className,
  onXScrollPositionChange,
  onYScrollPositionChange,
  children,
}) => {
  const [xPosition, setXPosition] = useState<ScrollPositions>('start');
  const [yPosition, setYPosition] = useState<ScrollPositions>('start');

  useEffect(() => {
    if (!onXScrollPositionChange) return;
    onXScrollPositionChange(xPosition);
  }, [onXScrollPositionChange, xPosition]);

  useEffect(() => {
    if (!onYScrollPositionChange) return;
    onYScrollPositionChange(yPosition);
  }, [onYScrollPositionChange, yPosition]);

  const handleScroll = (event) => {
    const target = event.target;

    const xAtStartPosition = target.scrollLeft === 0;
    const xAtEndPosition = target.scrollLeft === target.scrollWidth - target.clientWidth;

    const yAtStartPosition = target.scrollTop === 0;
    const yAtEndPosition = target.scrollTop === target.scrollHeight - target.clientHeight;

    const calculatedXPosition = xAtStartPosition ? 'start' : xAtEndPosition ? 'end' : 'middle';
    const calculatedYPosition = yAtStartPosition ? 'start' : yAtEndPosition ? 'end' : 'middle';

    if (calculatedXPosition !== xPosition) setXPosition(calculatedXPosition);
    if (calculatedYPosition !== yPosition) setYPosition(calculatedYPosition);
  };

  return (
    <div className={cn(className)} onScroll={handleScroll}>
      {children}
    </div>
  );
};

export default PositionalScroll;
