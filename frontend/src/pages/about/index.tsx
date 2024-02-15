import { useMemo, useRef } from 'react';

import { QueryClient, dehydrate } from '@tanstack/react-query';
import { GetServerSideProps } from 'next';

import Cta from '@/components/static-pages/cta';
import Intro from '@/components/static-pages/intro';
import Section, {
  SectionTitle,
  SectionDescription,
  SectionContent,
} from '@/components/static-pages/section';
import StatsImage from '@/components/static-pages/stats-image';
import TwoColSubsection from '@/components/static-pages/two-col-subsection';
import { PAGES } from '@/constants/pages';
import HighlightedText from '@/containers/about/highlighted-text';
import Logo from '@/containers/about/logo';
import LogosGrid from '@/containers/about/logos-grid';
import QuestionsList from '@/containers/about/questions-list';
import useScrollSpy from '@/hooks/use-scroll-spy';
import Layout, { Sidebar, Content } from '@/layouts/static-page';
import {
  getGetStaticIndicatorsQueryKey,
  getGetStaticIndicatorsQueryOptions,
} from '@/types/generated/static-indicator';
import { StaticIndicator, StaticIndicatorListResponse } from '@/types/generated/strapi.schemas';

export const getServerSideProps: GetServerSideProps = async () => {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    ...getGetStaticIndicatorsQueryOptions(),
  });

  const staticIndicatorsData = queryClient.getQueryData<StaticIndicatorListResponse>(
    getGetStaticIndicatorsQueryKey()
  );

  return {
    props: {
      staticIndicators: staticIndicatorsData || { data: [] },
      dehydratedState: dehydrate(queryClient),
    },
  };
};

