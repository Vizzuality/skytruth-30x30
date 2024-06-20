import { FCWithMessages } from '@/types';

import Details from './details';
import Modelling from './modelling';

export const PANEL_TYPES = {
  progress_tracker: 'progress-tracker',
  conservation_builder: 'conservation-builder',
};

const SIDEBAR_COMPONENTS = {
  [PANEL_TYPES.progress_tracker]: Details,
  [PANEL_TYPES.conservation_builder]: Modelling,
};

type PanelsProps = {
  type: keyof typeof PANEL_TYPES;
};

const MainPanel: FCWithMessages<PanelsProps> = ({ type }) => {
  const Component = SIDEBAR_COMPONENTS[type] || Details;

  return <Component />;
};

MainPanel.messages = [...Details.messages, ...Modelling.messages];

export default MainPanel;
