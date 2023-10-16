/**
 * mpaa-establishment-stage-stat router
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::mpaa-establishment-stage-stat.mpaa-establishment-stage-stat', {
    only: ['find', 'findOne']
});
