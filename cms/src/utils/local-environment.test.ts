import { describe, it, expect } from 'vitest';
import { assertLocalDatabase, assertUploadProvider, databaseHosts, isLocalCms } from './local-environment';

const cloudinary = { CLOUDINARY_NAME: 'n', CLOUDINARY_API_KEY: 'k', CLOUDINARY_API_SECRET: 's' };

describe('isLocalCms', () => {
  it('is only true for the explicit marker', () => {
    expect(isLocalCms({ CMS_ENV: 'local' })).toBe(true);
    expect(isLocalCms({})).toBe(false);
    expect(isLocalCms({ CMS_ENV: 'production' })).toBe(false);
  });
});

describe('databaseHosts', () => {
  it('includes the host and any DATABASE_URL host', () => {
    expect(databaseHosts({ DATABASE_HOST: '127.0.0.1' })).toEqual(['127.0.0.1']);
    expect(databaseHosts({ DATABASE_HOST: '127.0.0.1', DATABASE_URL: 'postgresql://u:p@db.example.com:5432/x' })).toEqual([
      '127.0.0.1',
      'db.example.com',
    ]);
  });
});

describe('assertLocalDatabase', () => {
  it('allows local hosts when CMS_ENV=local', () => {
    expect(() => assertLocalDatabase({ CMS_ENV: 'local', DATABASE_HOST: '127.0.0.1' })).not.toThrow();
    expect(() => assertLocalDatabase({ CMS_ENV: 'local', DATABASE_HOST: 'localhost' })).not.toThrow();
  });

  it('refuses a remote DATABASE_HOST when CMS_ENV=local', () => {
    expect(() => assertLocalDatabase({ CMS_ENV: 'local', DATABASE_HOST: 'aws-0-eu-west-2.pooler.supabase.com' })).toThrow(/supabase/);
  });

  it('refuses a remote DATABASE_URL even when DATABASE_HOST looks local', () => {
    expect(() =>
      assertLocalDatabase({
        CMS_ENV: 'local',
        DATABASE_HOST: '127.0.0.1',
        DATABASE_URL: 'postgresql://postgres.ref:pw@aws-0-eu-west-2.pooler.supabase.com:6543/postgres',
      })
    ).toThrow(/pooler\.supabase\.com/);
  });

  it('does not restrict production (no marker)', () => {
    expect(() => assertLocalDatabase({ DATABASE_URL: 'postgresql://u:p@db.example.com/x' })).not.toThrow();
  });
});

describe('assertUploadProvider', () => {
  it('uses local storage for CMS_ENV=local', () => {
    expect(assertUploadProvider({ CMS_ENV: 'local' })).toBe('local');
  });

  it('refuses Cloudinary credentials on a local CMS', () => {
    expect(() => assertUploadProvider({ CMS_ENV: 'local', ...cloudinary })).toThrow(/must not have Cloudinary/);
  });

  it('uses Cloudinary in production', () => {
    expect(assertUploadProvider(cloudinary)).toBe('cloudinary');
  });

  it('fails loudly instead of falling back to disk when production is missing a credential', () => {
    expect(() => assertUploadProvider({ CLOUDINARY_NAME: 'n', CLOUDINARY_API_KEY: 'k' })).toThrow(/Missing: CLOUDINARY_API_SECRET/);
  });
});
