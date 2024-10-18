import Image from 'next/image';

import { Info } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { FCWithMessages } from '@/types';

const ICONS = {
  icon1: '/images/homepage/intro-icon-1.svg',
  icon2: '/images/homepage/intro-icon-2.svg',
};

type SidebarItemProps = {
  text: string;
  percentage: number | string;
  icon?: keyof typeof ICONS;
  onClickInfoButton?: () => void;
};

const SidebarItem: FCWithMessages<SidebarItemProps> = ({
  text,
  percentage,
  icon = 'icon1',
  onClickInfoButton,
}) => {
  const t = useTranslations('containers.homepage-intro');

  return (
    <div className="flex flex-row gap-6 border-b border-white px-10 py-6">
      <div className="flex flex-1 flex-col gap-2 font-mono">
        <div className="text-6xl font-light">{percentage}%</div>
        <div className="text-xs">
          {text}
          {!!onClickInfoButton && (
            <Button
              className="ml-1.5 h-auto w-auto align-middle hover:bg-transparent hover:text-white"
              size="icon"
              variant="ghost"
              onClick={onClickInfoButton}
            >
              <span className="sr-only">{t('info')}</span>
              <Info className="h-4 w-4" aria-hidden="true" />
            </Button>
          )}
        </div>
      </div>
      <div className="items-en flex w-[64px] items-end">
        <Image
          className="h-auto w-full max-w-4xl"
          src={ICONS[icon]}
          alt={t('statistics-icon')}
          width="0"
          height="0"
          sizes="100vw"
        />
      </div>
    </div>
  );
};

SidebarItem.messages = ['containers.homepage-intro'];

export default SidebarItem;
