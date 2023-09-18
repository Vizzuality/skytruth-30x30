import { Layer } from '@/types/layer';

// Every sub-layer (`config.layers`) must have an ID in order to be correctly ordered on the map
export const LAYERS: readonly Layer[] = [
  {
    id: 1,
    name: 'Indigenous and Community Lands',
    type: 'default',
    config: {
      type: 'vector',
      source: {
        type: 'vector',
        minzoom: 0,
        maxzoom: 9,
        tiles: [
          'https://tiles.globalforestwatch.org/landmark_land_rights/v20191111/default/{z}/{x}/{y}.pbf',
        ],
      },
      layers: [
        {
          id: 'indigenous-community-lands-1',
          filter: ['==', 'type', 'Indicative Areas'],
          paint: {
            'fill-color': '#9c9c9c',
            'fill-opacity': 0.3,
          },
          'source-layer': 'landmark_land_rights',
          type: 'fill',
        },
        {
          id: 'indigenous-community-lands-2',
          filter: ['==', 'type', 'Indicative Areas'],
          paint: {
            'line-color': '#9c9c9c',
            'line-opacity': 1,
          },
          'source-layer': 'landmark_land_rights',
          type: 'line',
        },
        {
          id: 'indigenous-community-lands-3',
          filter: [
            'all',
            ['==', 'form_rec', 'Acknowledged by govt'],
            ['==', 'identity', 'Indigenous'],
          ],
          paint: {
            'fill-color': '#bf6938',
            'fill-opacity': 0.3,
          },
          'source-layer': 'landmark_land_rights',
          type: 'fill',
        },
        {
          id: 'indigenous-community-lands-4',
          filter: [
            'all',
            ['==', 'form_rec', 'Acknowledged by govt'],
            ['==', 'identity', 'Indigenous'],
          ],
          paint: {
            'line-color': '#bf6938',
            'line-opacity': 1,
          },
          'source-layer': 'landmark_land_rights',
          type: 'line',
        },
        {
          id: 'indigenous-community-lands-5',
          filter: [
            'all',
            ['==', 'form_rec', 'Not acknowledged by govt'],
            ['==', 'identity', 'Indigenous'],
          ],
          paint: {
            'fill-color': '#f3aa72',
            'fill-opacity': 0.3,
          },
          'source-layer': 'landmark_land_rights',
          type: 'fill',
        },
        {
          id: 'indigenous-community-lands-6',
          filter: [
            'all',
            ['==', 'form_rec', 'Not acknowledged by govt'],
            ['==', 'identity', 'Indigenous'],
          ],
          paint: {
            'line-color': '#f3aa72',
            'line-opacity': 1,
          },
          'source-layer': 'landmark_land_rights',
          type: 'line',
        },
        {
          id: 'indigenous-community-lands-7',
          filter: [
            'all',
            ['==', 'form_rec', 'Acknowledged by govt'],
            ['==', 'identity', 'Community'],
          ],
          paint: {
            'fill-color': '#2C5682',
            'fill-opacity': 0.3,
          },
          'source-layer': 'landmark_land_rights',
          type: 'fill',
        },
        {
          id: 'indigenous-community-lands-8',
          filter: [
            'all',
            ['==', 'form_rec', 'Acknowledged by govt'],
            ['==', 'identity', 'Community'],
          ],
          paint: {
            'line-color': '#2C5682',
            'line-opacity': 1,
          },
          'source-layer': 'landmark_land_rights',
          type: 'line',
        },
        {
          id: 'indigenous-community-lands-9',
          filter: [
            'all',
            ['==', 'form_rec', 'Not acknowledged by govt'],
            ['==', 'identity', 'Community'],
          ],
          paint: {
            'fill-color': '#407ebe',
            'fill-opacity': 0.3,
          },
          'source-layer': 'landmark_land_rights',
          type: 'fill',
        },
        {
          id: 'indigenous-community-lands-10',
          filter: [
            'all',
            ['==', 'form_rec', 'Not acknowledged by govt'],
            ['==', 'identity', 'Community'],
          ],
          paint: {
            'line-color': '#407ebe',
            'line-opacity': 1,
          },
          'source-layer': 'landmark_land_rights',
          type: 'line',
        },
      ],
    },
    legend: {
      type: 'basic',
      items: [
        {
          color: '#bf6938',
          value: 'Indigenous Lands - Acknowledged by Government',
        },
        {
          color: '#f3aa72',
          value: 'Indigenous Lands - Not acknowledged by Government',
        },
        {
          color: '#2C5682',
          value: 'Community Lands - Acknowledged by Government',
        },
        {
          color: '#407ebe',
          value: 'Community Lands - Not acknowledged by Government',
        },
        {
          color: '#9c9c9c',
          value: 'Indicative Areas of Indigenous and Community Land Rights',
        },
      ],
    },
    metadata: {
      attributions:
        'Powered by <a href="https://resourcewatch.org/" target="_blank" rel="noopener noreferrer">Resource Watch</a>',
    },
  },
  {
    id: 2,
    name: 'Primary forests',
    type: 'default',
    config: {
      type: 'raster',
      source: {
        type: 'raster',
        minzoom: 3,
        maxzoom: 12,
        tiles: [
          'https://api.resourcewatch.org/v1/layer/41086554-5ca5-456c-80dd-f6bee61bc45f/tile/gee/{z}/{x}/{y}',
        ],
      },
      layers: [
        {
          id: 'primary-forest',
          type: 'raster',
        },
      ],
    },
    legend: {
      type: 'basic',
      items: [
        {
          color: '#658434',
          value: 'Primary forest',
        },
      ],
    },
    metadata: {
      attributions:
        'Powered by <a href="https://resourcewatch.org/" target="_blank" rel="noopener noreferrer">Resource Watch</a>',
    },
  },
];
