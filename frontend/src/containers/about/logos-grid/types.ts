import { ImageProps } from 'next/image';

export type LogoType = Pick<ImageProps, 'alt' | 'width' | 'height'> & {
  logo: string;
  link?: string;
  description?: string;
};

export type LogosType = {
  [key: string]: LogoType[];
};
