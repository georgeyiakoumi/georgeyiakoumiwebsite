# Environments

There are two paths, and they don't share secrets, databases or a media library.

| | Production | Local |
|---|---|---|
| Website | Netlify (`main`), behind Cloudflare | `npm run dev` (reads production, read-only) or `npm run dev:local-cms` |
| CMS | Render (`portfolio-cms-n9hb.onrender.com`) | `npm run cms:dev` → `localhost:1337` |
| Database | Supabase Postgres | Local Postgres 17, database `strapi_dev` |
| Media uploads | Cloudinary | `cms/public/uploads` (local provider) |
| Secrets live in | Render and Netlify dashboards, plus your password manager | `cms/.env.local`, `.env.local`, `.env.local-cms` (all gitignored) |

## Rules

1. **Production secrets never go in a local file.** Local `APP_KEYS`, JWT secrets and token salts are generated separately, so nothing signed locally is valid in production.
2. **The local CMS is marked `CMS_ENV=local`, and the config enforces it.** With that marker, `cms/config/database.ts` refuses to start unless every database host (including any `DATABASE_URL` or shell export) is on this machine. `cms/config/plugins.ts` uses local disk uploads and refuses Cloudinary credentials. Without the marker (production), Cloudinary is required and the CMS fails loudly if a credential is missing, rather than silently writing to Render's temporary disk.
3. **There is no `cms/.env`.** Strapi loads `cms/.env` by default. Always use `npm run cms:dev`, which loads `cms/.env.local`. Copied production media still displays locally, because its URLs point at Cloudinary.
4. **The website uses read-only API tokens.** For a one-off write to production, create a token scoped to the task (Settings → API Tokens → Custom, 7-day duration) and let it expire. Don't keep full-access tokens.
5. **Public role = content read only.** On every boot, `cms/src/bootstrap/restrict-public-permissions.ts` removes every Public-role permission except `find`/`findOne` on content types and media. That covers create/update/delete, uploads, roles, schema, account and email endpoints.
6. **Upload limits are enforced.** Files can be up to 100 MB, of the types listed in `cms/config/plugins.ts` (images, mp4/webm/ogg/mov video, audio, JSON for Lottie, PDF).

## First-time local setup

1. Install Postgres 17 (e.g. `brew install postgresql@17`) and create `strapi_dev`.
2. `cp cms/.env.example cms/.env.local`. Keep `CMS_ENV=local`, fill in the local database user, and generate fresh secrets (the command is in the file).
3. `cp cms/.env.pull.example cms/.env.pull`. Fill in the read-only role's password (it's in your password manager).
4. Use Node 22 for the CMS (`nvm use`). Strapi 5 doesn't support newer versions.

## Refreshing local content from production

```bash
npm run cms:db:pull   # backs up local, copies production (read-only), creates a local API token
npm run cms:dev       # local Strapi on :1337 (log in with your production admin credentials)
npm run dev:local-cms # website on :3000, reading the local CMS
```

`cms:db:pull` refuses to run if:
- the source role isn't `cms_pull_readonly`, or the URL uses the transaction pooler
- `cms/.env.local` lacks `CMS_ENV=local` or `DATABASE_CLIENT=postgres`
- the target isn't on localhost, or `DATABASE_URL` is set
- `cms/.env.local` contains Cloudinary credentials

It deletes the production dump after restoring and keeps the newest 3 local backups in `cms/.backups/` (gitignored).

## Shipping CMS changes

1. Make and preview schema or content changes locally.
2. Merge to `main`. `deploy-cms.yml` triggers Render, and Strapi syncs the schema on start. Strapi **drops** columns for removed fields, so check the local rehearsal first.
3. Apply content changes to production: replay only the differences, using a temporary scoped token or the admin. Don't use `strapi transfer --to`, which replaces the destination's data.

## Read-only database role

`cms_pull_readonly` is a Supabase Postgres role with `SELECT` on the `public` schema only. To rotate its password:

```sql
ALTER ROLE cms_pull_readonly WITH PASSWORD '<new password>';
```
