import type { Core } from '@strapi/strapi';

const ALLOWED_PUBLIC_ACTIONS = [
  /^api::[\w-]+\.[\w-]+\.(find|findOne)$/,
  /^plugin::upload\.content-api\.(find|findOne)$/,
];

export function isAllowedPublicAction(action: string) {
  return ALLOWED_PUBLIC_ACTIONS.some((pattern) => pattern.test(action));
}

export async function restrictPublicPermissions(strapi: Core.Strapi) {
  const permissions = strapi.db.query('plugin::users-permissions.permission');

  const publicPermissions: Array<{ id: number; action: string }> = await permissions.findMany({
    select: ['id', 'action'],
    where: { role: { type: 'public' } },
  });

  const blocked = publicPermissions.filter((permission) => !isAllowedPublicAction(permission.action));
  if (blocked.length === 0) return [];

  await permissions.deleteMany({ where: { id: { $in: blocked.map((permission) => permission.id) } } });
  strapi.log.info(
    `[security] Removed ${blocked.length} public permission(s): ${blocked.map((permission) => permission.action).join(', ')}`
  );
  return blocked.map((permission) => permission.action);
}
