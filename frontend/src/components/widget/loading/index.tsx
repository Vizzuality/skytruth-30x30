import { useTranslations } from 'next-intl';

import { FCWithMessages } from '@/types';

const Loading: FCWithMessages = () => {
  const t = useTranslations('components.widget');

  return (
    <div className="flex flex-col gap-8 py-12 px-14 text-center md:px-10 md:py-14">
      <p className="text-xs">{t('loading-data')}</p>
    </div>
  );
};

Loading.messages = ['components.widget'];

export default Loading;
