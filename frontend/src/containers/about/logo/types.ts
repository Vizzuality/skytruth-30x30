import { ImageProps } from 'next/image';

export type LogoType = Pick<ImageProps, 'alt' | 'width' | 'height'> & {
  logo: string;
  alt: string;
  link?: string;
};

export type LogosType = {
  [key: string]: LogoType;
};
