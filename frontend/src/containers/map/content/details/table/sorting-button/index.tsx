import { Column } from '@tanstack/react-table';
import { ArrowDownNarrowWide, ArrowUpNarrowWide, ArrowUpDown } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { GlobalRegionalTableColumns } from '@/containers/map/content/details/tables/global-regional/useColumns';
import { NationalHighseasTableColumns } from '@/containers/map/content/details/tables/national-highseas/useColumns';

const BUTTON_CLASSNAMES = '-ml-4';
const ICON_CLASSNAMES = 'h-4 w-4';

type SortingButtonProps = {
  column:
    | Column<GlobalRegionalTableColumns, unknown>
    | Column<NationalHighseasTableColumns, unknown>;
};

const SortingButton: React.FC<SortingButtonProps> = ({ column }) => {
  const isSorted = column.getIsSorted();

  return (
    <>
      {!isSorted && (
        <Button
          className={BUTTON_CLASSNAMES}
          size="icon"
          variant="ghost"
          onClick={() => column.toggleSorting(false)}
        >
          <span className="sr-only">Sort ascending</span>
          <ArrowUpDown className={ICON_CLASSNAMES} aria-hidden />
        </Button>
      )}
      {isSorted === 'asc' && (
        <Button
          className={BUTTON_CLASSNAMES}
          size="icon"
          variant="ghost"
          onClick={() => column.toggleSorting(true)}
        >
          <span className="sr-only">Sort descending</span>
          <ArrowDownNarrowWide className={ICON_CLASSNAMES} aria-hidden />
        </Button>
      )}
      {isSorted === 'desc' && (
        <Button
          className={BUTTON_CLASSNAMES}
          size="icon"
          variant="ghost"
          onClick={() => column.clearSorting()}
        >
          <span className="sr-only">Clear sorting</span>
          <ArrowUpNarrowWide className={ICON_CLASSNAMES} aria-hidden />
        </Button>
      )}
    </>
  );
};

export default SortingButton;
