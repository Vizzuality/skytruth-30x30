import { useRef } from 'react';

import Cta from '@/components/static-pages/cta';
import Intro from '@/components/static-pages/intro';
import Section from '@/components/static-pages/section';
import { PAGES } from '@/constants/pages';
import CardFilters from '@/containers/knowledge-hub/card-filters';
import CardList from '@/containers/knowledge-hub/card-list';
import Layout, { Content } from '@/layouts/static-page';

const KnowledgeHubPage = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  const handleIntroScrollClick = () => {
    sectionRef?.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <Layout
      title="Knowledge Hub"
      hero={
        <Intro
          title="Resources for 30x30 monitoring, planning and decision making."
          description="We intend to provide an entry point that is accessible and relevant to stakeholders at various levels, democratizing the conversation around 30x30 so everyone can participate in the process from a common starting point."
          color="green"
          onScrollClick={handleIntroScrollClick}
        />
      }
      bottom={
        <Cta
          title="Submit resources."
          description="Do you want to contribute to the Knowledge Hub and add a tool?"
          button={{
            text: 'Get in touch',
            link: PAGES.dataTool,
          }}
          color="green"
          image="cta2"
        />
      }
    >
      <Content>
        <Section ref={sectionRef} borderTop={false}>
          <div className="space-y-7">
            <h2 className="text-[52px] font-black leading-none">
              I am looking for...
              <br /> Data Tools.
            </h2>
            <div>
              <CardFilters />
              <CardList />
            </div>
          </div>
        </Section>
      </Content>
    </Layout>
  );
};

export default KnowledgeHubPage;
