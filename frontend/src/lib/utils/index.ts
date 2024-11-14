import FORMATS from './formats';
import GETTERS from './getters';
import SETTERS from './setters';

const ALL = {
  ...GETTERS,
  ...SETTERS,
  ...FORMATS,
};

export default ALL;
