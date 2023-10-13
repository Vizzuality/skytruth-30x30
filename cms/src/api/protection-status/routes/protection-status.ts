/**
 * protection-status router
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::protection-status.protection-status', {
    only: ['find', 'findOne']
});
