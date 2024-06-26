import * as ToggleGroup from '@radix-ui/react-toggle-group';
import { VariantProps, cva } from 'class-variance-authority';
import { useTranslations } from 'next-intl';

import { cn } from '@/lib/classnames';
import { FCWithMessages } from '@/types';

import { FILTERS } from '../index';

const toggleVariants = cva(
  'focus-visible:ring-slate-950 data-[state=on]:text-slate-950 dark:ring-offset-slate-950 dark:data-[state=on]:bg-slate-950 justify-center whitespace-nowrap ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=on]:shadow-sm dark:focus-visible:ring-slate-300 dark:data-[state=on]:text-slate-50 group flex flex-1 items-center space-x-1 rounded-none border-r last:border-r-0 border-black py-2 whitespace-pre-line font-mono text-xs font-bold uppercase leading-none text-black last:border-l-0 h-full',
  {
    variants: {
      theme: {
        orange: 'data-[state=on]:bg-orange',
        blue: 'data-[state=on]:bg-blue',
      },
    },
    defaultVariants: {
      theme: 'orange',
    },
  }
);

type LocationTypeToggleProps = VariantProps<typeof toggleVariants> & {
  className?: HTMLDivElement['className'];
  defaultValue: keyof typeof FILTERS;
  value: keyof typeof FILTERS;
  onChange: (value: keyof typeof FILTERS) => void;
};

const LocationTypeToggle: FCWithMessages<LocationTypeToggleProps> = ({
  className,
  theme,
  defaultValue,
  value,
  onChange,
}) => {
  const t = useTranslations('containers.map-sidebar-main-panel');

  return (
    <ToggleGroup.Root
      className={cn(
        className,
        'grid w-full grid-cols-3 items-center justify-center border border-black'
      )}
      type="single"
      defaultValue={defaultValue}
      aria-label={t('locations-filter')}
      value={value}
      onValueChange={(value: keyof typeof FILTERS) => {
        if (!value) return;
        onChange(value);
      }}
    >
      <ToggleGroup.Item className={toggleVariants({ theme })} value="all" aria-label={t('all')}>
        {t('all')}
      </ToggleGroup.Item>
      <ToggleGroup.Item
        className={toggleVariants({ theme })}
        value="countryHighseas"
        aria-label={t('countries-and-high-seas')}
      >
        {t('countries-and-high-seas')}
      </ToggleGroup.Item>
      <ToggleGroup.Item
        className={toggleVariants({ theme })}
        value="regions"
        aria-label={t('regions')}
      >
        {t('regions')}
      </ToggleGroup.Item>
    </ToggleGroup.Root>
  );
};

LocationTypeToggle.messages = ['containers.map-sidebar-main-panel'];

export default LocationTypeToggle;
