export type LogoType = {
  logo: string;
  alt: string;
  dimensions: [number, number];
};

export type LogosType = {
  [key: string]: LogoType;
};
