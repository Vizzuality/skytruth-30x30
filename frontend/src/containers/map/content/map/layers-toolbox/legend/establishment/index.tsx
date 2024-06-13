import TooltipButton from '@/components/tooltip-button';
import Icon from '@/components/ui/icon';
import DesignatedIcon from '@/styles/icons/designated.svg';
import ImplementedIcon from '@/styles/icons/implemented.svg';
import ManagedIcon from '@/styles/icons/managed.svg';
import ProposedIcon from '@/styles/icons/proposed.svg';

const ITEM_LIST_CLASSES = 'flex items-center space-x-2';
const ICON_CLASSES = 'h-3.5 w-3.5 border border-black rounded-full';

const PATTERNS = {
  proposed: ProposedIcon,
  managed: ManagedIcon,
  designated: DesignatedIcon,
  implemented: ImplementedIcon,
};

const EstablishmentLayerLegend = (config: {
  items: { label: string; pattern: string; description?: string }[];
}) => {
  const { items } = config;

  return (
    <ul className="space-y-3 font-mono text-xs">
      {items.map(({ label, pattern, description }) => (
        <li key={pattern} className={ITEM_LIST_CLASSES}>
          <Icon icon={PATTERNS[pattern]} className={ICON_CLASSES} />
          <span className="flex">
            <span className="font-mono">{label}</span>
            {description && <TooltipButton className="-my-1" text={description} />}
          </span>
        </li>
      ))}
    </ul>
  );
};

export default EstablishmentLayerLegend;
