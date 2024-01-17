import Image from 'next/image';

const ICONS = {
  icon1: '/images/homepage/intro-icon-1.svg',
  icon2: '/images/homepage/intro-icon-2.svg',
};

type SidebarItemProps = {
  text: string;
  percentage: string | number;
  icon?: keyof typeof ICONS;
};

const SidebarItem: React.FC<SidebarItemProps> = ({ text, percentage, icon = 'icon1' }) => (
  <div className="flex flex-row gap-6 border-b border-white px-10 py-6">
    <div className="flex flex-1 flex-col gap-2 font-mono">
      <span className="text-6xl font-light">{percentage}%</span>
      <span className="text-xs">{text}</span>
    </div>
    <div className="items-en flex w-[64px] items-end">
      <Image
        className="h-auto w-full max-w-4xl"
        src={ICONS[icon]}
        alt="Statistics icon"
        width="0"
        height="0"
        sizes="100vw"
      />
    </div>
  </div>
);

export default SidebarItem;
