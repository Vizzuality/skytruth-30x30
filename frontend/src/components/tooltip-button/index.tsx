import { useState } from 'react';

import Linkify from 'react-linkify';

import { Info } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/classnames';

type TooltipButtonProps = {
  className?: string;
  text: string;
};

const TooltipButton: React.FC<TooltipButtonProps> = ({ className, text }) => {
  const [isTooltipOpen, setIsTooltipOpen] = useState<boolean>(false);

  if (!text) return null;

  return (
    <Popover open={isTooltipOpen} onOpenChange={setIsTooltipOpen}>
      <PopoverTrigger asChild>
        <Button className={cn('h-auto w-auto pl-1.5', className)} size="icon" variant="ghost">
          <span className="sr-only">Info</span>
          <Info className="h-4 w-4" aria-hidden="true" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="center"
        className="flex max-w-[300px] flex-col gap-6 font-mono text-xs"
      >
        <span>
          <Linkify
            componentDecorator={(href, text, key) => (
              <a
                className="break-all underline"
                href={href}
                key={key}
                target="_blank"
                rel="noopener noreferrer"
              >
                {text}
              </a>
            )}
          >
            {text}
          </Linkify>
        </span>
      </PopoverContent>
    </Popover>
  );
};

export default TooltipButton;
