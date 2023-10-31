import localFont from 'next/font/local';

export const overpassMono = localFont({
  src: './overpass-mono/OverpassMono-VariableFont_wght.ttf',
  weight: '300 700',
  display: 'swap',
  variable: '--font-overpass-mono',
});

export const figtree = localFont({
  src: './figtree/Figtree-VariableFont_wght.ttf',
  weight: '300 900',
  display: 'swap',
  variable: '--font-figtree',
});
