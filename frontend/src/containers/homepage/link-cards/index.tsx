import { PAGES } from '@/constants/pages';
import LinkCard from '@/containers/homepage/link-cards/link-card';

const LinkCards: React.FC = () => (
  <div className="flex flex-col gap-6">
    <LinkCard
      title="Progress Tracker"
      subtitle="An interactive map for tracking 30x30 progress and drawing new protected areas"
      description="This tool allows users to understand global progress toward 30x30 at a glance, draw new potential protected areas, and illustrate the effects of those proposed areas on national and global progress toward 30x30."
      image="computer"
      color="orange"
      link={PAGES.progressTracker}
      linkLabel="Go to the Progress Tracker"
    />
    <LinkCard
      title="Conservation Builder"
      subtitle="Leo pellentesque ornare libero libero commodo vitae adipiscing."
      description="Lorem ipsum dolor sit amet consectetur. Leo pellentesque ornare libero libero commodo vitae adipiscing viverra purus. In ut ultricies facilisis quam. Ultricies urna convallis pharetra sagittis est. Rhoncus vitae condimentum nulla urna."
      image="computer"
      color="blue"
      link={PAGES.conservationBuilder}
      linkLabel="Go to the Conservation Builder"
    />
    <LinkCard
      title="Knowledge Hub"
      subtitle="A navigation hub guiding users toward other helpful 30x30 resources"
      description="The Knowledge Hub will link users to other 30x30 focused organizations and efforts, making it easier for stakeholders at all levels to discover and make use of advanced resources for monitoring, planning, and decision making."
      image="magnifyingGlass"
      color="green"
      link={PAGES.knowledgeHub}
      linkLabel="Go to the Knowledge Hub"
    />
  </div>
);

export default LinkCards;
