import { test } from "node:test"
import assert from "node:assert/strict"
import { mkdtemp, readFile, writeFile, rm } from "node:fs/promises"
import { tmpdir } from "node:os"
import path from "node:path"
import {
  addDays,
  changeOccurrence,
  deleteTask,
  changeCategory,
  initializeOrganization,
  moveTask,
  restoreTask,
  setFocus,
  claimReminder,
  consistency,
  localDate,
  localTime,
  materialize,
  newDailyStore,
  scheduled,
  summary,
  validateTask,
  visibleOn,
  type TaskSpec,
} from "../src/lib/daily-model"
import { updateStore, readStore } from "../src/lib/file-store"
import { cadenceOf } from "../src/components/daily/daily-ui"

const spec: TaskSpec = {
  title: "Practice",
  category: "Learning",
  url: "https://example.com",
  notes: "",
  minutes: 15,
  priority: "normal",
  startDate: "2026-03-01",
  endDate: "",
  recurrence: "daily",
  weekdays: [1, 3],
  paused: false,
  courseId: "",
}
function store() {
  const d = newDailyStore(new Date("2026-03-01T00:00:00Z"))
  d.tasks = [
    {
      ...spec,
      id: "t",
      createdDate: "2026-03-01",
      versions: [{ from: "2026-03-01", spec: { ...spec } }],
    },
  ]
  return d
}

test("one-off tasks remain available across days without new occurrences", () => {
  const d = store()
  Object.assign(d.tasks[0], { recurrence: "once", startDate: "2027-01-01", endDate: "2027-01-02" })
  materialize(d, "2026-03-01")
  materialize(d, "2026-03-10")
  const rows = Object.values(d.occurrences)
  assert.equal(rows.length, 1)
  assert.equal(visibleOn(rows[0], "2026-03-10", "2026-03-10"), true)
  setFocus(d, "2026-03-10", rows[0].id, true)
  changeOccurrence(rows[0], "completed", new Date("2026-03-10T12:00:00Z"))
  assert.equal(rows[0].date, "2026-03-10")
  materialize(d, "2026-03-11")
  assert.equal(Object.values(d.occurrences).length, 1)
  assert.equal(visibleOn(rows[0], "2026-03-11", "2026-03-11"), false)
  changeOccurrence(rows[0], "pending", new Date("2026-03-11T12:00:00Z"))
  assert.equal(visibleOn(rows[0], "2026-03-11", "2026-03-11"), true)
  assert.throws(() => changeOccurrence(rows[0], "reschedule", new Date(), "2026-03-12"), /anytime/)
})

