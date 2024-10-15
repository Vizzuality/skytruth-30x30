import { PropsWithChildren } from 'react';

import { Row } from '@tanstack/react-table';
import { useTranslations } from 'next-intl';
import { GoTriangleDown } from 'react-icons/go';
import { LuCornerDownRight } from 'react-icons/lu';

import { GlobalRegionalTableColumns } from '@/containers/map/content/details/tables/global-regional/hooks';
import { NationalHighseasTableColumns } from '@/containers/map/content/details/tables/national-highseas/hooks';
import { cn } from '@/lib/classnames';

export type ExpansionControlsProps = PropsWithChildren<{
  row: Row<GlobalRegionalTableColumns> | Row<NationalHighseasTableColumns>;
}>;

const ExpansionControls: React.FC<ExpansionControlsProps> = ({ row, children }) => {
  const t = useTranslations('containers.map');

  const { depth, getIsExpanded, getCanExpand, getToggleExpandedHandler } = row;

  const isParentRow = depth === 0;
  const isRowExpandable = getCanExpand();
  const isRowExpanded = getIsExpanded();
  const toggleExpanded = getToggleExpandedHandler();

  return (
    <div className="flex max-w-full items-center">
      {isRowExpandable && (
        <button
          type="button"
          className="cursor pointer -ml-px mr-1.5"
          onClick={toggleExpanded}
          aria-label={isRowExpanded ? t('collapse-sub-rows') : t('expand-sub-rows')}
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
          'w-full overflow-hidden whitespace-normal': true,
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
