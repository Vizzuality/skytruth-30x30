import { useTranslations } from 'next-intl';

import { FCWithMessages } from '@/types';

type NoDataProps = {
  error?: boolean;
  message?: string;
};

const NoData: FCWithMessages<NoDataProps> = ({
  error = false,
  message = 'The current widget is not visible due to an error.',
}) => {
  const t = useTranslations('components.widget');

  return (
    <div className="flex flex-col gap-8 py-12 px-14 text-center md:px-10 md:py-14">
      <p className="text-xs">
        {error && message}
        {!error && t('no-data-available')}
      </p>
    </div>
  );
};

NoData.messages = ['components.widget'];

export default NoData;
