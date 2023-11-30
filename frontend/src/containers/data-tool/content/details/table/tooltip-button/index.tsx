import { useState } from 'react';

import { Column } from '@tanstack/react-table';
import { Info } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { GlobalRegionalTableColumns } from '@/containers/data-tool/content/details/tables/global-regional/useColumns';
import { NationalHighseasTableColumns } from '@/containers/data-tool/content/details/tables/national-highseas/useColumns';

type TooltipButtonProps = {
  column:
    | Column<GlobalRegionalTableColumns, unknown>
    | Column<NationalHighseasTableColumns, unknown>;
  tooltips: { [key: string]: string[] };
};

const TooltipButton: React.FC<TooltipButtonProps> = ({ column, tooltips }) => {
  const [isTooltipOpen, setIsTooltipOpen] = useState<boolean>(false);

  const tooltip = tooltips[column.id];

  if (!tooltip) return null;

  return (
    <Popover open={isTooltipOpen} onOpenChange={setIsTooltipOpen}>
      <PopoverTrigger asChild>
        <Button className="mt-1 h-auto w-auto pl-2" size="icon" variant="ghost">
          <span className="sr-only">Info</span>
          <Info className="h-4 w-4" aria-hidden="true" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="center"
        className="flex max-w-[300px] flex-col gap-6 font-mono text-xs"
      >
        {tooltip}
      </PopoverContent>
    </Popover>
  );
};

export default TooltipButton;
