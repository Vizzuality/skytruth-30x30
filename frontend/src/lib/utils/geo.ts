import { BBox } from '@turf/helpers';

/**
 * Combines two bounding boxes into a single bounding box that encompasses both
 * @param bbox1 First bounding box [minLon, minLat, maxLon, maxLat]
 * @param bbox2 Second bounding box [minLon, minLat, maxLon, maxLat]
 * @returns Combined bounding box
 */
export const combineBoundingBoxes = (bbox1: BBox, bbox2: BBox): BBox => {
  return [
    Math.min(bbox1[0], bbox2[0]),
    Math.min(bbox1[1], bbox2[1]),
    Math.max(bbox1[2], bbox2[2]),
    Math.max(bbox1[3], bbox2[3]),
  ];
};
