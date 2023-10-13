/**
 * habitat-stat router
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::habitat-stat.habitat-stat', {
    only: ['find', 'findOne']
});
