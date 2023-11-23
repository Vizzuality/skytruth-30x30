export type LogoType = {
  logo: string;
  alt: string;
  link?: string;
  description?: string;
  dimensions: [number, number];
};

export type LogosType = {
  [key: string]: LogoType[];
};