test("legacy one-off tasks recover with original IDs; pause, delete and undo work", () => {
  const d = store()
  Object.assign(d.tasks[0], { recurrence: "once" })
  materialize(d, "2026-03-01")
  const row = Object.values(d.occurrences)[0]
  row.history.push({ at: "2026-03-01T12:00:00Z", action: "reschedule", to: "2026-03-02" })
  row.date = "2026-03-02"
  const original = row.id
  materialize(d, "2026-03-10")
  assert.equal(Object.values(d.occurrences)[0].id, original)
  assert.equal(row.history.length, 1)
  assert.equal(visibleOn(row, "2026-03-10", "2026-03-10"), true)
  d.tasks[0].paused = true
  materialize(d, "2026-03-10")
  assert.equal(visibleOn(row, "2026-03-10", "2026-03-10"), false)
  d.tasks[0].paused = false
  materialize(d, "2026-03-10")
  deleteTask(d, "t", "2026-03-10", 1000)
  assert.equal(Object.values(d.occurrences).length, 0)
  restoreTask(d, "t", 2000)
  assert.equal(d.occurrences[original].history.length, 1)
})
test("deleting a routine removes pending work but preserves history", () => {
  const d = store()
  d.taskOrder = ["t"]
  materialize(d, "2026-03-03")
  deleteTask(d, "t", "2026-03-03")
  assert.equal(d.tasks.length, 0)
  assert.deepEqual(d.taskOrder, [])
  assert.ok(d.occurrences["t:2026-03-02"])
  assert.equal(d.occurrences["t:2026-03-03"], undefined)
  materialize(d, "2026-03-04")
  assert.equal(d.occurrences["t:2026-03-04"], undefined)
  assert.throws(() => deleteTask(d, "missing", "2026-03-04"), /Task not found/)
})
test("deleting a task keeps today's completion and accepts AI Interview", () => {
  const d = store()
  materialize(d, "2026-03-01")
  d.occurrences["t:2026-03-01"].status = "completed"
  deleteTask(d, "t", "2026-03-01")
  assert.equal(d.occurrences["t:2026-03-01"].status, "completed")
  assert.equal(validateTask({ ...spec, category: "AI Interview" }).category, "AI Interview")
})
test("category CRUD preserves tasks and occurrence history", () => {
  const d = store()
  d.categories = ["Learning", "Hobbies"]
  materialize(d, "2026-03-01")
  changeCategory(d, { method: "create", name: "My custom category" })
  assert.ok(d.categoryGroups!.routines.includes("My custom category"))
  assert.throws(() => changeCategory(d, { method: "create", name: "learning", previous: "Learning" }), /already exists/)
  changeCategory(d, { method: "rename", previous: "Learning", name: "AI practice" })
  assert.equal(d.tasks[0].category, "AI practice")
  assert.equal(d.tasks[0].versions[0].spec.category, "AI practice")
  assert.equal(d.occurrences["t:2026-03-01"].task.category, "AI practice")
  assert.throws(() => changeCategory(d, { method: "delete", previous: "AI practice", name: "Missing" }), /another category/)
  changeCategory(d, { method: "delete", previous: "AI practice", name: "Hobbies" })
  assert.equal(d.tasks[0].category, "Hobbies")
  assert.equal(d.occurrences["t:2026-03-01"].task.category, "Hobbies")
  assert.ok(!d.categoryGroups!.routines.includes("AI practice"))
})
test("routine category edits do not change one-off categories or tasks", () => {
  const d = store()
  d.categories = ["Learning", "Hobbies"]
  d.tasks.push({ ...structuredClone(d.tasks[0]), id: "once", recurrence: "once", versions: [{ from: spec.startDate, spec: { ...spec, recurrence: "once" } }] })
  materialize(d, "2026-03-01")
  initializeOrganization(d)
  changeCategory(d, { method: "rename", kind: "routines", previous: "Learning", name: "Research" })
  assert.ok(d.categoryGroups!.once.includes("Learning"))
  assert.equal(d.tasks[1].category, "Learning")
  assert.equal(d.occurrences["once:2026-03-01"].task.category, "Learning")
  changeCategory(d, { method: "create", kind: "once", name: "Research" })
  assert.ok(d.categoryGroups!.once.includes("Research"))
})
test("drop before/after and category moves preserve completed history", () => {
  const d = store()
  d.categories = ["Learning", "Hobbies"]
  d.tasks.push({ ...structuredClone(d.tasks[0]), id: "b" })
  d.taskOrder = ["t"] // Simulates new tasks absent from an old order.
  materialize(d, "2026-03-02")
  d.occurrences["t:2026-03-01"].status = "completed"
  moveTask(d, "2026-03-02", { id: "t", targetId: "b", placement: "after" })
  assert.deepEqual(d.taskOrder, ["b", "t"])
  moveTask(d, "2026-03-02", { id: "t", targetId: "b", placement: "before" })
  assert.deepEqual(d.taskOrder, ["t", "b"])
  moveTask(d, "2026-03-02", { id: "t", category: "Hobbies" })
  assert.equal(d.tasks[0].category, "Hobbies")
  assert.equal(d.occurrences["t:2026-03-01"].task.category, "Learning")
  assert.equal(d.occurrences["t:2026-03-02"].task.category, "Hobbies")
  assert.throws(() => moveTask(d, "2026-03-02", { id: "t", category: "Missing" }), /existing category/)
})
test("undo restores pending work and survives category rename; expired undo rejected", () => {
  const d = store()
  d.categories = ["Learning"]
  materialize(d, "2026-03-01")
  deleteTask(d, "t", "2026-03-01", 1000)
  changeCategory(d, { method: "rename", previous: "Learning", name: "Research" })
  restoreTask(d, "t", 2000)
  assert.equal(d.tasks[0].category, "Research")
  assert.equal(d.occurrences["t:2026-03-01"].task.category, "Research")
  assert.deepEqual(d.taskOrder, ["t"])
  assert.throws(() => restoreTask(d, "t", 3000), /no longer/)
  deleteTask(d, "t", "2026-03-01", 3000)
  assert.throws(() => restoreTask(d, "t", 603001), /no longer/)
})
test("Top 3 enforces its limit and ignores moved or skipped selections", () => {
  const d = store()
  for (const id of ["b", "c", "d"]) d.tasks.push({ ...structuredClone(d.tasks[0]), id })
  materialize(d, "2026-03-01")
  for (const id of ["t", "b", "c"]) setFocus(d, "2026-03-01", `${id}:2026-03-01`, true)
  assert.throws(() => setFocus(d, "2026-03-01", "d:2026-03-01", true), /three priorities/)
  d.occurrences["b:2026-03-01"].status = "skipped"
  setFocus(d, "2026-03-01", "d:2026-03-01", true)
  assert.equal(d.focus!["2026-03-01"].length, 3)
  assert.throws(() => setFocus(d, "2026-03-02", "d:2026-03-01", true), /today/)
})
test("all recurrence modes, pause and inclusive boundaries", () => {
  assert.equal(scheduled(spec, "2026-02-28"), false)
  assert.equal(
    scheduled({ ...spec, endDate: "2026-03-02" }, "2026-03-02"),
    true,
  )
  assert.equal(
    scheduled({ ...spec, endDate: "2026-03-02" }, "2026-03-03"),
    false,
  )
  assert.equal(scheduled({ ...spec, paused: true }, "2026-03-02"), false)
  assert.equal(
    scheduled({ ...spec, recurrence: "weekdays" }, "2026-03-02"),
    true,
  )
  assert.equal(
    scheduled({ ...spec, recurrence: "weekdays" }, "2026-03-03"),
    false,
  )
  assert.equal(scheduled({ ...spec, recurrence: "weekly" }, "2026-03-08"), true)
  assert.equal(
    scheduled({ ...spec, recurrence: "weekly" }, "2026-03-09"),
    false,
  )
  assert.equal(scheduled({ ...spec, recurrence: "once" }, "2026-03-01"), true)
  assert.equal(scheduled({ ...spec, recurrence: "once" }, "2026-03-02"), false)
})
test("time zones and DST do not shift calendar dates", () => {
  assert.equal(
    localDate(new Date("2026-09-29T18:29:59Z"), "Asia/Kolkata"),
    "2026-09-29",
  )
  assert.equal(
    localDate(new Date("2026-09-29T18:30:00Z"), "Asia/Kolkata"),
    "2026-09-30",
  )
  assert.equal(
    localDate(new Date("2026-03-08T04:59:59Z"), "America/New_York"),
    "2026-03-07",
  )
  assert.equal(
    localTime(new Date("2026-03-08T07:00:00Z"), "America/New_York"),
    "03:00",
  )
  assert.equal(addDays("2026-03-08", 1), "2026-03-09")
  assert.equal(addDays("2028-02-28", 1), "2028-02-29")
})
test("fresh daily occurrences, catch-up, duplicate retries and completion history", () => {
  const d = store()
  materialize(d, "2026-03-01")
  changeOccurrence(d.occurrences["t:2026-03-01"], "completed", new Date())
  changeOccurrence(d.occurrences["t:2026-03-01"], "completed", new Date())
  materialize(d, "2026-03-03")
  materialize(d, "2026-03-03")
  assert.equal(Object.keys(d.occurrences).length, 3)
  assert.equal(d.occurrences["t:2026-03-02"].status, "pending")
  assert.equal(d.occurrences["t:2026-03-01"].history.length, 1)
})
test("versioned schedules preserve historical denominators", () => {
  const d = store()
  materialize(d, "2026-03-02")
  d.tasks[0].versions.push({
    from: "2026-03-03",
    spec: { ...spec, paused: true },
  })
  materialize(d, "2026-03-05")
  assert.equal(Object.keys(d.occurrences).length, 2)
  assert.equal(summary(Object.values(d.occurrences)).total, 2)
})
test("reschedule preserves identity, history and future routine", () => {
  const d = store()
  materialize(d, "2026-03-01")
  const row = d.occurrences["t:2026-03-01"]
  changeOccurrence(row, "reschedule", new Date(), "2026-03-03")
  changeOccurrence(row, "reschedule", new Date(), "2026-03-03")
  materialize(d, "2026-03-03")
  assert.equal(row.history.length, 1)
  assert.equal(
    Object.values(d.occurrences).filter((r) => r.date === "2026-03-01").length,
    0,
  )
  assert.equal(
    Object.values(d.occurrences).filter((r) => r.date === "2026-03-03").length,
    2,
  )
})
test("a weekly routine is materialized once a week, never once a day", () => {
  const d = store()
  d.tasks[0].versions[0].spec.recurrence = "weekly"
  d.tasks[0].recurrence = "weekly"
  materialize(d, "2026-03-29")
  const dates = Object.values(d.occurrences)
    .filter((r) => r.taskId === "t")
    .map((r) => r.date)
    .sort()
  // 2026-03-01 is a Sunday; only Sundays are due.
  assert.deepEqual(dates, [
    "2026-03-01",
    "2026-03-08",
    "2026-03-15",
    "2026-03-22",
    "2026-03-29",
  ])
  for (const date of ["2026-03-02", "2026-03-05", "2026-03-28"])
    assert.equal(
      summary(Object.values(d.occurrences).filter((r) => r.date === date))
        .total,
      0,
      `${date} must have no denominator for a weekly routine`,
    )
})
test("cadence copy names how often a task is due", () => {
  assert.equal(cadenceOf({ ...spec, recurrence: "daily" }).perWeek, 7)
  const weekly = cadenceOf({ ...spec, recurrence: "weekly" })
  assert.equal(weekly.perWeek, 1)
  assert.equal(weekly.label, "Once a week · Sun")
  assert.match(weekly.note, /Only once a week, on Sun/)
  assert.equal(cadenceOf({ ...spec, recurrence: "weekdays" }).perWeek, 2)
  assert.equal(
    cadenceOf({ ...spec, recurrence: "weekdays", weekdays: [4] }).label,
    "Once a week · Thu",
  )
  const once = cadenceOf({ ...spec, recurrence: "once" })
  assert.equal(once.kind, "One-off")
  assert.equal(cadenceOf({ ...spec, recurrence: "daily" }).kind, "Routine")
})
test("skips stay in denominator; off-days do not break weekly consistency", () => {
  const d = store()
  d.tasks[0].versions[0].spec.recurrence = "weekly"
  materialize(d, "2026-03-09")
  Object.values(d.occurrences).forEach((r) =>
    changeOccurrence(r, "completed", new Date()),
  )
  assert.equal(consistency(Object.values(d.occurrences), "2026-03-10"), 2)
  changeOccurrence(d.occurrences["t:2026-03-08"], "skipped", new Date())
  assert.deepEqual(summary(Object.values(d.occurrences)), {
    total: 2,
    completed: 1,
    skipped: 1,
    pending: 0,
    rate: 50,
  })
  assert.equal(consistency(Object.values(d.occurrences), "2026-03-10"), 0)
  assert.equal(summary([]).rate, null)
})
test("reminder retry, time-zone change and DST repeated hour cannot duplicate", () => {
  const d = store()
  d.settings = {
    timeZone: "America/New_York",
    remindersEnabled: true,
    reminderTime: "01:30",
  }
  const first = new Date("2026-11-01T05:30:00Z"),
    second = new Date("2026-11-01T06:30:00Z")
  assert.ok(claimReminder(d, "device", first))
  assert.equal(claimReminder(d, "device", second), null)
  d.settings.timeZone = "Europe/London"
  assert.equal(claimReminder(d, "device", second), null)
  assert.ok(claimReminder(d, "other-device", second))
  d.settings.remindersEnabled = false
  assert.equal(claimReminder(d, "new-device", second), null)
})
test("spring-forward skipped reminder time sends on first later check", () => {
  const d = store()
  d.settings = {
    timeZone: "America/New_York",
    remindersEnabled: true,
    reminderTime: "02:30",
  }
  assert.equal(
    claimReminder(d, "device", new Date("2026-03-08T06:59:00Z")),
    null,
  )
  assert.ok(claimReminder(d, "device", new Date("2026-03-08T07:00:00Z")))
})

