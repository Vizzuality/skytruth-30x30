import Script from 'next/script';

import { pick } from 'lodash-es';
import { useTranslations } from 'next-intl';

import ContactUsForm from '@/containers/contact/form';
import Layout from '@/layouts/fullscreen';
import { fetchTranslations } from '@/lib/i18n';
import { FCWithMessages } from '@/types';

const ContactUsPage: FCWithMessages = () => {
  const t = useTranslations('pages.contact');

  return (
    <>
      {/* <!-- Start of HubSpot Embed Code --> */}
      <Script id="hs-script-loader" async defer src="//js.hs-scripts.com/44434484.js"></Script>
      {/* <!-- End of HubSpot Embed Code --> */}
      <Layout title={t('page-title')}>
        <div className="flex h-full flex-col gap-10 px-6 pt-16 md:mx-auto md:max-w-7xl md:flex-row md:gap-20 md:px-6 lg:px-8">
          <div className="flex flex-col gap-10 md:w-[40%]">
            <div className="flex flex-grow flex-col gap-3">
              <h1 className="text-[70px] font-black leading-none">
                {t.rich('want-know-more', {
                  br: () => <br />,
                })}
              </h1>
              <p className="text-xl font-black">{t('get-in-touch')}</p>
            </div>
            <div className="hidden flex-grow items-end pr-10 md:flex md:h-full">
              <span className="h-full w-full bg-contain bg-bottom md:bg-[url('/images/static-pages/bg-images/cta-3.png')] md:bg-no-repeat" />
            </div>
          </div>
          <div className="overflow-y-scroll pb-10 md:-mr-4 md:pr-4 md:pl-2">
            <ContactUsForm />
          </div>
        </div>
      </Layout>
    </>
  );
};

ContactUsPage.messages = ['pages.contact', ...ContactUsForm.messages];

export async function getServerSideProps(context) {
  return {
    props: {
      messages: pick(await fetchTranslations(context.locale), ContactUsPage.messages),
    },
  };
}

export default ContactUsPage;