const About: React.FC = ({
  staticIndicators,
}: {
  staticIndicators: StaticIndicatorListResponse;
}) => {
  const sections = {
    definition: {
      id: 'definition',
      name: 'Definition',
      ref: useRef<HTMLDivElement>(null),
    },
    problem: {
      id: 'problem',
      name: 'Problem',
      ref: useRef<HTMLDivElement>(null),
    },
    dataPartners: {
      id: 'data-partners',
      name: 'Data Partners',
      ref: useRef<HTMLDivElement>(null),
    },
    futureObjectives: {
      id: 'future-objectives',
      name: 'Future Objectives',
      ref: useRef<HTMLDivElement>(null),
    },
    teamAndFunders: {
      id: 'teams-and-funders',
      name: 'Team & Funders',
      ref: useRef<HTMLDivElement>(null),
    },
  };

  const scrollActiveId = useScrollSpy(Object.values(sections).map(({ id, ref }) => ({ id, ref })));

  const handleIntroScrollClick = () => {
    sections.definition?.ref?.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const protectedWatersIndicator: StaticIndicator = useMemo(() => {
    return staticIndicators?.data?.find(
      ({ attributes }) => attributes.slug === 'terrestrial-inland-areas-protected'
    )?.attributes;
  }, [staticIndicators]);

  return (
    <Layout
      title="About"
      hero={
        <Intro
          title="A global movement to protect 30% of the world’s lands and waters by 2030."
          color="purple"
          image="tablet"
          onScrollClick={handleIntroScrollClick}
        />
      }
      bottom={
        <Cta
          title="How can I get involved?"
          description="If you have questions, feedback, or interest in partnering on this project, please get in touch at our contact page."
          color="purple"
          image="cta1"
          button={{
            text: 'Get in touch',
            link: PAGES.contact,
          }}
        />
      }
    >
      <Sidebar sections={sections} activeSection={scrollActiveId} />
      <Content>
        <Section ref={sections.definition.ref}>
          <SectionTitle>What is 30x30</SectionTitle>
          <SectionDescription>
            30x30 is a global movement to <b>protect 30% of the world’s lands and waters by 2030</b>
            . This target has been{' '}
            <a
              className="underline"
              href="https://www.google.com/url?q=https://www.nytimes.com/2022/12/19/climate/biodiversity-cop15-montreal-30x30.html&sa=D&source=docs&ust=1707145082556030&usg=AOvVaw2LgZhM993iNNP-D3QR7CvL"
              target="_blank"
              rel="noopener noreferrer"
            >
              formally adopted by nearly every country
            </a>{' '}
            on earth, and ecosystem protection is being advanced and monitored by governments, NGOs,
            and local communities around the world.
          </SectionDescription>
        </Section>
        <Section ref={sections.problem.ref}>
          <SectionTitle>Why build a 30x30 hub?</SectionTitle>
          <SectionDescription>
            <p>
              With only a few years left between now and 2030, the world is pushing hard to preserve
              our critical ecosystems. Biodiversity conservation is moving faster than ever, and a
              host of new organizations, tools, and campaigns are emerging every day. Even for
              conservation professionals, it can be hard to keep up. And for anyone new to 30x30, it
              can be hard to know where to start or how to get involved.
            </p>
            <p className="mt-4 font-bold">
              We are building the 30x30 hub to unify these critical tools and information streams in
              a single location that provides an accessible entry point for getting informed and
              engaged in 30x30.
            </p>
          </SectionDescription>

          <SectionContent>
            <HighlightedText>
              We are a hub, not a destination. We want visitors to be able to answer{' '}
              <span className="text-black">three questions</span>.
            </HighlightedText>
            <QuestionsList
              questions={[
                'How is the world progressing toward 30x30?',
                'How much more of our lands and waters do we need to protect to reach the 30% goal?',
                'What resources are available to learn more about 30x30, get involved, and take action?',
              ]}
            />
          </SectionContent>
        </Section>
        <Section ref={sections.dataPartners.ref}>
          <SectionTitle>Who are our data partners?</SectionTitle>
          <SectionDescription>
            We depend on the expertise and efforts of key data partners to power our maps and
            dashboards. Each of these datasets represents a tremendous amount of effort to assess
            and measure the effectiveness of ecosystem protections globally, and is critical to the
            success of 30x30.
          </SectionDescription>

          <SectionContent>
            <TwoColSubsection
              itemNum={1}
              itemTotal={3}
              title="The World Database on Protected Areas (WDPA)"
              description={
                <>
                  <a
                    href="https://www.protectedplanet.net"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <u>The World Database on Protected Areas (WDPA)</u>
                  </a>
                  , maintained by Protected Planet, provides a comprehensive global inventory of the
                  world&apos;s marine and terrestrial protected areas. The WDPA provides official
                  protected area boundaries that have been self-reported by 245 countries around the
                  world. WDPA data powers our statistics on total area protected per country and
                  globally.
                </>
              }
            >
              <Logo logo="protectedPlanet" />
            </TwoColSubsection>
          </SectionContent>

          <SectionContent>
            <TwoColSubsection
              itemNum={2}
              itemTotal={3}
              title="The Marine Protection Atlas (MPAtlas)"
              description={
                <>
                  <a href="https://mpatlas.org" target="_blank" rel="noopener noreferrer">
                    <u>The Marine Protection Atlas (MPAtlas)</u>
                  </a>
                  , which is produced by the Marine Conservation Institute, builds on the WDPA
                  dataset to provide a science-based, independent assessment of the Stage of
                  Establishment and Level of Protection per marine protected area (MPA). MPAtlas
                  data powers our statistics on Level of Protection per MPA.
                </>
              }
            >
              <Logo logo="marineProtectionAtlas" />
            </TwoColSubsection>
          </SectionContent>

          <SectionContent>
            <TwoColSubsection
              itemNum={3}
              itemTotal={3}
              title="ProtectedSeas"
              description={
                <>
                  <a href="https://protectedseas.net" target="_blank" rel="noopener noreferrer">
                    <u>ProtectedSeas</u>
                  </a>{' '}
                  maintains the world’s largest database of regulatory information for MPAs, with
                  information on over 21,000 marine and coastal protected areas around the world.
                  ProtectedSeas data powers our Level of Fishing Protection (LFP) score, which
                  describes the degree to which fishing activity has been restricted in MPAs.
                </>
              }
            >
              <Logo logo="protectedSeas" />
            </TwoColSubsection>
          </SectionContent>
        </Section>
        <Section ref={sections.futureObjectives.ref}>
          <SectionTitle>What’s next for the 30x30 hub?</SectionTitle>
          <SectionDescription>
            This web portal was built with support from the{' '}
            <a
              href="https://www.bloomberg.org/environment/protecting-the-oceans/bloomberg-ocean/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <u>Bloomberg Ocean Initiative</u>
            </a>
            , so we started by focusing on marine protection, with the goal of creating a one-stop
            entry point for getting engaged and informed on 30x30.
          </SectionDescription>

          <SectionContent>
            <HighlightedText>
              Next, we&apos;re extending the hub to include{' '}
              <span className="text-black">terrestrial ecosystems</span>.
            </HighlightedText>
            <HighlightedText>
              Our goal of creating a <span className="text-black">one-stop entry point</span> for
              getting engaged and informed on 30x30.
            </HighlightedText>
          </SectionContent>

          <StatsImage
            value={protectedWatersIndicator?.value}
            description={protectedWatersIndicator?.description}
            sourceLink={protectedWatersIndicator?.source}
            image="stats4"
            color="purple"
          />
        </Section>
        <Section ref={sections.teamAndFunders.ref}>
          <SectionTitle>Who is behind this project?</SectionTitle>
          <SectionDescription>
            Discover our team and trusted partner companies. At the core of our accomplishments are
            the dedicated individuals who bring expertise and commitment to the 30x30 Project
          </SectionDescription>

          <SectionContent>
            <TwoColSubsection title="Team" />
            <LogosGrid className="md:mt-8" type="team" columns={4} />
          </SectionContent>

          <SectionContent>
            <TwoColSubsection title="Funders" />
            <LogosGrid className="md:mt-8" type="funders" columns={2} />
          </SectionContent>
        </Section>
      </Content>
    </Layout>
  );
};

export default About;
