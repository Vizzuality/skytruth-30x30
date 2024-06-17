import { useTranslations } from 'next-intl';

import Layout from '@/layouts/error-page';
import { fetchTranslations } from '@/lib/i18n';
import { FCWithMessages } from '@/types';

const Error404Page: FCWithMessages = () => {
  const t = useTranslations('pages.404');

  return (
    <Layout
      pageTitle={t('page-title')}
      error={404}
      title={t('page-title')}
      description={t('page-description')}
    />
  );
};

Error404Page.messages = ['pages.404', ...Layout.messages];

export async function getStaticProps(context) {
  return {
    props: {
      messages: await fetchTranslations(context.locale, Error404Page.messages),
    },
  };
}

export default Error404Page;
