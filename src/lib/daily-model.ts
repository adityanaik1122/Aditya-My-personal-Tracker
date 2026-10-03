// Pure calendar/domain logic: no browser, Next.js, storage or AI dependency.
export const categories = [
  "Morning Routine",
  "Mental and physical Health",
  "IT Study",
  "Design Study",
  "Hobbies",
  "AI Interview",
] as const
export type Category = string
export type TaskKind = "routines" | "once"
export const taskKindOf = (task: TaskSpec): TaskKind => task.recurrence === "once" ? "once" : "routines"
export type Recurrence = "daily" | "weekdays" | "weekly" | "once"
export interface TaskSpec {
  title: string
  category: Category
  url: string
  notes: string
  minutes: number
  priority: "low" | "normal" | "high"
  startDate: string
  endDate: string
  recurrence: Recurrence
  weekdays: number[]
  paused: boolean
  courseId: string
}
export interface Task extends TaskSpec {
  id: string
  createdDate: string
  versions: Array<{ from: string; spec: TaskSpec }>
}
export interface Resource {
  id: string
  country: string
  title: string
  url: string
  type: "Jobs" | "Government" | "Housing" | "Video" | "Other"
  status: "To review" | "Saved" | "Reviewed"
  notes: string
  createdAt: string
}
export interface Occurrence {
  id: string
  taskId: string
  scheduledDate: string
  date: string
  timeZone: string
  task: TaskSpec
  status: "pending" | "completed" | "skipped"
  history: Array<{ at: string; action: string; from?: string; to?: string }>
}
export interface CoursePlan {
  status: "later" | "active" | "finished"
  resumeUrl: string
  note: string
  updatedAt: string
}
export interface Subscription {
  endpoint: string
  keys: { p256dh: string; auth: string }
  createdAt: string
  owner: "owner"
}
export interface Delivery {
  state: "claimed" | "sent" | "failed"
  at: string
  detail?: string
}
export interface DailyStore {
  version: 1
  settings: {
    timeZone: string
    reminderTime: string
    remindersEnabled: boolean
  }
  tasks: Task[]
  categories?: string[]
  categoryGroups?: Record<TaskKind, string[]>
  focus?: Record<string, string[]>
  deletedTasks?: Array<{ task: Task; occurrences: Occurrence[]; position: number; expiresAt: number }>
  taskOrder?: string[]
  resources?: Resource[]
  occurrences: Record<string, Occurrence>
  through: string
  coursePlans: Record<string, CoursePlan>
  subscriptions: Subscription[]
  deliveries: Record<string, Delivery>
  schedulerLastSeen?: string
}
export function initializeOrganization(store: DailyStore) {
  store.categoryGroups ??= {
    routines: [...(store.categories ?? categories)],
    once: [...new Set(["Errands", "Applications", "Projects", "Appointments", ...store.tasks.filter((t) => t.recurrence === "once").map((t) => t.category), ...Object.values(store.occurrences).filter((r) => r.task.recurrence === "once").map((r) => r.task.category)])],
  }
  const ids = new Set(store.tasks.map((task) => task.id))
  store.taskOrder = [...new Set([...(store.taskOrder ?? []).filter((id) => ids.has(id)), ...ids])]
}
export function deleteTask(store: DailyStore, id: string, today: string, now = Date.now()) {
  if (!store.tasks.some((task) => task.id === id)) throw new Error("Task not found.")
  initializeOrganization(store)
  const removed = Object.values(store.occurrences).filter((row) => row.taskId === id && (row.date >= today || row.task.recurrence === "once") && row.status === "pending")
  store.deletedTasks = [...(store.deletedTasks ?? []).filter((entry) => entry.expiresAt > now), {
    task: structuredClone(store.tasks.find((task) => task.id === id)!),
    occurrences: structuredClone(removed), position: store.taskOrder!.indexOf(id), expiresAt: now + 10 * 60 * 1000,
  }].slice(-10)
  store.tasks = store.tasks.filter((task) => task.id !== id)
  store.taskOrder = store.taskOrder?.filter((taskId) => taskId !== id)
  for (const [key, row] of Object.entries(store.occurrences)) {
    // Retain past records and completed/skipped history for accurate insights.
    if (row.taskId === id && (row.date >= today || row.task.recurrence === "once") && row.status === "pending") {
      delete store.occurrences[key]
    }
  }
}
export function restoreTask(store: DailyStore, id: string, now = Date.now()) {
  const entry = store.deletedTasks?.find((item) => item.task.id === id && item.expiresAt > now)
  if (!entry || store.tasks.some((task) => task.id === id)) throw new Error("This task can no longer be restored.")
  store.tasks.push(entry.task)
  initializeOrganization(store)
  store.taskOrder = store.taskOrder!.filter((taskId) => taskId !== id)
  store.taskOrder.splice(Math.max(0, entry.position), 0, id)
  for (const row of entry.occurrences) store.occurrences[row.id] ??= row
  store.deletedTasks = store.deletedTasks!.filter((item) => item.task.id !== id)
}
export function setFocus(store: DailyStore, today: string, id: string, selected: boolean) {
  const row = store.occurrences[id]
  if (!row || !visibleOn(row, today, today) || row.status === "skipped") throw new Error("Choose a task scheduled for today.")
  const ids = (store.focus?.[today] ?? []).filter((key) => store.occurrences[key] && visibleOn(store.occurrences[key], today, today) && store.occurrences[key]?.status !== "skipped")
  const next = ids.filter((key) => key !== id)
  if (selected) next.push(id)
  if (next.length > 3) throw new Error("Choose up to three priorities for today.")
  store.focus ??= {}
  store.focus[today] = next
}
export function moveTask(store: DailyStore, today: string, body: Record<string, unknown>) {
  initializeOrganization(store)
  const task = store.tasks.find((item) => item.id === body.id)
  const target = store.tasks.find((item) => item.id === body.targetId)
  if (!task) throw new Error("Task no longer exists.")
  const kind = taskKindOf(task)
  if (target && taskKindOf(target) !== kind) throw new Error("Move tasks within the same task type.")
  if (body.targetId && !target) throw new Error("Drop target no longer exists.")
  if (target?.id === task.id) return
  const category = target?.category ?? body.category
  if (typeof category !== "string" || !store.categoryGroups![kind].includes(category)) throw new Error("Choose an existing category.")
  task.category = category
  const spec = validateTask(task)
  task.versions = [...task.versions.filter((version) => version.from < today), { from: today, spec }]
  for (const row of Object.values(store.occurrences)) if (row.taskId === task.id && (row.date >= today || row.task.recurrence === "once") && row.status === "pending") row.task.category = category
  const order = store.taskOrder!.filter((id) => id !== task.id)
  const index = target ? order.indexOf(target.id) + (body.placement === "after" ? 1 : 0) : order.length
  order.splice(index, 0, task.id)
  store.taskOrder = order
}
export function changeCategory(store: DailyStore, body: Record<string, unknown>) {
  initializeOrganization(store)
  const kind = body.kind === "once" ? "once" : "routines"
  const list = store.categoryGroups![kind]
  const name = typeof body.name === "string" ? body.name.trim() : ""
  const previous = typeof body.previous === "string" ? body.previous : ""
  if (!["create", "rename", "delete"].includes(String(body.method))) throw new Error("Invalid category action.")
  if (body.method !== "create" && !list.includes(previous)) throw new Error("Category no longer exists. Reload and try again.")
  if (body.method === "delete") {
    if (name === previous || !list.includes(name)) throw new Error("Choose another category to move tasks into.")
  } else {
    if (!name || name.length > 60) throw new Error("Use a category name between 1 and 60 characters.")
    if (list.some((item) => (body.method === "create" || item !== previous) && item.toLowerCase() === name.toLowerCase())) throw new Error("That category already exists.")
  }
  if (body.method === "create") {
    store.categoryGroups![kind] = [...list, name]
    return
  }
  // Category labels are shared by tasks, their versions and historical snapshots.
  for (const task of [...store.tasks, ...(store.deletedTasks ?? []).map((entry) => entry.task)]) {
    if (taskKindOf(task) === kind && task.category === previous) task.category = name
    for (const version of task.versions) if (taskKindOf(version.spec) === kind && version.spec.category === previous) version.spec.category = name
  }
  for (const row of [...Object.values(store.occurrences), ...(store.deletedTasks ?? []).flatMap((entry) => entry.occurrences)]) if (taskKindOf(row.task) === kind && row.task.category === previous) row.task.category = name
  store.categoryGroups![kind] = body.method === "delete" ? list.filter((item) => item !== previous) : list.map((item) => item === previous ? name : item)
}
export function localDate(now: Date, timeZone: string) {
  const p = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now)
  const get = (type: string) => p.find((x) => x.type === type)!.value
  return `${get("year")}-${get("month")}-${get("day")}`
}
export function localTime(now: Date, timeZone: string) {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).format(now)
}
export function validDate(value: string) {
  return (
    /^\d{4}-\d{2}-\d{2}$/.test(value) &&
    !Number.isNaN(Date.parse(value)) &&
    new Date(value).toISOString().slice(0, 10) === value
  )
}
export function addDays(date: string, days: number) {
  const d = new Date(`${date}T12:00:00Z`)
  d.setUTCDate(d.getUTCDate() + days)
  return d.toISOString().slice(0, 10)
}
export function scheduled(spec: TaskSpec, date: string) {
  if (
    spec.paused ||
    date < spec.startDate ||
    (spec.endDate && date > spec.endDate)
  )
    return false
  const weekday = new Date(`${date}T12:00:00Z`).getUTCDay()
  return (
    spec.recurrence === "daily" ||
    (spec.recurrence === "once" && date === spec.startDate) ||
    (spec.recurrence === "weekdays" && spec.weekdays.includes(weekday)) ||
    (spec.recurrence === "weekly" &&
      weekday === new Date(`${spec.startDate}T12:00:00Z`).getUTCDay())
  )
}
export function specOn(task: Task, date: string): TaskSpec | undefined {
  return task.versions.filter((v) => v.from <= date).at(-1)?.spec
}
export function materialize(store: DailyStore, today: string) {
  // One-off work has one persistent record, independent of calendar scheduling.
  // Reuse legacy IDs/history so previously dated tasks are recovered, not copied.
  for (const task of store.tasks.filter((t) => t.recurrence === "once")) {
    const existing = Object.values(store.occurrences).filter((r) => r.taskId === task.id && r.task.recurrence === "once")
    if (!existing.length && !task.paused) {
      const legacyId = `${task.id}:${task.createdDate}`
      const id = store.occurrences[legacyId] ? `${task.id}:once` : legacyId
      store.occurrences[id] ??= { id, taskId: task.id, scheduledDate: task.createdDate, date: task.createdDate,
        timeZone: store.settings.timeZone, task: validateTask(task), status: "pending", history: [] }
    }
    for (const row of existing) if (row.status === "pending") row.task = validateTask(task)
  }
  // Calendar arithmetic is UTC date-only; local midnight is never advanced by 24h.
  // Existing keys survive retries and time-zone changes, preserving recorded history.
  let from = store.through ? addDays(store.through, 1) : today
  if (from > today) from = today
  for (let date = from; date <= today; date = addDays(date, 1)) {
    for (const task of store.tasks) {
      if (task.recurrence === "once") continue
      const spec = specOn(task, date)
      if (!spec || date < task.createdDate || !scheduled(spec, date)) continue
      const id = `${task.id}:${date}`
      const url =
        spec.url ||
        (spec.courseId
          ? store.coursePlans[spec.courseId]?.resumeUrl ||
            `/courses/${spec.courseId}`
          : "")
      store.occurrences[id] ??= {
        id,
        taskId: task.id,
        scheduledDate: date,
        date,
        timeZone: store.settings.timeZone,
        task: { ...spec, url },
        status: "pending",
        history: [],
      }
    }
  }
  if (today > store.through) store.through = today
}
export function visibleOn(row: Occurrence, date: string, today: string) {
  if (row.task.recurrence !== "once") return row.date === date
  if (row.status === "pending") return date === today && !row.task.paused
  return row.date === date
}
export function summary(rows: Occurrence[]) {
  const completed = rows.filter((r) => r.status === "completed").length
  const skipped = rows.filter((r) => r.status === "skipped").length
  return {
    total: rows.length,
    completed,
    skipped,
    pending: rows.length - completed - skipped,
    rate: rows.length ? Math.round((completed / rows.length) * 100) : null,
  }
}
export function consistency(rows: Occurrence[], today: string) {
  // Today's unfinished occurrence is still in progress. Off-days never break a run.
  const eligible = rows
    .filter((r) => r.date < today || r.status !== "pending")
    .sort((a, b) => b.date.localeCompare(a.date))
  let streak = 0
  for (const date of [...new Set(eligible.map((r) => r.date))]) {
    const group = eligible.filter((r) => r.date === date)
    if (group.some((r) => r.status !== "completed")) break
    streak += group.length
  }
  return streak
}
export function changeOccurrence(
  row: Occurrence,
  action: string,
  now: Date,
  to?: string,
) {
  if (action === "reschedule") {
    if (row.task.recurrence === "once") throw new Error("One-off tasks are available anytime and do not need rescheduling.")
    if (!to || !validDate(to)) throw new Error("Choose a valid new date.")
    if (row.status !== "pending")
      throw new Error("Undo completion or skip before rescheduling.")
    if (row.date === to) return
    row.history.push({ at: now.toISOString(), action, from: row.date, to })
    row.date = to
  } else {
    if (!["pending", "completed", "skipped"].includes(action))
      throw new Error("Invalid occurrence action.")
    if (row.status === action) return
    if (row.task.recurrence === "once" && action !== "pending") row.date = localDate(now, row.timeZone)
    row.status = action as Occurrence["status"]
    row.history.push({ at: now.toISOString(), action })
  }
}
export function claimReminder(
  store: DailyStore,
  endpointId: string,
  now: Date,
) {
  const date = localDate(now, store.settings.timeZone)
  // Date only, not time-zone name: travelling or changing reminder time cannot resend that date.
  const key = `${date}:${endpointId}`
  if (
    !store.settings.remindersEnabled ||
    localTime(now, store.settings.timeZone) < store.settings.reminderTime ||
    store.deliveries[key]
  )
    return null
  store.deliveries[key] = { state: "claimed", at: now.toISOString() }
  return key
}
export function safeUrl(value: string) {
  if (!value) return true
  if (/^\/(?![\/\\])/.test(value) && !value.includes("\\")) return true
  try {
    const u = new URL(value)
    return (
      ["https:", "http:"].includes(u.protocol) && !u.username && !u.password
    )
  } catch {
    return false
  }
}
export function validateTask(value: unknown): TaskSpec {
  if (!value || typeof value !== "object") throw new Error("Invalid task.")
  const x = value as TaskSpec
  for (const key of [
    "title",
    "category",
    "url",
    "notes",
    "priority",
    "startDate",
    "endDate",
    "recurrence",
    "courseId",
  ] as const) {
    if (typeof x[key] !== "string") throw new Error(`Invalid ${key}.`)
  }
  if (
    !x.title.trim() ||
    x.title.length > 120 ||
    x.notes.length > 2000 ||
    x.url.length > 2048 ||
    !safeUrl(x.url)
  )
    throw new Error(
      "Use a title (up to 120 characters) and a valid http(s) or local link.",
    )
  if (
    !x.category.trim() || x.category.length > 60 ||
    !["daily", "weekdays", "weekly", "once"].includes(x.recurrence) ||
    !["low", "normal", "high"].includes(x.priority)
  )
    throw new Error("Invalid category, recurrence or priority.")
  if (
    !validDate(x.startDate) ||
    (x.endDate && (!validDate(x.endDate) || x.endDate < x.startDate))
  )
    throw new Error("Check the start and end dates.")
  if (
    !Array.isArray(x.weekdays) ||
    x.weekdays.some((d) => !Number.isInteger(d) || d < 0 || d > 6) ||
    (x.recurrence === "weekdays" && !x.weekdays.length)
  )
    throw new Error("Select at least one weekday.")
  if (
    !Number.isInteger(x.minutes) ||
    x.minutes < 1 ||
    x.minutes > 1440 ||
    typeof x.paused !== "boolean"
  )
    throw new Error("Estimated minutes must be between 1 and 1440.")
  return {
    title: x.title.trim(),
    category: x.category,
    url: x.url.trim(),
    notes: x.notes.trim(),
    minutes: x.minutes,
    priority: x.priority,
    startDate: x.startDate,
    endDate: x.endDate,
    recurrence: x.recurrence,
    weekdays: [...new Set(x.weekdays)],
    paused: x.paused,
    courseId: x.courseId,
  }
}
export function newDailyStore(now = new Date()): DailyStore {
  const today = localDate(now, "Asia/Kolkata")
  const examples: Array<Partial<TaskSpec> & { title: string }> = [
    { title: "Personal inbox", category: "Morning Routine" },
    { title: "Work inbox", category: "IT Study" },
    { title: "Other inbox", category: "Mental and physical Health" },
    {
      title: "Five minutes of inspiration",
      category: "Hobbies",
      url: "https://www.awwwards.com/",
    },
    { title: "Practise Italian", category: "Hobbies", minutes: 15 },
    { title: "Practise piano", category: "Hobbies", minutes: 15 },
  ]
  return {
    version: 1,
    settings: {
      timeZone: "Asia/Kolkata",
      reminderTime: "08:00",
      remindersEnabled: false,
    },
    tasks: examples.map((example, i) => {
      const spec: TaskSpec = {
        category: "Morning Routine",
        url: "",
        notes: "Editable example — add your link and unpause when ready.",
        minutes: 5,
        priority: "normal",
        startDate: today,
        endDate: "",
        recurrence: "daily",
        weekdays: [],
        paused: true,
        courseId: "",
        ...example,
      }
      return {
        ...spec,
        id: `example-${i}`,
        createdDate: today,
        versions: [{ from: today, spec }],
      }
    }),
    taskOrder: examples.map((_, i) => `example-${i}`),
    resources: [],
    occurrences: {},
    through: addDays(today, -1),
    coursePlans: {},
    subscriptions: [],
    deliveries: {},
  }
}
