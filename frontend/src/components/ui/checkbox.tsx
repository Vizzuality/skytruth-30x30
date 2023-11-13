import * as React from 'react';

import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { cva, type VariantProps } from 'class-variance-authority';
import { CheckIcon } from 'lucide-react';

import { cn } from '@/lib/classnames';

const checkboxVariants = cva('');

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> &
    VariantProps<typeof checkboxVariants>
>(({ className, name, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(checkboxVariants(), className, 'h-3.5 w-3.5 border-2 border-black')}
    defaultChecked
    id={name}
    name={name}
    {...props}
  >
    <CheckboxPrimitive.Indicator className="text-black">
      <CheckIcon className="h-2.5 w-2.5" strokeWidth={4} />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));

Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };
