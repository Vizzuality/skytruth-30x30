import { PAGES } from '@/constants/pages';
import LinkCard from '@/containers/homepage/link-cards/link-card';

const LinkCards: React.FC = () => (
  <div className="flex flex-col gap-6">
    <LinkCard
      title="Progress Tracker"
      subtitle="A high-level, interactive map and dashboard communicating baselines and progress at global and national scales."
      description="The Progress Tracker enables users to understand global and national level progress at a glance, including accessible statistics and interactive data visualizations. The platform not only enables users to see the location of currently protected and conserved areas, but also allows them to overlay the location of key habitats and areas recommended by expert analysis as critical areas to protect for biodiversity."
      image="computer"
      color="orange"
      link={PAGES.progressTracker}
      linkLabel="Go to the Progress Tracker"
    />
    <LinkCard
      title="Conservation Builder"
      subtitle="A lightweight, interactive scenario building and visualization tool for evaluating conservation and protection scenarios that can provide potential pathways to achieving 30x30 goals."
      description="The Conservation Builder enables users to view existing protected areas, draw potential protected areas, dynamically illustrate the effects of proposed regions on progress toward 30x30, and quickly generate information about the proposed protected area from disparate data sources, including 30x30 research-based recommendations for areas to protect (e.g., Pew, Sala et al., Zhao et al., etc.) and the location of key habitats."
      image="pencilHolder"
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
