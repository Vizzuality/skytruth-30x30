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
