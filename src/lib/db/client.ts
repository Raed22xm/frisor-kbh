import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema";

function getDatabaseUrl(): string {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      "DATABASE_URL environment variable is not set. See .env.example for setup instructions."
    );
  }
  return url;
}

let db: ReturnType<typeof drizzle<typeof schema>> | null = null;

export function getDb() {
  if (!db) {
    const pool = new pg.Pool({
      connectionString: getDatabaseUrl(),
      max: 5,
      ssl: { rejectUnauthorized: false },
    });
    db = drizzle(pool, { schema });
  }
  return db;
}
