import Script from 'next/script';

import ContactUsForm from '@/containers/contact/form';
import Layout from '@/layouts/fullscreen';

const ContactUsPage = () => {
  return (
    <>
      {/* <!-- Start of HubSpot Embed Code --> */}
      <Script id="hs-script-loader" async defer src="//js.hs-scripts.com/44434484.js"></Script>
      {/* <!-- End of HubSpot Embed Code --> */}
      <Layout title="Contact Us">
        <div className="flex h-full flex-col gap-10 px-6 pt-16 md:mx-auto md:max-w-7xl md:flex-row md:gap-20 md:px-6 lg:px-8">
          <div className="flex flex-col gap-10 md:w-[40%]">
            <div className="flex flex-grow flex-col gap-3">
              <h2 className="text-[70px] font-black leading-none">
                Want to <br />
                know more?
              </h2>
              <h3 className="text-xl font-black">Get it touch.</h3>
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

export default ContactUsPage;
