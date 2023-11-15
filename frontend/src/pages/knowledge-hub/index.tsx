import { useCallback, useRef } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import Icon from '@/components/ui/icon';
import CardFilters from '@/containers/knowledge-hub/card-filters';
import CardList from '@/containers/knowledge-hub/card-list';
import Layout from '@/layouts/fullscreen';
import ArrowRight from '@/styles/icons/arrow-right.svg?sprite';

const KnowledgeHubPage = () => {
  const titleRef = useRef<HTMLHeadingElement>(null);

  const handleGoToList = useCallback(() => {
    if (titleRef.current) {
      titleRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  return (
    <Layout title="Knowledge Hub">
      <div className="border-b border-b-black bg-green">
        <div className="md:mx-auto md:max-w-7xl md:px-6 lg:px-10">
          <div className="grid grid-rows-2 md:grid-cols-2 md:grid-rows-none">
            <div className="order-2 space-y-20 p-8 md:order-none md:space-y-40 md:pl-0">
              <h1 className="text-[70px] font-black leading-none">
                Resources for 30x30 monitoring, planning and decision making.
              </h1>
              <p className="text-xl">
                We intend to provide an entry point that is accessible and relevant to stakeholders
                at various levels, democratizing the conversation around 30x30 so everyone can
                participate in the process from a common starting point.
              </p>
            </div>
            <div className="grid grid-rows-1 md:grid-rows-2 md:border-l md:border-l-black">
              <div className="relative">
                <Image
                  src="/images/knowledge-hub/knowledge-hub-header.webp"
                  fill
                  alt="Skytruth30x30 Knowledge Hub"
                  priority
                  className="hue-rotate-[270]"
                />
              </div>
              <div className="hidden md:flex md:items-center md:justify-center">
                <button type="button" onClick={handleGoToList}>
                  <Icon icon={ArrowRight} className="h-[148px] w-[145px] rotate-90 fill-black" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="my-20 w-full space-y-7 px-6 md:mx-auto md:max-w-7xl lg:px-10">
        <h2 className="text-[52px] font-black leading-none" ref={titleRef}>
          I am looking for...
          <br /> Data Tools.
        </h2>
        <div>
          <CardFilters />
          <CardList />
        </div>
      </div>
      <div className="border-t border-black bg-green p-10">
        <div className="md:mx-auto md:max-w-7xl md:px-6 lg:px-10">
          <div className="grid grid-rows-1 md:grid-cols-2 md:grid-rows-none">
            <div className="flex flex-col justify-center space-y-4">
              <h3 className="text-[64px] font-black leading-none">
                Submit <br />
                resources.
              </h3>
              <p>Do you want to contribute to the Knowledge Hub and add a tool?</p>
              <Link
                href="/contact-us"
                className="flex self-start bg-black px-8 py-4 font-mono uppercase text-white"
              >
                Get in touch
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default KnowledgeHubPage;
