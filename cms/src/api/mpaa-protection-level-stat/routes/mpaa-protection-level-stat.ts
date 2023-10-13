/**
 * mpaa-protection-level-stat router
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::mpaa-protection-level-stat.mpaa-protection-level-stat', {
    only: ['find', 'findOne']
});
