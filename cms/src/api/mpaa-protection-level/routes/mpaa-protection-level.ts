/**
 * mpaa-protection-level router
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::mpaa-protection-level.mpaa-protection-level', {
    only: ['find', 'findOne']
});
