import { useRef } from 'react';

import Cta from '@/components/static-pages/cta';
import Section, {
  SectionTitle,
  SectionDescription,
  SectionContent,
} from '@/components/static-pages/section';
import StatsImage from '@/components/static-pages/stats-image';
import TwoColSubsection from '@/components/static-pages/two-col-subsection';
import { PAGES } from '@/constants/pages';
import EarthSurfaceCoverage from '@/containers/homepage/earth-surface-coverage';
import InteractiveMap from '@/containers/homepage/interactive-map';
import Intro from '@/containers/homepage/intro';
import LinkCards from '@/containers/homepage/link-cards';
import Layout, { Content, Sidebar } from '@/layouts/static-page';

const Home: React.FC = () => {
  const sections = {
    services: {
      name: 'Services',
      ref: useRef<HTMLDivElement>(null),
    },
    context: {
      name: 'Context',
      ref: useRef<HTMLDivElement>(null),
    },
    impact: {
      name: 'Impact',
      ref: useRef<HTMLDivElement>(null),
    },
  };

  const handleIntroScrollClick = () => {
    sections.services?.ref?.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <Layout
      theme="dark"
      hideLogo={true}
      hero={<Intro onScrollClick={handleIntroScrollClick} />}
      bottom={
        <Cta
          title="Take action."
          description="Do you want to contribute to the Knowledge Hub and add a tool?"
          button={{
            text: 'Go to the map',
            link: PAGES.map,
          }}
        />
      }
    >
      <Sidebar sections={sections} />
      <Content>
        <Section ref={sections.services.ref}>
          <SectionTitle>An entry point for 30x30</SectionTitle>
          <SectionDescription>
            In partnership with <b>Bloomberg Ocean Initiative, SkyTruth</b> is developing an entry
            point for 30x30 stakeholders. The tools below enable you to track the world’s progress
            toward 30x30, draw new protected areas, and find additional tools and organizations
            fighting for the protection of marine and terrestrial ecosystems{' '}
            <i>(terrestrial coming soon)</i>.
          </SectionDescription>
          <SectionContent>
            <LinkCards />
          </SectionContent>
        </Section>

        <Section ref={sections.context.ref}>
          <SectionTitle>The path to protecting 30% of the ocean</SectionTitle>
          <SectionContent>
            <TwoColSubsection
              title="How big is the ocean?"
              description="Covering 71 percent of the Earth’s surface, the ocean and its biodiversity stabilizes
              our climate, provides 51% of the oxygen we need to survive, and provides food and
              livelihoods for billions of people."
            >
              <EarthSurfaceCoverage />
            </TwoColSubsection>
          </SectionContent>

          <TwoColSubsection
            title="How big is 30% the ocean?"
            description="Thirty percent (30%) of the ocean is the equivalent of South America, North America,
              Europe and Russia combined. This means 70 million square kilometres."
          />

          <SectionContent className="mt-10">
            <InteractiveMap />
          </SectionContent>
        </Section>

        <Section ref={sections.impact.ref}>
          <SectionTitle>What&apos;s at stake?</SectionTitle>

          <TwoColSubsection
            title="Biodiversity"
            itemNum={1}
            itemTotal={3}
            description={
              <>
                <p>
                  Today, 8 percent of the world’s ocean and 15 percent of its land area are
                  protected. Wildlife populations - mammals, birds, fish, and other species - have{' '}
                  <u>decreased by nearly 70% since 1970</u>, with up to{' '}
                  <u>1 million species threatened with extinction</u>.
                </p>
                <p className="mt-4 font-bold">
                  Protecting 30 percent of the world’s land and ocean habitats by 2030 will help
                  these threatened species recover and survive, preserving them for future
                  generations.
                </p>
              </>
            }
          />

          <StatsImage
            value={
              <>
                More than <br /> 42,000
              </>
            }
            description="Species threatened with extinction."
            image="stats1"
            valueSize="small"
          />

          <TwoColSubsection
            title="Climate"
            itemNum={2}
            itemTotal={3}
            description={
              <>
                <p>
                  Earth’s climate and biodiversity are inextricably linked. A stable climate helps
                  ecosystems thrive, and protected ecosystems help slow rising global temperatures
                  and buffer us from the worst impacts of climate change, including floods,
                  wildfires, and food insecurity.
                </p>
                <p className="mt-4 font-bold">
                  Protecting 30 percent of Earths’ biodiversity will not only preserve vital
                  ecosystems, it will keep massive amounts of carbon out of the atmosphere and give
                  us a fighting chance to prevent and adapt to the worst effects of climate change.
                </p>
              </>
            }
          />

          <StatsImage
            value="93%"
            description={
              <>
                Of the Earth’s CO2 are estimated to be stored and cycled by marine ecosystems.{' '}
                <a
                  className="inline underline"
                  href="https://www.eea.europa.eu/publications/carbon-stocks-and-sequestration-rates"
                  target="_blank"
                >
                  Source
                </a>
              </>
            }
            image="stats2"
          />

          <TwoColSubsection
            title="Lives &amp; Livelihoods"
            itemNum={3}
            itemTotal={3}
            description={
              <>
                <p>
                  From fisheries, to forests, to agriculture, to tourism, 30x30 envisions a world
                  where critical habitats are sustained and protected, continuing to provide flood
                  protection, pollinators for crops, and fish and other food resources for billions
                  of people.
                </p>
                <p className="mt-4 font-bold">
                  Protecting 30 percent of Earth’s lands and waters will help safeguard the
                  resources we need for future generations to survive and flourish in a better
                  world.
                </p>
              </>
            }
          />

          <StatsImage
            value="100M"
            description={
              <>
                Of healthy and productive land were degraded between 2015 and 2019, impacting the
                lives of 1.3 billion people.{' '}
                <a
                  className="inline underline"
                  href="https://www.un.org/sustainabledevelopment/biodiversity/"
                  target="_blank"
                >
                  Source
                </a>
              </>
            }
            image="stats3"
          />
        </Section>
      </Content>
    </Layout>
  );
};

export default Home;
