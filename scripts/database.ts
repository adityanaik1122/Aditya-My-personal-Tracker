import { loadEnvConfig } from "@next/env"
import { readFile } from "node:fs/promises"
import path from "node:path"
import { Pool } from "pg"
import { validateStore } from "../src/lib/postgres-store"

loadEnvConfig(process.cwd())

async function main() {
  const action = process.argv[2]
  if (action !== "migrate" && action !== "import")
    throw new Error("Use db:migrate or db:import.")
  const connectionString = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL
  if (!connectionString) throw new Error("Save DATABASE_URL in .env.local first.")
  const url = new URL(connectionString)
  // Neon direct endpoints share the pooled endpoint name without '-pooler'.
  if (url.hostname.endsWith(".neon.tech")) url.hostname = url.hostname.replace("-pooler.", ".")
  const db = new Pool({ connectionString: url.toString(), connectionTimeoutMillis: 10000, max: 1 })
  try {
    if (action === "migrate") {
      const sql = await readFile(path.join(process.cwd(), "db/001-tracker-state.sql"), "utf8")
      await db.query(sql)
      console.log("Tracker schema is ready.")
    } else {
      const file = process.env.LEARNING_HUB_DATA_FILE || path.join(process.cwd(), ".data/learning-hub.json")
      // Deliberately fail if the source is missing: never silently import an empty store.
      const data = validateStore(JSON.parse(await readFile(file, "utf8")))
      const result = await db.query(
        "INSERT INTO tracker_state (id, data) VALUES ('owner', $1::jsonb) ON CONFLICT (id) DO NOTHING RETURNING id",
        [JSON.stringify(data)],
      )
      if (!result.rowCount) throw new Error("Import skipped: the database already contains tracker data. No data was overwritten.")
      console.log("Local tracker data imported. The original JSON file is unchanged.")
    }
  } finally {
    await db.end()
  }
}

main().catch((error) => {
  // Do not print connection strings or credentials from driver errors.
  console.error(error instanceof Error ? error.message : "Database setup failed.")
  process.exitCode = 1
})
