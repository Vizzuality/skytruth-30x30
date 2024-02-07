import { Column } from '@tanstack/react-table';

import TooltipButton from '@/components/tooltip-button';
import type { GlobalRegionalTableColumns } from '@/containers/map/content/details/tables/global-regional/useColumns';
import type { NationalHighseasTableColumns } from '@/containers/map/content/details/tables/national-highseas/useColumns';

type TableTooltipButtonProps = {
  column:
    | Column<GlobalRegionalTableColumns, unknown>
    | Column<NationalHighseasTableColumns, unknown>;
  tooltips: { [key: string]: string };
};

const TableTooltipButton: React.FC<TableTooltipButtonProps> = ({ column, tooltips }) => {
  return <TooltipButton text={tooltips[column.id]} />;
};

export default TableTooltipButton;
