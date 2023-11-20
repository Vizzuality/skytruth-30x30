import Link from 'next/link';

import { cva, VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/classnames';

const BACKGROUND_IMAGES = {
  cta1: '/images/static-pages/bg-images/cta-1.svg',
  cta2: '/images/static-pages/bg-images/cta-2.svg',
};

const ctaVariants = cva('', {
  variants: {
    color: {
      orange: 'bg-orange',
      green: 'bg-green',
      purple: 'bg-purple-500',
    },
  },
  defaultVariants: {
    color: 'orange',
  },
});

export type CtaProps = VariantProps<typeof ctaVariants> & {
  title: string;
  description: string;
  button: {
    text: string;
    link: string;
  };
  image?: keyof typeof BACKGROUND_IMAGES;
};

const Cta: React.FC<CtaProps> = ({ title, description, button, color, image = 'cta1' }) => (
  <div className={cn(ctaVariants({ color }))}>
    <div className="grid w-full gap-10 px-8 md:mx-auto md:max-w-7xl md:grid-cols-2">
      <div className="my-10 flex flex-col gap-4 md:my-32">
        <div className="text-6xl font-extrabold">{title}</div>
        <div className="mt-4">{description}</div>
        <div className="relative mt-3">
          <Link
            href={button.link}
            className="inline-block bg-black px-8 py-3 font-mono text-xs uppercase text-white"
          >
            {button.text}
          </Link>
        </div>
      </div>
      <div className="hidden overflow-hidden md:flex">
        <span
          className="block h-full w-full bg-left-top bg-no-repeat"
          style={{
            backgroundImage: `url(${BACKGROUND_IMAGES[image]})`,
          }}
        />
      </div>
    </div>
  </div>
);

export default Cta;
