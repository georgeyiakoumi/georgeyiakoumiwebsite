import { describe, it, expect, vi } from 'vitest';
import type { Core } from '@strapi/strapi';
import { isAllowedPublicAction, restrictPublicPermissions } from './restrict-public-permissions';

function mockStrapi(permissions: Array<{ id: number; action: string }>) {
  const findMany = vi.fn().mockResolvedValue(permissions);
  const deleteMany = vi.fn().mockResolvedValue({ count: 0 });
  const info = vi.fn();
  const query = vi.fn().mockReturnValue({ findMany, deleteMany });
  const strapi = { db: { query }, log: { info } } as unknown as Core.Strapi;
  return { strapi, query, findMany, deleteMany, info };
}

describe('isAllowedPublicAction', () => {
  it('allows reading published content and media', () => {
    expect(isAllowedPublicAction('api::project.project.find')).toBe(true);
    expect(isAllowedPublicAction('api::global-seo.global-seo.find')).toBe(true);
    expect(isAllowedPublicAction('api::tool.tool.findOne')).toBe(true);
    expect(isAllowedPublicAction('plugin::upload.content-api.find')).toBe(true);
  });

  it.each([
    'api::project.project.create',
    'api::project.project.update',
    'api::project.project.delete',
    'plugin::upload.content-api.upload',
    'plugin::upload.content-api.destroy',
    'plugin::users-permissions.role.createRole',
    'plugin::users-permissions.role.updateRole',
    'plugin::users-permissions.role.find',
    'plugin::users-permissions.permissions.getPermissions',
    'plugin::users-permissions.auth.register',
    'plugin::users-permissions.user.find',
    'plugin::content-type-builder.content-types.getContentTypes',
    'plugin::email.email.send',
    'api::project.project.findOneAndDelete',
  ])('blocks %s', (action) => {
    expect(isAllowedPublicAction(action)).toBe(false);
  });
});

describe('restrictPublicPermissions', () => {
  it('only queries the public role', async () => {
    const { strapi, query, findMany } = mockStrapi([]);
    await restrictPublicPermissions(strapi);
    expect(query).toHaveBeenCalledWith('plugin::users-permissions.permission');
    expect(findMany).toHaveBeenCalledWith({ select: ['id', 'action'], where: { role: { type: 'public' } } });
  });

  it('deletes everything outside the allowlist and logs it', async () => {
    const { strapi, deleteMany, info } = mockStrapi([
      { id: 1, action: 'api::project.project.find' },
      { id: 2, action: 'plugin::content-type-builder.content-types.getContentTypes' },
      { id: 3, action: 'plugin::upload.content-api.upload' },
      { id: 4, action: 'api::tool.tool.update' },
    ]);

    const removed = await restrictPublicPermissions(strapi);

    expect(removed).toEqual([
      'plugin::content-type-builder.content-types.getContentTypes',
      'plugin::upload.content-api.upload',
      'api::tool.tool.update',
    ]);
    expect(deleteMany).toHaveBeenCalledWith({ where: { id: { $in: [2, 3, 4] } } });
    expect(info).toHaveBeenCalledOnce();
  });

  it('does nothing when the public role is already clean', async () => {
    const { strapi, deleteMany, info } = mockStrapi([{ id: 1, action: 'api::tool.tool.find' }]);
    expect(await restrictPublicPermissions(strapi)).toEqual([]);
    expect(deleteMany).not.toHaveBeenCalled();
    expect(info).not.toHaveBeenCalled();
  });
});
