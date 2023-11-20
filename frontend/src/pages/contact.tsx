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
        <div className="px-6 md:mx-auto md:max-w-7xl md:px-6 lg:px-10">
          <div className="my-8 grid grid-rows-1 gap-10 md:grid-cols-2 md:grid-rows-none">
            <div className="space-y-2">
              <h2 className="text-[70px] font-black leading-none">
                Want to <br />
                know more?
              </h2>
              <h3 className="text-xl font-black">Get it touch.</h3>
            </div>
            <ContactUsForm />
          </div>
        </div>
      </Layout>
    </>
  );
};

export default ContactUsPage;
