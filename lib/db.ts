// lib/db.ts
import { Pool } from "pg";

declare global {
  // allow global var reuse in dev (Next.js fast refresh)
  // eslint-disable-next-line no-var
  var __pgPool: Pool | undefined;
}

export function getPool() {
  if (!global.__pgPool) {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error("Missing DATABASE_URL");
    }

    const isProd = process.env.NODE_ENV === "production";

    global.__pgPool = new Pool({
      connectionString,
      // keep the pool small on Heroku to avoid hitting connection limits
      max: 5,
      idleTimeoutMillis: 10_000,
      connectionTimeoutMillis: 10_000,
      ssl: isProd
        ? { require: true, rejectUnauthorized: false }
        : undefined, // local dev usually doesn't need SSL
    });
  }
  return global.__pgPool;
}
