import Icon from '@/components/ui/icon';
import DesignatedIcon from '@/styles/icons/designated.svg?sprite';
import ImplementedIcon from '@/styles/icons/implemented.svg?sprite';
import ManagedIcon from '@/styles/icons/managed.svg?sprite';
import ProposedIcon from '@/styles/icons/proposed.svg?sprite';

const ITEM_LIST_CLASSES = 'flex items-center space-x-2';
const ICON_CLASSES = 'h-7 w-7 border border-black rounded-full';

const PATTERNS = {
  proposed: ProposedIcon,
  managed: ManagedIcon,
  designated: DesignatedIcon,
  implemented: ImplementedIcon,
};

const EEZLayerLegend = (config: { items: { label: string; pattern: string }[] }) => {
  const { items } = config;

  return (
    <ul className="space-y-3 font-mono text-xs">
      {items.map(({ label, pattern }) => (
        <li key={pattern} className={ITEM_LIST_CLASSES}>
          <Icon icon={PATTERNS[pattern]} className={ICON_CLASSES} />
          <span>{label}</span>
        </li>
      ))}
    </ul>
  );
};

export default EEZLayerLegend;
