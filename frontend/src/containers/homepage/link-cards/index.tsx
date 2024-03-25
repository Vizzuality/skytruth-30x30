import { PAGES } from '@/constants/pages';
import LinkCard from '@/containers/homepage/link-cards/link-card';

const LinkCards: React.FC = () => (
  <div className="flex flex-col gap-6">
    <LinkCard
      title="Progress Tracker"
      subtitle="An interactive map for tracking 30x30 progress and drawing new protected areas"
      description="This tool allows users to understand global progress toward 30x30 at a glance, draw new potential protected areas, and illustrate the effects of those proposed areas on national and global progress toward 30x30."
      image="computer"
      link={PAGES.progressTracker}
      linkLabel="Go to the Map"
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
