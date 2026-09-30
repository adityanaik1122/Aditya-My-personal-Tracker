import { test } from "node:test"
import assert from "node:assert/strict"
import type { Pool } from "pg"
import { updateDatabaseStore, validateStore } from "../src/lib/postgres-store"

function fakeDatabase() {
  const statements: string[] = []
  const values: unknown[][] = []
  let released = false
  const client = {
    async query(sql: string, params?: unknown[]) {
      statements.push(sql)
      if (params) values.push(params)
      return { rows: sql.startsWith("SELECT") ? [{ data: { lessons: {}, legacy: ["saved"] } }] : [] }
    },
    release() { released = true },
  }
  return {
    db: { connect: async () => client } as unknown as Pool,
    statements, values, released: () => released,
  }
}

test("database writes lock before reading and preserve legacy data", async () => {
  const f = fakeDatabase()
  await updateDatabaseStore(s => {
    s.lessons.lesson = { completed: true, positionSeconds: 20, updatedAt: "now" }
  }, f.db)
  assert.ok(f.statements.find(s => s.includes("FOR UPDATE")))
  assert.equal(f.statements.at(-1), "COMMIT")
  assert.deepEqual(JSON.parse(String(f.values[0][0])).legacy, ["saved"])
  assert.equal(f.released(), true)
})

test("failed mutations roll back without writing partial progress", async () => {
  const f = fakeDatabase()
  await assert.rejects(updateDatabaseStore(s => {
    s.lessons.lesson = { completed: true, positionSeconds: 20, updatedAt: "now" }
    throw new Error("mutation failed")
  }, f.db), /mutation failed/)
  assert.equal(f.statements.at(-1), "ROLLBACK")
  assert.equal(f.values.length, 0)
  assert.equal(f.released(), true)
})

test("unchanged page reads do not rewrite the entire store", async () => {
  const f = fakeDatabase()
  await updateDatabaseStore(s => s.lessons, f.db)
  assert.equal(f.values.length, 0)
  assert.equal(f.statements.at(-1), "COMMIT")
})

test("malformed persisted data fails validation instead of being replaced", () => {
  for (const value of [null, [], {}, { lessons: [] }, { lessons: {}, daily: { version: 2 } }])
    assert.throws(() => validateStore(value))
})
