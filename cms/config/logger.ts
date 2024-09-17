'use strict';

import { formats } from '@strapi/logger'

export default {
  // Remove the colors from the logs since they're not visible in GCP
  format: formats.prettyPrint({ colors: false })
};
