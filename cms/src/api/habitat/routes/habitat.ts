/**
 * habitat router
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::habitat.habitat', {
    only: ['find', 'findOne']
});
