export const LOCAL_HOSTS = new Set(['127.0.0.1', 'localhost', '::1']);

type Env = Record<string, string | undefined>;

export function isLocalCms(env: Env) {
  return env.CMS_ENV === 'local';
}

export function databaseHosts(env: Env) {
  const hosts = [env.DATABASE_HOST ?? 'localhost'];
  if (env.DATABASE_URL) hosts.push(new URL(env.DATABASE_URL).hostname);
  return hosts;
}

export function assertLocalDatabase(env: Env) {
  if (!isLocalCms(env)) return;
  const remote = databaseHosts(env).filter((host) => !LOCAL_HOSTS.has(host));
  if (remote.length > 0) {
    throw new Error(
      `CMS_ENV=local but the database points at ${remote.join(', ')}. ` +
        'A local CMS may only connect to a database on this machine. See docs/ENVIRONMENTS.md.'
    );
  }
}

export function assertUploadProvider(env: Env) {
  if (isLocalCms(env)) {
    if (env.CLOUDINARY_API_SECRET) {
      throw new Error('CMS_ENV=local must not have Cloudinary credentials. Remove them from cms/.env.local.');
    }
    return 'local' as const;
  }
  const missing = ['CLOUDINARY_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET'].filter((key) => !env[key]);
  if (missing.length > 0) {
    throw new Error(`Cloudinary is required outside CMS_ENV=local. Missing: ${missing.join(', ')}.`);
  }
  return 'cloudinary' as const;
}
