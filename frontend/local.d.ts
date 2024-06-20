declare module '*.svg';
declare module '*.svg' {
  const content: {
    id: string;
    viewBox: string;
    content: string;
    node: SVGSymbolElement;
  };
  export default content;
}
declare module '*.png';
declare module '*.jpg';

import en from './translations/en.json';
type Messages = typeof en;

declare global {
  // Use type safe message keys with `next-intl`
  interface IntlMessages extends Messages {}
}
