/**
 * *`setOpacity`*
 * Set opacity
 * @param {Number} o
 * @param {Number} base
 * @returns {Number} opacity
 */
type SetOpacityProps = { o: number; base: number };
export const setOpacity = ({ o = 1, base = 1 }: SetOpacityProps) => {
  return o * base;
};

/**
 * *`setVisibility`*
 * Set visibility
 * @param {Boolean} v
 * @param {String} type
 * @returns {String | Boolean} visibility
 */
type SetVisibilityProps = { v: boolean; type: 'mapbox' | 'deck' };
export const setVisibility = ({ v = true, type = 'mapbox' }: SetVisibilityProps) => {
  if (type === 'mapbox') {
    return v ? 'visible' : 'none';
  }

  return v;
};

const SETTERS = {
  setOpacity,
  setVisibility,
} as const;

export default SETTERS;
