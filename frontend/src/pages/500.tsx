import { useTranslations } from 'next-intl';

import Layout from '@/layouts/error-page';
import { fetchTranslations } from '@/lib/i18n';
import { FCWithMessages } from '@/types';

const Error500Page: FCWithMessages = () => {
  const t = useTranslations('pages.500');

  return (
    <Layout
      pageTitle={t('page-title')}
      error={500}
      title={t('page-title')}
      description={t('page-description')}
    />
  );
};

Error500Page.messages = ['pages.500', ...Layout.messages];

export async function getStaticProps(context) {
  return {
    props: {
      messages: await fetchTranslations(context.locale, Error500Page.messages),
    },
  };
}

export default Error500Page;
