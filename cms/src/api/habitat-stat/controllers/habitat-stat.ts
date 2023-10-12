/**
 * habitat-stat controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::habitat-stat.habitat-stat', ({ strapi }) => ({
    async find(ctx) {
        // find the most recently updated record and return its updatedAt date
        const newQuery = {
            ...ctx.query,
            fields: ['updatedAt'],
            sort: { updatedAt: 'desc' },
            limit: 1
        };
        const updatedAt = await strapi.entityService.findMany('api::habitat-stat.habitat-stat', newQuery).then((data) => {
            return data[0]?.updatedAt ?? null;
        });
        // run the original find function
        const { data, meta } = await super.find(ctx);
        // add the updatedAt date to the meta object
        return { data, meta: { ...meta, updatedAt } }
    }
}));
