import { Column } from '@tanstack/react-table';
import { ArrowDownAZ, ArrowDownUp, ArrowDownZA } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { GlobalRegionalTableColumns } from '@/containers/data-tool/content/details/tables/global-regional/columns';

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
          <ArrowDownUp className="h-5 w-5" aria-hidden />
        </Button>
      )}
      {isSorted === 'asc' && (
        <Button size="icon" variant="ghost" onClick={() => column.toggleSorting(true)}>
          <span className="sr-only">Sort descending</span>
          <ArrowDownAZ className="h-5 w-5" aria-hidden />
        </Button>
      )}
      {isSorted === 'desc' && (
        <Button size="icon" variant="ghost" onClick={() => column.clearSorting()}>
          <span className="sr-only">Clear sorting</span>
          <ArrowDownZA className="h-5 w-5" aria-hidden />
        </Button>
      )}
    </>
  );
};

export default SortingButton;
