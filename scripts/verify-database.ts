import { loadEnvConfig } from "@next/env"
import assert from "node:assert/strict"
import { databasePool, readDatabaseStore, updateDatabaseStore } from "../src/lib/postgres-store"

loadEnvConfig(process.cwd())

async function main() {
  const db = databasePool()
  try {
    const before = await readDatabaseStore(db)
    await assert.rejects(updateDatabaseStore(store => {
      store.verificationShouldNeverPersist = true
      throw new Error("Expected rollback probe")
    }, db), /Expected rollback probe/)
    assert.deepEqual(await readDatabaseStore(db), before)
    await Promise.all(Array.from({ length: 5 }, () => updateDatabaseStore(s => Object.keys(s.lessons).length, db)))
    assert.deepEqual(await readDatabaseStore(db), before)
    console.log("Database reads, rollback, and concurrent transactions verified; data unchanged.")
    console.log(`Stored lesson records: ${Object.keys(before.lessons).length}; tasks: ${before.daily?.tasks.length ?? 0}.`)
  } finally {
    await db.end()
  }
}

main().catch(() => {
  console.error("Database verification failed. Check connectivity and the tracker schema.")
  process.exitCode = 1
})
