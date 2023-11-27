import { useRef } from 'react';

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
import Layout, { Sidebar, Content } from '@/layouts/static-page';

const About: React.FC = () => {
  const sections = {
    definition: {
      name: 'Definition',
      ref: useRef<HTMLDivElement>(null),
    },
    problem: {
      name: 'Problem',
      ref: useRef<HTMLDivElement>(null),
    },
    dataPartners: {
      name: 'Data Partners',
      ref: useRef<HTMLDivElement>(null),
    },
    futureObjectives: {
      name: 'Future Objectives',
      ref: useRef<HTMLDivElement>(null),
    },
    teamAndFunders: {
      name: 'Team & Funders',
      ref: useRef<HTMLDivElement>(null),
    },
  };

  const handleIntroScrollClick = () => {
    sections.definition?.ref?.current?.scrollIntoView({ behavior: 'smooth' });
  };

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
          title="Get involved."
          description="If you have questions, feedback, or interest in partnering on this project, get in touch at our contact page."
          color="purple"
          image="cta1"
          button={{
            text: 'Contact us',
            link: PAGES.contact,
          }}
        />
      }
    >
      <Sidebar sections={sections} />
      <Content>
        <Section ref={sections.definition.ref}>
          <SectionTitle>What is 30x30</SectionTitle>
          <SectionDescription>
            The 30x30 target has been <u>formally adopted by nearly every country</u> on earth, and
            ecosystem protection is being advanced and monitored by governments, NGOs, and local
            communities around the world.
          </SectionDescription>
        </Section>
        <Section ref={sections.problem.ref}>
          <SectionTitle>Why build a 30x30 hub?</SectionTitle>
          <SectionDescription>
            We are building the 30x30 hub to unify critical conservation tools and information
            streams in a single location that provides an entry point for getting informed and
            engaged in 30x30.
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
            dashboards. Each of the datasets represents a great amount of effort to assess and
            measure the effectiveness of ecosystem protections globally, and is critical to the
            success of 30x30.
          </SectionDescription>

          <SectionContent>
            <TwoColSubsection
              itemNum={1}
              itemTotal={3}
              title="The World Database on Protected Areas (WDPA)"
              description={
                <>
                  <u>The World Database on Protected Areas (WDPA)</u>, maintained by Protected
                  Planet, provides a comprehensive global inventory of the world&apos;s marine and
                  terrestrial protected areas. The WDPA provides official protected area boundaries
                  that have been self-reported by 245 countries around the world. WDPA data powers
                  our statistics on total area protected per country and globally.
                </>
              }
            >
              <Logo logo="protectedPlanet" />
            </TwoColSubsection>

            <TwoColSubsection
              itemNum={2}
              itemTotal={3}
              title="The Marine Protection Atlas (MPAtlas)"
              description={
                <>
                  <u>The Marine Protection Atlas (MPAtlas)</u>, which is produced by the Marine
                  Conservation Institute, builds on the WDPA dataset to provide a science-based,
                  independent assessment of the Stage of Establishment and Level of Protection per
                  marine protected area (MPA). MPAtlas data powers our statistics on Level of
                  Protection per MPA.
                </>
              }
            >
              <Logo logo="marineProtectionAtlas" />
            </TwoColSubsection>

            <TwoColSubsection
              itemNum={3}
              itemTotal={3}
              title="ProtectedSeas"
              description={
                <>
                  <u>ProtectedSeas</u> maintains the world’s largest database of regulatory
                  information for MPAs, with information on over 21,000 marine and coastal protected
                  areas around the world. ProtectedSeas data powers our Level of Fishing Protection
                  (LFP) score, which describes the degree to which fishing activity has been
                  restricted in MPAs.
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
            This web portal was built with support from the <u>Bloomberg Ocean Initiative</u>, so we
            started by focusing on marine protection, with the goal of creating a one-stop entry
            point for getting engaged and informed on 30x30.
          </SectionDescription>

          <SectionContent>
            <HighlightedText>
              Next, we&apos;re extending the hub to include{' '}
              <span className="text-black">terrestrial ecosystems</span>.
            </HighlightedText>
          </SectionContent>

          <StatsImage
            value="1M"
            description="Lorem ipsum dolor sit amet consectetur."
            image="stats4"
            color="purple"
          />
        </Section>
        <Section ref={sections.teamAndFunders.ref}>
          <SectionTitle>Who is behind this project?</SectionTitle>
          <SectionDescription>
            Lorem ipsum dolor sit amet consectetur. Rhoncus consectetur ultricies vestibulum proin
            suspendisse interdum. Lectus nulla vulputate neque malesuada.
          </SectionDescription>

          <TwoColSubsection title="Team" />
          <SectionContent>
            <LogosGrid type="team" columns={4} />
          </SectionContent>

          <TwoColSubsection title="Funders" />
          <SectionContent>
            <LogosGrid type="funders" columns={2} />
          </SectionContent>
        </Section>
      </Content>
    </Layout>
  );
};

export default About;
