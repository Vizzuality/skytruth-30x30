import { PropsWithChildren, useCallback, useEffect, useRef, useState } from 'react';

import { cn } from '@/lib/classnames';

export type ScrollPositions = 'start' | 'middle' | 'end' | 'no-scroll';

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
  const ref = useRef<HTMLDivElement | null>();

  const [xPosition, setXPosition] = useState<ScrollPositions>('start');
  const [yPosition, setYPosition] = useState<ScrollPositions>('start');

  const handleScroll = useCallback(() => {
    const target = ref.current;

    if (!target) {
      return;
    }

    const xAtStartPosition = target.scrollLeft === 0;
    const xAtEndPosition = target.scrollLeft === target.scrollWidth - target.clientWidth;

    const yAtStartPosition = target.scrollTop === 0;
    const yAtEndPosition = target.scrollTop === target.scrollHeight - target.clientHeight;

    let calculatedXPosition: ScrollPositions = 'middle';
    if (xAtStartPosition && xAtEndPosition) {
      calculatedXPosition = 'no-scroll';
    } else if (xAtStartPosition) {
      calculatedXPosition = 'start';
    } else if (xAtEndPosition) {
      calculatedXPosition = 'end';
    }

    let calculatedYPosition: ScrollPositions = 'middle';
    if (yAtStartPosition && yAtEndPosition) {
      calculatedYPosition = 'no-scroll';
    } else if (yAtStartPosition) {
      calculatedYPosition = 'start';
    } else if (yAtEndPosition) {
      calculatedYPosition = 'end';
    }

    setXPosition(calculatedXPosition);
    setYPosition(calculatedYPosition);
  }, []);

  // TODO: improve this
  // Regularly recomputes the scroll position to make sure that if the size of the content has
  // changed (independently from the scroll), we're still providing accurate information.
  useEffect(() => {
    setInterval(() => handleScroll(), 1000);
  }, [handleScroll]);

  useEffect(() => {
    if (!onXScrollPositionChange) return;
    onXScrollPositionChange(xPosition);
  }, [onXScrollPositionChange, xPosition]);

  useEffect(() => {
    if (!onYScrollPositionChange) return;
    onYScrollPositionChange(yPosition);
  }, [onYScrollPositionChange, yPosition]);

  return (
    <div ref={ref} className={cn(className)} onScroll={handleScroll}>
      {children}
    </div>
  );
};

export default PositionalScroll;
