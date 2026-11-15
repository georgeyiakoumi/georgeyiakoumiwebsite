import { describe, it, expect } from 'vitest';
import { backupsToDelete, checkLocalTarget, checkPullSource } from './cms-db-pull-guards.mts';

const readonlyUrl = 'postgresql://cms_pull_readonly.ref:pw@aws-0-eu-west-2.pooler.supabase.com:5432/postgres';
const localEnv = {
  CMS_ENV: 'local',
  DATABASE_CLIENT: 'postgres',
  DATABASE_HOST: '127.0.0.1',
  DATABASE_NAME: 'strapi_dev',
  DATABASE_USERNAME: 'dev',
};

describe('checkPullSource', () => {
  it('accepts the read-only role on the session pooler', () => {
    expect(checkPullSource(readonlyUrl)).toBeNull();
  });

  it.each([
    [undefined, /not set/],
    ['not a url', /not a valid URL/],
    ['postgresql://postgres.ref:pw@host.pooler.supabase.com:5432/postgres', /role "postgres"/],
    ['postgresql://postgres:pw@db.ref.supabase.co:5432/postgres', /role "postgres"/],
    ['postgresql://someone_readonly_ish.ref:pw@host:5432/postgres', /role "someone_readonly_ish"/],
    ['postgresql://cms_pull_readonly.ref:pw@host.pooler.supabase.com:6543/postgres', /session pooler/],
  ])('refuses %s', (url, message) => {
    expect(checkPullSource(url)).toMatch(message);
  });
});

describe('checkLocalTarget', () => {
  it('accepts a local Postgres CMS', () => {
    expect(checkLocalTarget(localEnv)).toBeNull();
    expect(checkLocalTarget({ ...localEnv, DATABASE_HOST: 'localhost' })).toBeNull();
  });

  it.each([
    [{ CMS_ENV: undefined }, /CMS_ENV=local/],
    [{ DATABASE_CLIENT: 'sqlite' }, /DATABASE_CLIENT=postgres/],
    [{ DATABASE_HOST: 'aws-0-eu-west-2.pooler.supabase.com' }, /non-local/],
    [{ DATABASE_URL: 'postgresql://u:p@aws-0.pooler.supabase.com/postgres' }, /must not set DATABASE_URL/],
    [{ CLOUDINARY_API_SECRET: 'x' }, /Cloudinary/],
    [{ DATABASE_NAME: undefined }, /DATABASE_NAME/],
    [{ DATABASE_USERNAME: undefined }, /DATABASE_USERNAME/],
  ])('refuses %o', (override, message) => {
    expect(checkLocalTarget({ ...localEnv, ...override })).toMatch(message);
  });
});

describe('backupsToDelete', () => {
  it('keeps the newest N matching dumps and ignores other files', () => {
    const files = [
      'strapi_dev-2026-11-01T00-00-00-000Z.dump',
      'strapi_dev-2026-11-03T00-00-00-000Z.dump',
      'strapi_dev-2026-11-02T00-00-00-000Z.dump',
      'strapi_dev-2026-11-04T00-00-00-000Z.dump',
      'production-2026-11-04T00-00-00-000Z.dump',
      'notes.txt',
    ];
    expect(backupsToDelete(files, 'strapi_dev', 3)).toEqual(['strapi_dev-2026-11-01T00-00-00-000Z.dump']);
    expect(backupsToDelete(files, 'strapi_dev', 10)).toEqual([]);
  });
});
