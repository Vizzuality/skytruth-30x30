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
  <p className="my-6 max-w-[660px]">{children}</p>
);

export type SectionContentProps = PropsWithChildren<{ className?: string }>;

const SectionContent: React.FC<SectionContentProps> = ({ className, children }) => (
  <div className={cn('my-6', className)}>{children}</div>
);

export type SectionProps = PropsWithChildren<{
  borderTop?: boolean;
}>;

const Section = forwardRef<HTMLDivElement, SectionProps>(({ borderTop = true, children }, ref) => (
  <div
    ref={ref}
    className={cn('w-full border-black py-6 md:mx-auto md:max-w-7xl', {
      'border-t': borderTop,
    })}
  >
    {children}
  </div>
));

Section.displayName = 'Section';

export { SectionTitle, SectionDescription, SectionContent };

export default Section;
