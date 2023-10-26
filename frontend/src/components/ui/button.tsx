import * as React from 'react';

import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/classnames';

const buttonVariants = cva(
  'inline-flex items-center justify-center font-black uppercase transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'bg-black text-white hover:bg-slate-900 ring-offset-white focus-visible:ring-black',
        // destructive:
        //   'bg-red-500 text-slate-50 hover:bg-red-500/90',
        // outline:
        //   'border border-slate-200 bg-white hover:bg-slate-100 hover:text-slate-900',
        // secondary:
        //   'bg-slate-100 text-slate-900 hover:bg-slate-100/80',
        ghost: 'hover:bg-gray-50 hover:text-gray-900 focus-visible:ring-black',
        // link: 'text-slate-900 underline-offset-4 hover:underline',
        white: 'bg-white border border-black',
        'sidebar-details':
          'bg-blue text-black text-black text-sm justify-start text-left text-sm hover:brightness-90 font-bold uppercase md:px-8 focus-visible:ring-black',
        'text-link': 'text-sm font-semibold uppercase underline focus-visible:ring-black',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'px-2 py-2',
        // lg: 'h-11 px-8',
        icon: 'h-10 w-10',
        'icon-sm': 'h-6 w-6',
        full: 'h-full w-full',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
