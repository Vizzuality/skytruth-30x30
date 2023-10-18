import { Config } from '@orval/core';

module.exports = {
  skytruth: {
    output: {
      mode: 'tags',
      client: 'react-query',
      target: './src/types/generated/strapi.ts',
      mock: false,
      clean: true,
      prettier: true,
      override: {
        mutator: {
          path: './src/services/api/index.ts',
          name: 'API',
        },
        query: {
          useQuery: true,
          useMutation: true,
          signal: true,
        },
      },
    },
    input: {
      target: '../cms/src/extensions/documentation/documentation/1.0.0/full_documentation.json',
      filters: {
        tags: [
          'Location',
          'Habitat',
          'Habitat-stat',
          'Mpa',
          'Mpaa-protection-level',
          'Mpaa-protection-level-stat',
          'Mpaa-establishment-stage',
          'Mpaa-establishment-stage-status',
          'Protection-coverage-stat',
          'Protection-status',
          'Fishing-protection-level',
          'Fishing-protection-level-stat',
        ],
      },
    },
  },
} satisfies Config;
