import * as ToggleGroup from '@radix-ui/react-toggle-group';

import { cn } from '@/lib/classnames';

const TOGGLE_CLASSES =
  'focus-visible:ring-slate-950 data-[state=on]:text-slate-950 dark:ring-offset-slate-950 dark:data-[state=on]:bg-slate-950 justify-center whitespace-nowrap ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=on]:shadow-sm dark:focus-visible:ring-slate-300 dark:data-[state=on]:text-slate-50 group flex flex-1 items-center space-x-1 rounded-none border border-b-0 border-black py-3 px-6 font-mono text-xs font-bold uppercase leading-none text-black last:border-l-0 data-[state=on]:bg-orange w-1/2';

type LocationTypeToggleProps = {
  className?: HTMLDivElement['className'];
  value: string;
  onChange: (value: string) => void;
};

const LocationTypeToggle: React.FC<LocationTypeToggleProps> = ({ className, value, onChange }) => (
  <ToggleGroup.Root
    className={cn(className, 'flex w-full items-center justify-center border-b border-black')}
    type="single"
    defaultValue={value}
    aria-label="Locations filter"
    onValueChange={onChange}
  >
    <ToggleGroup.Item
      className={TOGGLE_CLASSES}
      value="countryHighseas"
      aria-label="EEZs & High Seas"
    >
      EEZs & High Seas
    </ToggleGroup.Item>
    <ToggleGroup.Item className={TOGGLE_CLASSES} value="regions" aria-label="Regions">
      Regions
    </ToggleGroup.Item>
  </ToggleGroup.Root>
);

export default LocationTypeToggle;
