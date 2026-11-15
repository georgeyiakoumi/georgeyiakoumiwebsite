/**
 * Copy production CMS content into the LOCAL CMS database.
 *
 *   npm run cms:db:pull
 *
 * - Reads production with the read-only role from cms/.env.pull (never the main user).
 * - Writes only to a Postgres database on localhost, using cms/.env.local (CMS_ENV=local).
 * - Backs up the local database first and keeps the newest 3 backups (cms/.backups/).
 * - Drops copied production API/transfer tokens and admin sessions, then creates a
 *   fresh local read-only token and writes it to .env.local-cms.
 *
 * Requires Node 22 (the CMS does not support newer) and pg_dump/pg_restore 17.
 */
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { parseEnv } from 'node:util';
import { backupsToDelete, checkLocalTarget, checkPullSource } from './cms-db-pull-guards.mts';

const root = path.resolve(import.meta.dirname, '..');
const cmsDir = path.join(root, 'cms');
const KEEP_LOCAL_BACKUPS = 3;

function fail(message: string): never {
  console.error(`\n✖ ${message}\n`);
  process.exit(1);
}

function readEnvFile(file: string): Record<string, string | undefined> {
  if (!existsSync(file)) fail(`Missing ${path.relative(root, file)}. Copy it from the matching .example file.`);
  return parseEnv(readFileSync(file, 'utf8'));
}

function run(command: string, args: string[], env: Record<string, string> = {}) {
  execFileSync(command, args, { stdio: ['ignore', 'inherit', 'inherit'], env: { ...process.env, ...env } });
}

const pull = readEnvFile(path.join(cmsDir, '.env.pull'));
const local = readEnvFile(path.join(cmsDir, '.env.local'));

const sourceProblem = checkPullSource(pull.PULL_DATABASE_URL);
if (sourceProblem) fail(sourceProblem);
const targetProblem = checkLocalTarget(local);
if (targetProblem) fail(targetProblem);

const sourceUrl = pull.PULL_DATABASE_URL as string;
const targetEnv = {
  PGHOST: local.DATABASE_HOST as string,
  PGPORT: local.DATABASE_PORT ?? '5432',
  PGDATABASE: local.DATABASE_NAME as string,
  PGUSER: local.DATABASE_USERNAME as string,
  PGPASSWORD: local.DATABASE_PASSWORD ?? '',
};

const stamp = new Date().toISOString().replace(/[:.]/g, '-');
const backupDir = path.join(cmsDir, '.backups');
mkdirSync(backupDir, { recursive: true, mode: 0o700 });
const backupFile = path.join(backupDir, `${targetEnv.PGDATABASE}-${stamp}.dump`);
const sourceFile = path.join(backupDir, `production-${stamp}.dump`);

console.log(`→ Backing up local ${targetEnv.PGDATABASE} to ${path.relative(root, backupFile)}`);
run('pg_dump', ['-Fc', '-f', backupFile], targetEnv);

try {
  console.log('→ Reading production (cms_pull_readonly, read-only)');
  run('pg_dump', [sourceUrl, '-n', 'public', '--no-owner', '--no-privileges', '-Fc', '-f', sourceFile]);

  console.log(`→ Restoring into local ${targetEnv.PGDATABASE}`);
  run('pg_restore', ['--clean', '--if-exists', '--no-owner', '--no-privileges', '--single-transaction', '-d', targetEnv.PGDATABASE, sourceFile], targetEnv);
} finally {
  rmSync(sourceFile, { force: true });
}

console.log('→ Removing copied production tokens and sessions');
const tokenTables = [
  'strapi_api_token_permissions_token_lnk',
  'strapi_api_tokens_admin_user_owner_lnk',
  'strapi_api_token_permissions',
  'strapi_api_tokens',
  'strapi_transfer_token_permissions_token_lnk',
  'strapi_transfer_token_permissions',
  'strapi_transfer_tokens',
  'strapi_sessions',
];
const cleanupSql = `DO $$ DECLARE t text; BEGIN
  FOREACH t IN ARRAY ARRAY[${tokenTables.map((t) => `'${t}'`).join(', ')}] LOOP
    IF to_regclass('public.' || t) IS NOT NULL THEN EXECUTE format('DELETE FROM %I', t); END IF;
  END LOOP;
END $$;`;
run('psql', ['-v', 'ON_ERROR_STOP=1', '-q', '-c', cleanupSql], targetEnv);

console.log('→ Creating a local read-only API token');
for (const key of ['DATABASE_URL', 'DATABASE_HOST', 'DATABASE_CLIENT', 'CLOUDINARY_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET']) {
  delete process.env[key];
}
for (const [key, value] of Object.entries(local)) {
  if (value !== undefined) process.env[key] = value;
}
process.env.ENV_PATH = path.join(cmsDir, '.env.local');
process.chdir(cmsDir);

interface ApiTokenService {
  create(attributes: Record<string, unknown>): Promise<{ accessKey: string }>;
}
interface StrapiApp {
  log: { level: string };
  service(uid: 'admin::api-token'): ApiTokenService;
  destroy(): Promise<void>;
}
interface StrapiModule {
  compileStrapi(options: { appDir: string }): Promise<unknown>;
  createStrapi(context: unknown): { load(): Promise<StrapiApp> };
}

const cmsRequire = createRequire(path.join(cmsDir, 'package.json'));
const { compileStrapi, createStrapi } = cmsRequire('@strapi/strapi') as StrapiModule;
const app = await createStrapi(await compileStrapi({ appDir: cmsDir })).load();
app.log.level = 'error';
try {
  const { accessKey } = await app.service('admin::api-token').create({
    name: 'local-website',
    description: 'Created by npm run cms:db:pull for npm run dev:local-cms',
    type: 'read-only',
    kind: 'content-api',
    lifespan: null,
  });
  writeFileSync(
    path.join(root, '.env.local-cms'),
    `STRAPI_API_URL=http://localhost:1337\nSTRAPI_API_TOKEN=${accessKey}\n`,
    { mode: 0o600 }
  );
} finally {
  await app.destroy();
}

for (const file of backupsToDelete(readdirSync(backupDir), targetEnv.PGDATABASE, KEEP_LOCAL_BACKUPS)) {
  rmSync(path.join(backupDir, file), { force: true });
}

console.log(`\n✔ Local CMS now mirrors production. Kept the newest ${KEEP_LOCAL_BACKUPS} local backups in cms/.backups/.`);
console.log('  Start it with `npm run cms:dev`, then the website with `npm run dev:local-cms`.\n');
process.exit(0);
