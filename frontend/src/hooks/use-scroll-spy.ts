import { RefObject, useLayoutEffect, useState } from 'react';

type ScrollSpyItem = {
  id: string;
  ref: RefObject<HTMLDivElement>;
};

type ScrollSpyOptions = {
  overBounds: boolean;
};

const DEFAULT_OPTIONS = {
  overBounds: true,
  thresholdPercentage: 50,
};

const useScrollSpy = (items: ScrollSpyItem[], options?: ScrollSpyOptions) => {
  const [activeId, setActiveId] = useState<string | null>(null);

  useLayoutEffect(() => {
    const scrollListener = () => {
      const windowHeight = window.innerHeight;
      const viewingPosition = (DEFAULT_OPTIONS.thresholdPercentage * windowHeight) / 100;

      const itemsPositions = items.map(({ id, ref }) => {
        const element = ref?.current;
        if (!element) return null;

        const boundingRect = element.getBoundingClientRect();

        return {
          id,
          top: boundingRect.top,
          bottom: boundingRect.bottom,
        };
      });

      const activeItem = itemsPositions.find(({ top: itemTop, bottom: itemBottom }) => {
        return itemTop < viewingPosition && itemBottom > viewingPosition;
      });

      if (!activeItem?.id && (options?.overBounds || DEFAULT_OPTIONS.overBounds) === true) {
        const firstItem = itemsPositions[0];
        const lastItem = itemsPositions[itemsPositions.length - 1];

        if (viewingPosition < firstItem.top) {
          setActiveId(firstItem.id);
        }

        if (viewingPosition > lastItem.bottom) {
          setActiveId(lastItem.id);
        }
      } else {
        setActiveId(activeItem?.id);
      }
    };

    scrollListener();

    window.addEventListener('resize', scrollListener);
    window.addEventListener('scroll', scrollListener);

    return () => {
      window.removeEventListener('resize', scrollListener);
      window.removeEventListener('scroll', scrollListener);
    };
  }, [items, options]);

  return activeId;
};

export default useScrollSpy;
