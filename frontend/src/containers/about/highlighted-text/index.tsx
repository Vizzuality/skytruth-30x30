import { PropsWithChildren } from 'react';

import { cva, VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/classnames';

const highlightedTextVariants = cva('', {
  variants: {
    color: {
      green: 'text-green',
      purple: 'text-purple-500',
    },
  },
  defaultVariants: {
    color: 'purple',
  },
});

export type HighlightedTextProps = PropsWithChildren<VariantProps<typeof highlightedTextVariants>>;

const HighlightedText: React.FC<HighlightedTextProps> = ({ color, children }) => (
  <div
    className={cn(
      'mt-20 mb-16 max-w-[720px] text-5xl font-extrabold leading-tight',
      highlightedTextVariants({ color })
    )}
  >
    {children}
  </div>
);

export default HighlightedText;
