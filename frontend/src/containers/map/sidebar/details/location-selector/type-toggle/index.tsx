import * as ToggleGroup from '@radix-ui/react-toggle-group';

import { cn } from '@/lib/classnames';

import { FILTERS } from '../index';

const TOGGLE_CLASSES =
  'focus-visible:ring-slate-950 data-[state=on]:text-slate-950 dark:ring-offset-slate-950 dark:data-[state=on]:bg-slate-950 justify-center whitespace-nowrap ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=on]:shadow-sm dark:focus-visible:ring-slate-300 dark:data-[state=on]:text-slate-50 group flex flex-1 items-center space-x-1 rounded-none border-r last:border-r-0 border-black py-2 whitespace-pre-line font-mono text-xs font-bold uppercase leading-none text-black last:border-l-0 data-[state=on]:bg-orange h-full';

type LocationTypeToggleProps = {
  className?: HTMLDivElement['className'];
  defaultValue: keyof typeof FILTERS;
  value: keyof typeof FILTERS;
  onChange: (value: keyof typeof FILTERS) => void;
};

const LocationTypeToggle: React.FC<LocationTypeToggleProps> = ({
  className,
  defaultValue,
  value,
  onChange,
}) => (
  <ToggleGroup.Root
    className={cn(
      className,
      'grid w-full grid-cols-3 items-center justify-center border border-black'
    )}
    type="single"
    defaultValue={defaultValue}
    aria-label="Locations filter"
    value={value}
    onValueChange={(value: keyof typeof FILTERS) => {
      if (!value) return;
      onChange(value);
    }}
  >
    <ToggleGroup.Item className={TOGGLE_CLASSES} value="all" aria-label="All">
      All
    </ToggleGroup.Item>
    <ToggleGroup.Item
      className={TOGGLE_CLASSES}
      value="countryHighseas"
      aria-label="Countries & High Seas"
    >
      Countries & High Seas
    </ToggleGroup.Item>
    <ToggleGroup.Item className={TOGGLE_CLASSES} value="regions" aria-label="Regions">
      Regions
    </ToggleGroup.Item>
  </ToggleGroup.Root>
);

export default LocationTypeToggle;