test("time-zone travel cannot duplicate an already-recorded date", () => {
  const d = store()
  materialize(d, "2026-03-03")
  d.settings.timeZone = "America/Los_Angeles"
  materialize(d, "2026-03-02")
  materialize(d, "2026-03-03")
  assert.equal(Object.keys(d.occurrences).length, 3)
  assert.equal(d.occurrences["t:2026-03-01"].timeZone, "Asia/Kolkata")
})

test("two obligations on one date do not hide an unfinished past task", () => {
  const d = store()
  materialize(d, "2026-03-02")
  const first = d.occurrences["t:2026-03-01"]
  changeOccurrence(first, "reschedule", new Date(), "2026-03-02")
  changeOccurrence(first, "completed", new Date())
  assert.equal(consistency(Object.values(d.occurrences), "2026-03-03"), 0)
})

test("parallel scheduler claims reserve only one send per device and date", async () => {
  const dir = await mkdtemp(path.join(tmpdir(), "day-tracker-test-"))
  const file = path.join(dir, "store.json")
  try {
    await updateStore((s) => {
      s.daily = store()
      s.daily.settings.remindersEnabled = true
    }, file)
    const results = await Promise.all(
      Array.from({ length: 8 }, () =>
        updateStore(
          (s) =>
            claimReminder(s.daily!, "device", new Date("2026-03-01T04:00:00Z")),
          file,
        ),
      ),
    )
    assert.equal(results.filter(Boolean).length, 1)
  } finally {
    assert.ok(
      path
        .resolve(dir)
        .startsWith(path.join(path.resolve(tmpdir()), "day-tracker-test-")),
    )
    await rm(dir, { recursive: true, force: true })
  }
})
test("invalid dates, unsafe URLs and empty weekday selections rejected", () => {
  for (const change of [
    { url: "javascript:alert(1)" },
    { url: "//evil.com" },
    { startDate: "2026-02-30" },
    { recurrence: "weekdays", weekdays: [] },
    { minutes: NaN },
  ])
    assert.throws(() => validateTask({ ...spec, ...change }))
  assert.equal(
    validateTask({ ...spec, url: "/watch/lesson" }).url,
    "/watch/lesson",
  )
})
test("atomic store preserves legacy keys and serializes concurrent writes", async () => {
  const dir = await mkdtemp(path.join(tmpdir(), "day-tracker-test-"))
  const file = path.join(dir, "store.json")
  try {
    await writeFile(
      file,
      JSON.stringify({
        lessons: { old: { completed: true } },
        savedLinks: ["private-link"],
      }),
    )
    await Promise.all(
      Array.from({ length: 12 }, (_, i) =>
        updateStore((s) => {
          s.lessons[`new-${i}`] = {
            completed: false,
            positionSeconds: i,
            updatedAt: "test",
          }
        }, file),
      ),
    )
    const s = await readStore(file)
    assert.equal(Object.keys(s.lessons).length, 13)
    assert.deepEqual(s.savedLinks, ["private-link"])
    await writeFile(file, "broken json")
    await assert.rejects(updateStore(() => undefined, file))
    assert.equal(await readFile(file, "utf8"), "broken json")
  } finally {
    assert.ok(
      path
        .resolve(dir)
        .startsWith(path.join(path.resolve(tmpdir()), "day-tracker-test-")),
    )
    await rm(dir, { recursive: true, force: true })
  }
})
