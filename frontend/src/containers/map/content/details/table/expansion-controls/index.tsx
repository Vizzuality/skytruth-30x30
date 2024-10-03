import { PropsWithChildren } from 'react';

import { Row } from '@tanstack/react-table';
import { GoTriangleDown } from 'react-icons/go';
import { LuCornerDownRight } from 'react-icons/lu';

import { GlobalRegionalTableColumns } from '@/containers/map/content/details/tables/global-regional/hooks';
import { NationalHighseasTableColumns } from '@/containers/map/content/details/tables/national-highseas/useColumns';
import { cn } from '@/lib/classnames';

export type ExpansionControlsProps = PropsWithChildren<{
  row: Row<GlobalRegionalTableColumns> | Row<NationalHighseasTableColumns>;
}>;

const ExpansionControls: React.FC<ExpansionControlsProps> = ({ row, children }) => {
  const { depth, getIsExpanded, getCanExpand, getToggleExpandedHandler } = row;

  const isParentRow = depth === 0;
  const isRowExpandable = getCanExpand();
  const isRowExpanded = getIsExpanded();
  const toggleExpanded = getToggleExpandedHandler();

  return (
    <div className="flex items-center">
      {isRowExpandable && (
        <button
          className="cursor pointer -ml-1.5 mr-1.5"
          onClick={toggleExpanded}
          aria-label={isRowExpanded ? 'Collapse sub-rows' : 'Expand sub-rows'}
        >
          <GoTriangleDown
            className={cn({
              'h-6 w-6 transition-transform': true,
              '-rotate-90': !isRowExpanded,
            })}
          />
        </button>
      )}
      <span
        className={cn({
          'flex items-center pl-3': !isParentRow,
          'ml-6': isParentRow && !isRowExpandable,
        })}
      >
        {depth > 0 && <LuCornerDownRight className="mr-3 h-5 w-5" />}
        {children}
      </span>
    </div>
  );
};

export default ExpansionControls;
