/**
 * pa controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::pa.pa', ({ strapi }) => ({
  async find(ctx) {
    if (ctx.query['keep-if-children-match']) {
      // In addition to the controller's default behavior, we also want to keep the rows for which
      // there is at least one child that matches the filters. For this, we'll use the `children`
      // and `parent` fields.

      // First, we get the list of all the parents (no pagination) for which at least one child
      // matches the filters. No sorting.
      const { parent, ...filtersWithoutParentProperty } = ctx.query.filters ?? {};

      const parentIds = (await strapi.entityService.findMany('api::pa.pa', {
        fields: ['id'],
        populate: {
          parent: {
            fields: ['id'],
          },
        },
        filters: {
          $and: [
            {
              parent: {
                name: {
                  $null: false,
                },
              },
            },
            filtersWithoutParentProperty,
          ],
        },
        limit: -1,
      }) as { id: number; parent: { id: number } }[]).map((d) => d.parent.id);

      const uniqueParentIds = [...new Set(parentIds)];

      // Then, we get the list of all parents that match the initial request or the ones for which
      // children match, using the list of ids `uniqueParentIds`.
      return await super.find({
        ...ctx,
        query: {
          ...ctx.query,
          filters: {
            $and: [
              {
                parent: {
                  name: {
                    $null: true,
                  },
                },
              },
              {
                $or: [
                  filtersWithoutParentProperty,
                  {
                    id: {
                      $in: uniqueParentIds,
                    },
                  },
                ],
              },
            ],
          }
        },
      });
    } else {
      return await super.find(ctx);
    }
  }
}));
