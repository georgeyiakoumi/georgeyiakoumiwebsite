export const LOCAL_HOSTS = new Set(['127.0.0.1', 'localhost', '::1']);

type Env = Record<string, string | undefined>;

export function checkPullSource(url: string | undefined): string | null {
  if (!url) return 'PULL_DATABASE_URL is not set in cms/.env.pull.';
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return 'PULL_DATABASE_URL is not a valid URL.';
  }
  const role = decodeURIComponent(parsed.username).split('.')[0];
  if (role !== 'cms_pull_readonly') return `Refusing to pull with role "${role}". Use the read-only role (cms_pull_readonly).`;
  if (parsed.port === '6543') return 'Use the Supabase session pooler (port 5432); pg_dump does not work on 6543.';
  return null;
}

export function checkLocalTarget(env: Env): string | null {
  if (env.CMS_ENV !== 'local') return 'cms/.env.local must set CMS_ENV=local.';
  if (env.DATABASE_CLIENT !== 'postgres') return 'cms/.env.local must set DATABASE_CLIENT=postgres.';
  if (!LOCAL_HOSTS.has(env.DATABASE_HOST ?? '')) return `Refusing to write to non-local DATABASE_HOST "${env.DATABASE_HOST ?? ''}".`;
  if (env.DATABASE_URL) return 'cms/.env.local must not set DATABASE_URL (it would override DATABASE_HOST).';
  if (env.CLOUDINARY_API_SECRET) return 'cms/.env.local contains Cloudinary credentials. Remove them so local edits cannot touch production media.';
  if (!env.DATABASE_NAME) return 'DATABASE_NAME is not set in cms/.env.local.';
  if (!env.DATABASE_USERNAME) return 'DATABASE_USERNAME is not set in cms/.env.local.';
  return null;
}

export function backupsToDelete(files: string[], prefix: string, keep: number) {
  return files
    .filter((file) => file.startsWith(`${prefix}-`) && file.endsWith('.dump'))
    .sort()
    .reverse()
    .slice(keep);
}
