import "server-only"
import * as local from "./file-store"
import { readDatabaseStore, updateDatabaseStore } from "./postgres-store"

export type { HubStore, LessonProgress } from "./file-store"

function databaseConfigured() {
  if (process.env.DATABASE_URL) return true
  if (process.env.VERCEL)
    throw new Error("Configure DATABASE_URL in Vercel and run the database migration before deploying.")
  return false
}

export async function readStore() {
  return databaseConfigured() ? readDatabaseStore() : local.readStore()
}

export async function updateStore<T>(update: (store: local.HubStore) => T | Promise<T>) {
  return databaseConfigured() ? updateDatabaseStore(update) : local.updateStore(update)
}
