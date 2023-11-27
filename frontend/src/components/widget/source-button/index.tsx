import { useState } from 'react';

import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import ExternalLinkIcon from '@/styles/icons/external-link-square.svg';

type SourceButtonProps = {
  source: string;
};

const SourceButton: React.FC<SourceButtonProps> = ({ source }) => {
  const [isSourceOpen, setIsSourceOpen] = useState<boolean>(false);

  if (!source) return null;

  return (
    <Popover open={isSourceOpen} onOpenChange={setIsSourceOpen}>
      <PopoverTrigger asChild>
        <Button className="mt-1 h-auto w-auto flex items-start" size="icon" variant="ghost">
          <span className="sr-only">Source</span>
          <Icon icon={ExternalLinkIcon} className="h-5 w-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="center"
        side="left"
        className="flex max-w-[300px] flex-col gap-6 p-1 font-mono text-xs underline"
      >
        {source}
      </PopoverContent>
    </Popover>
  );
};

export default SourceButton;
