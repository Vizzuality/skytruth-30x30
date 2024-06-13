declare global {
  interface Window {
    // ? As we are using explicitily window to access the `gtag` property we need to declare it before using it
    gtag: UniversalAnalytics.ga;
  }
}

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

// ? If your module exports nothing, you will need this line. Otherwise, delete it */
export {};
