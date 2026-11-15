import type { Core } from '@strapi/strapi';
import { restrictPublicPermissions } from './bootstrap/restrict-public-permissions';

export default {
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    try {
      await restrictPublicPermissions(strapi);
    } catch (error) {
      strapi.log.error(`[security] Could not restrict public permissions: ${(error as Error).message}`);
    }
  },
};
