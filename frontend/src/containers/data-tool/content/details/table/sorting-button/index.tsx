import { Column } from '@tanstack/react-table';
import { ArrowDownNarrowWide, ArrowUpNarrowWide, ArrowUpDown } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { GlobalRegionalTableColumns } from '@/containers/data-tool/content/details/tables/global-regional/columns';

const ICON_CLASSNAMES = 'h-4 w-4';

type SortingButtonProps = {
  column: Column<GlobalRegionalTableColumns, unknown>;
};

const SortingButton: React.FC<SortingButtonProps> = ({ column }) => {
  const isSorted = column.getIsSorted();

  return (
    <>
      {!isSorted && (
        <Button size="icon" variant="ghost" onClick={() => column.toggleSorting(false)}>
          <span className="sr-only">Sort ascending</span>
          <ArrowUpDown className={ICON_CLASSNAMES} aria-hidden />
        </Button>
      )}
      {isSorted === 'asc' && (
        <Button size="icon" variant="ghost" onClick={() => column.toggleSorting(true)}>
          <span className="sr-only">Sort descending</span>
          <ArrowDownNarrowWide className={ICON_CLASSNAMES} aria-hidden />
        </Button>
      )}
      {isSorted === 'desc' && (
        <Button size="icon" variant="ghost" onClick={() => column.clearSorting()}>
          <span className="sr-only">Clear sorting</span>
          <ArrowUpNarrowWide className={ICON_CLASSNAMES} aria-hidden />
        </Button>
      )}
    </>
  );
};

export default SortingButton;
