import Details from './details';
import Modelling from './modelling';

export const SIDEBAR_TYPES = {
  progress_tracker: 'progress-tracker',
  conservation_builder: 'conservation-builder',
};

const SIDEBAR_COMPONENTS = {
  [SIDEBAR_TYPES.progress_tracker]: Details,
  [SIDEBAR_TYPES.conservation_builder]: Modelling,
};

type MainPanelProps = {
  type: keyof typeof SIDEBAR_TYPES;
};

const MainPanel: React.FC<MainPanelProps> = ({ type }) => {
  const Component = SIDEBAR_COMPONENTS[type] || Details;

  return <Component />;
};

export default MainPanel;
