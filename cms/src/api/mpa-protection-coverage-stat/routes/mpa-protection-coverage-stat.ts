/**
 * mpa-protection-coverage-stat router
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::mpa-protection-coverage-stat.mpa-protection-coverage-stat', {
    only: ['find', 'findOne']
});

