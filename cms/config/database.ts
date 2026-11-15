import { assertLocalDatabase } from '../src/utils/local-environment';

export default ({ env }) => {
  assertLocalDatabase(process.env);
  const client = env('DATABASE_CLIENT', 'postgres');
  if (client !== 'postgres') {
    throw new Error(`Unsupported DATABASE_CLIENT "${client}". This CMS only runs on Postgres.`);
  }

  return {
    connection: {
      client,
      connection: {
        connectionString: env('DATABASE_URL'),
        host: env('DATABASE_HOST'),
        port: env.int('DATABASE_PORT', 5432),
        database: env('DATABASE_NAME', 'postgres'),
        user: env('DATABASE_USERNAME', 'postgres'),
        password: env('DATABASE_PASSWORD'),
        ssl: env.bool('DATABASE_SSL', false) ? { rejectUnauthorized: false } : false,
      },
      pool: { min: 2, max: 10 },
      acquireConnectionTimeout: env.int('DATABASE_CONNECTION_TIMEOUT', 60000),
    },
  };
};
