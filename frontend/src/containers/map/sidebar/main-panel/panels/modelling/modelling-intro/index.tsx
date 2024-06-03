import { useEffect, useState } from 'react';

import Image from 'next/image';

import { useAtomValue } from 'jotai';

import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { drawStateAtom } from '@/containers/map/store';

const snapFormat = new Intl.NumberFormat(undefined, {
  minimumIntegerDigits: 2,
});

const ModellingIntro: React.FC = () => {
  const { active, status } = useAtomValue(drawStateAtom);
  const [current, setCurrent] = useState(1);
  const [api, setApi] = useState<CarouselApi>();

  useEffect(() => {
    if (!api) {
      return;
    }

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  useEffect(() => {
    let step = null;

    if (!api) {
      return;
    }

    if (active) {
      step = 2;
      setCurrent(step);
      api.scrollTo(step - 1);
    }

    if (status === 'drawing') {
      step = 3;
      setCurrent(step);
      api.scrollTo(step - 1);
    }
  }, [active, status, api]);

  return (
    <div className="flex flex-col gap-4 py-4 px-4 md:px-8">
      <span className="text-xl font-bold">
        <span className="text-blue-600">How to draw a custom area</span> on the map, using the
        drawing functionality?
      </span>

      <Carousel
        setApi={setApi}
        opts={{
          duration: 0,
        }}
        className="space-y-1"
      >
        <div className="flex items-end justify-between">
          <span className="font-mono text-lg">
            {snapFormat.format(current)}—
            <span className="text-black/20">
              {api ? snapFormat.format(api.scrollSnapList().length) : '-'}
            </span>
          </span>
          <div className="space-x-2">
            <CarouselPrevious className="static translate-y-0" />
            <CarouselNext className="static translate-y-0" />
          </div>
        </div>
        <CarouselContent>
          <CarouselItem>
            <div className="space-y-2">
              <Image
                className="w-full"
                src="/images/drawing-steps/01.webp"
                alt="Step 01"
                quality={100}
                width={375}
                height={143}
              />
              <p>
                Click on the <span className="font-bold">Draw a shape</span> button located above,
                in the blue section at the top of the panel.
              </p>
            </div>
          </CarouselItem>
          <CarouselItem>
            <div className="space-y-2">
              <Image
                className="w-full"
                src="/images/drawing-steps/02.webp"
                alt="Step 02"
                quality={100}
                width={375}
                height={143}
              />
              <p>
                <span className="font-bold">Start drawing on the map</span> by clicking. Each click
                adds an anchor point. All sides of the polygon are connected through anchor points.
              </p>
            </div>
          </CarouselItem>
          <CarouselItem>
            <div className="space-y-2">
              <Image
                className="w-full"
                src="/images/drawing-steps/03.webp"
                alt="Step 03"
                quality={100}
                width={375}
                height={143}
              />
              <p>
                <span className="font-bold">Close the polygon</span> you drew by clicking on the
                first anchor point you added at the beginning or by double clicking on the last
                anchor point.
              </p>
            </div>
          </CarouselItem>
        </CarouselContent>
      </Carousel>
    </div>
  );
};

export default ModellingIntro;
