import { createMedia } from '@artsy/fresnel';

import tailwindConfig from '@/lib/tailwind-config';

const breakpoints = Object.entries(tailwindConfig.theme.screens).reduce(
  (res, [key, value]) => ({
    ...res,
    [key as keyof typeof tailwindConfig.theme.screens]: Number.parseInt(
      (value as string).replace('px', '')
    ),
  }),
  {
    zero: 0,
  } as Record<keyof typeof tailwindConfig.theme.screens | 'zero', number>
);

const AppMedia = createMedia({
  breakpoints,
});

// Make styles for injection into the header of the page
export const mediaStyles = AppMedia.createMediaStyle();

export const { Media, MediaContextProvider } = AppMedia;
