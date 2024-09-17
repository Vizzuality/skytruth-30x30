import { PropsWithChildren, forwardRef } from 'react';

import { cn } from '@/lib/classnames';

export type SectionTitleProps = PropsWithChildren;

const SectionTitle: React.FC<SectionTitleProps> = ({ children }) => (
  <h2 className="my-6 mt-2 max-w-[610px] text-4xl font-extrabold md:mb-8 md:text-5xl">
    {children}
  </h2>
);

export type SectionDescriptionProps = PropsWithChildren;

const SectionDescription: React.FC<SectionDescriptionProps> = ({ children }) => (
  <div className="my-6 max-w-[660px]">{children}</div>
);

export type SectionContentProps = PropsWithChildren<{ className?: string }>;

const SectionContent: React.FC<SectionContentProps> = ({ className, children }) => (
  <div className={cn('my-6', className)}>{children}</div>
);

export type SectionProps = PropsWithChildren<{
  className?: string;
  borderTop?: boolean;
}>;

const Section = forwardRef<HTMLDivElement, SectionProps>(
  ({ className, borderTop = true, children }, ref) => (
    <div
      ref={ref}
      className={cn('w-full border-black py-6 px-8 md:mx-auto md:mb-20 md:max-w-7xl md:px-0', {
        'border-t': borderTop,
        [className]: true,
      })}
    >
      {children}
    </div>
  )
);

Section.displayName = 'Section';

export { SectionTitle, SectionDescription, SectionContent };

export default Section;
