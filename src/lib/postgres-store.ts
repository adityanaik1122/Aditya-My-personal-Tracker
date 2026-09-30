import { Pool } from "pg"
import { attachDatabasePool } from "@vercel/functions"
import type { HubStore } from "./file-store"

let pool: Pool | undefined

export function databasePool() {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not configured.")
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      max: 5,
      idleTimeoutMillis: 5000,
      connectionTimeoutMillis: 10000,
    })
    pool.on("error", () => console.error("An idle database connection failed."))
    if (process.env.VERCEL) attachDatabasePool(pool)
  }
  return pool
}

export function validateStore(value: unknown): HubStore {
  if (!value || typeof value !== "object" || Array.isArray(value))
    throw new Error("Invalid tracker data.")
  const store = value as HubStore
  if (!store.lessons || typeof store.lessons !== "object" || Array.isArray(store.lessons))
    throw new Error("Invalid tracker lesson data.")
  if (store.daily && store.daily.version !== 1)
    throw new Error("Unsupported daily store version.")
  return store
}

export async function readDatabaseStore(db = databasePool()): Promise<HubStore> {
  const result = await db.query("SELECT data FROM tracker_state WHERE id = 'owner'")
  return result.rows.length ? validateStore(result.rows[0].data) : { lessons: {} }
}

// A database row lock serializes updates across all Vercel instances. A rejected
// callback rolls back both the initial row and any changes to existing data.
export async function updateDatabaseStore<T>(
  update: (store: HubStore) => T | Promise<T>,
  db = databasePool(),
): Promise<T> {
  const client = await db.connect()
  try {
    await client.query("BEGIN")
    await client.query("SET LOCAL lock_timeout = '10s'")
    await client.query("SET LOCAL statement_timeout = '15s'")
    await client.query(
      "INSERT INTO tracker_state (id, data) VALUES ('owner', '{\"lessons\":{}}'::jsonb) ON CONFLICT (id) DO NOTHING",
    )
    const row = await client.query("SELECT data FROM tracker_state WHERE id = 'owner' FOR UPDATE")
    const store = validateStore(row.rows[0].data)
    const before = JSON.stringify(store)
    const result = await update(store)
    validateStore(store)
    const after = JSON.stringify(store)
    if (after !== before) {
      await client.query("UPDATE tracker_state SET data = $1::jsonb, updated_at = now() WHERE id = 'owner'", [after])
    }
    await client.query("COMMIT")
    return result
  } catch (error) {
    await client.query("ROLLBACK").catch(() => undefined)
    throw error
  } finally {
    client.release()
  }
}
