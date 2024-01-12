import Link from 'next/link';

import { Copyright } from 'lucide-react';

import { PAGES } from '@/constants/pages';

const Footer: React.FC = () => (
  <footer className="bg-black text-white">
    <div className="px-8 md:mx-auto md:max-w-7xl">
      <div className="flex w-full flex-col">
        <div className="my-6">
          <div className="my-6">
            <h2 className="text-4xl font-extrabold md:text-5xl">Would you like to know more?</h2>
            <Link
              href={PAGES.contact}
              className="mt-8 inline-block bg-white px-4 py-2.5 font-mono text-xs uppercase text-black"
            >
              Get in touch
            </Link>
          </div>
          <address className="my-4 flex flex-col gap-0.5 pt-6 text-xs not-italic text-black-300 md:my-8">
            <span>30x30 SkyTruth</span>
            <span>140–142 St No Street, New York, EC1V XXX, US</span>
            <a href="tel:+1 (0)23 0000 0000">+1 (0)23 0000 0000</a>
            <a href="mailto:info@example.com">info@example</a>
            <span>Registered in United States of America as 30x30 Tool Limited. 7792366</span>
          </address>
        </div>
      </div>
      <div className="flex w-full justify-between gap-8 border-t border-black-400 py-6 text-xs font-extralight">
        <div className="flex py-2">
          <Copyright className="mr-2 h-3.5 w-3.5" aria-hidden="true" /> SkyTruth 2023
        </div>
        <nav className="flex gap-6">
          <Link className="py-2" href={PAGES.privacyPolicy}>
            Privacy policy
          </Link>
          <Link className="py-2" href={PAGES.termsOfUse}>
            Terms of use
          </Link>
        </nav>
      </div>
      <span
        className="block h-[12vw] w-full bg-contain bg-bottom bg-no-repeat opacity-10 sm:mt-2 md:mx-auto md:mt-4 md:max-w-7xl xl:-mt-8"
        style={{
          backgroundImage: `url(/images/static-pages/bg-images/footer.svg)`,
        }}
      />
    </div>
  </footer>
);

export default Footer;
