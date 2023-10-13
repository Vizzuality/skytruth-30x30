/**
 * protection-coverage-stat router
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::protection-coverage-stat.protection-coverage-stat', {
    only: ['find', 'findOne']
});
