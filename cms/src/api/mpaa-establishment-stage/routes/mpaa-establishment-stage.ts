/**
 * mpaa-establishment-stage router
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::mpaa-establishment-stage.mpaa-establishment-stage', {
    only: ['find', 'findOne']
});
