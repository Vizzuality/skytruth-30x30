import { nullable, number, tuple } from '@recoiljs/refine';
import { atom } from 'recoil';
import { urlSyncEffect } from 'recoil-sync';

export const bboxAtom = atom<readonly [number, number, number, number] | null | undefined>({
  key: 'bbox',
  default: null,
  effects: [
    urlSyncEffect({
      refine: nullable(tuple(number(), number(), number(), number())),
    }),
  ],
});
