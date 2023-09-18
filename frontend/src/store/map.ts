import { nullable, number, tuple, object, array, optional, bool } from '@recoiljs/refine';
import { atom } from 'recoil';
import { urlSyncEffect } from 'recoil-sync';

import { Layer, LayerSettings } from '@/types/layer';

// Bounding box of the map
export const bboxAtom = atom<readonly [number, number, number, number] | null | undefined>({
  key: 'bbox',
  default: null,
  effects: [
    urlSyncEffect({
      refine: nullable(tuple(number(), number(), number(), number())),
    }),
  ],
});

// Active layers and their settings
export const layersAtom = atom<readonly { id: Layer['id']; settings?: LayerSettings }[]>({
  key: 'layers',
  default: [],
  effects: [
    urlSyncEffect({
      refine: array(
        object({
          id: number(),
          settings: optional(
            object({
              visibility: optional(bool()),
              opacity: optional(number()),
              expanded: optional(bool()),
            })
          ),
        })
      ),
    }),
  ],
});
