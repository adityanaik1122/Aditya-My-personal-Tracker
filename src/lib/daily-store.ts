import "server-only"
import { randomUUID } from "node:crypto"
import { courses } from "@/data/courses"
import { updateStore } from "./store"
import {
  addDays,
  changeOccurrence,
  localDate,
  materialize,
  newDailyStore,
  safeUrl,
  scheduled,
  validateTask,
  type DailyStore,
  type TaskSpec,
} from "./daily-model"

export function dailyTransaction<T>(
  fn: (daily: DailyStore, today: string) => T,
  now = new Date(),
) {
  return updateStore((store) => {
    store.daily ??= newDailyStore(now)
    const daily = store.daily
    daily.taskOrder ??= daily.tasks.map((task) => task.id)
    const legacyCategories: Record<string, "Morning Routine" | "Mental and physical Health" | "IT Study" | "Design Study" | "Hobbies"> = {
      Work: "IT Study",
      Learning: "IT Study",
      Inspiration: "Hobbies",
      Personal: "Mental and physical Health",
    }
    for (const task of daily.tasks) {
      const mapped = legacyCategories[String(task.category)]
      if (mapped) {
        task.category = mapped
        for (const version of task.versions) version.spec.category = mapped
      }
    }
    for (const occurrence of Object.values(daily.occurrences)) {
      const mapped = legacyCategories[String(occurrence.task.category)]
      if (mapped) occurrence.task.category = mapped
    }
    const today = localDate(now, daily.settings.timeZone)
    materialize(daily, today)
    return fn(daily, today)
  })
}
export function dailyView(daily: DailyStore, today: string) {
  return {
    today,
    settings: daily.settings,
    tasks: daily.tasks,
    taskOrder: daily.taskOrder ?? daily.tasks.map((task) => task.id),
    resources: daily.resources ?? [],
    occurrences: Object.values(daily.occurrences),
    coursePlans: daily.coursePlans,
    push: {
      configured: Boolean(
        process.env.VAPID_PUBLIC_KEY &&
        process.env.VAPID_PRIVATE_KEY &&
        process.env.VAPID_SUBJECT,
      ),
      publicKey: process.env.VAPID_PUBLIC_KEY || "",
      schedulerConfigured: Boolean(process.env.CRON_SECRET),
      schedulerLastSeen: daily.schedulerLastSeen || null,
      subscriptions: daily.subscriptions.length,
      deliveries: Object.entries(daily.deliveries)
        .slice(-20)
        .map(([key, value]) => ({ date: key.split(":")[0], ...value })),
    },
  }
}
export type DailyView = ReturnType<typeof dailyView>

export function mutateDaily(
  daily: DailyStore,
  today: string,
  body: Record<string, unknown>,
) {
  if (body.action === "task") {
    const spec = validateTask(body.task)
    if (spec.courseId && !courses.some((c) => c.id === spec.courseId))
      throw new Error("Unknown course.")
    const existing =
      typeof body.id === "string"
        ? daily.tasks.find((t) => t.id === body.id)
        : undefined
    if (body.id && !existing) throw new Error("Task not found.")
    if (
      spec.courseId &&
      existing?.courseId !== spec.courseId &&
      daily.coursePlans[spec.courseId]?.status !== "active"
    )
      throw new Error("Set this course to Active in Study plan first.")
    if (existing) {
      // History before today has already been materialized using the previous version.
      existing.versions = [
        ...existing.versions.filter((v) => v.from < today),
        { from: today, spec },
      ]
      Object.assign(existing, spec)
      const row = daily.occurrences[`${existing.id}:${today}`]
      // Only untouched occurrences can change with a schedule edit. Actions are permanent history.
      if (row && !row.history.length && row.date === today) {
        if (!scheduled(spec, today)) delete daily.occurrences[row.id]
        else
          row.task = {
            ...spec,
            url:
              spec.url ||
              (spec.courseId
                ? daily.coursePlans[spec.courseId]?.resumeUrl ||
                  `/courses/${spec.courseId}`
                : ""),
          }
      }
    } else {
      if (spec.recurrence === "once" && spec.startDate < today)
        throw new Error("New one-off tasks must be scheduled today or later.")
      daily.tasks.push({
        ...spec,
        id: randomUUID(),
        createdDate: today,
        versions: [{ from: today, spec }],
      })
    }
    materialize(daily, today)
  } else if (body.action === "reorder") {
    const id = typeof body.id === "string" ? body.id : ""
    const targetId = typeof body.targetId === "string" ? body.targetId : ""
    const order = daily.taskOrder ?? daily.tasks.map((task) => task.id)
    const index = order.indexOf(id)
    const target = order.indexOf(targetId)
    if (!id || !targetId || id === targetId || index < 0 || target < 0) return
    order.splice(index, 1)
    order.splice(order.indexOf(targetId), 0, id)
    daily.taskOrder = order
  } else if (body.action === "resource") {
    if (body.method === "delete") {
      daily.resources = (daily.resources ?? []).filter((resource) => resource.id !== body.id)
    } else {
      if (typeof body.title !== "string" || !body.title.trim() || typeof body.url !== "string" || !/^https?:\/\//i.test(body.url))
        throw new Error("Add a title and a valid http(s) link.")
      const resource = {
        id: randomUUID(), country: typeof body.country === "string" && body.country.trim() ? body.country.trim() : "Unsorted",
        title: body.title.trim(), url: body.url.trim(), type: ["Jobs", "Government", "Housing", "Video", "Other"].includes(String(body.type)) ? body.type as "Jobs" | "Government" | "Housing" | "Video" | "Other" : "Other",
        status: "To review" as const, notes: typeof body.notes === "string" ? body.notes.trim().slice(0, 1000) : "", createdAt: new Date().toISOString(),
      }
      daily.resources = [resource, ...(daily.resources ?? [])]
    }
  } else if (body.action === "occurrence") {
    if (!Object.hasOwn(daily.occurrences, String(body.id)))
      throw new Error("Occurrence not found.")
    const row = daily.occurrences[String(body.id)]
    if (!row) throw new Error("Occurrence not found.")
    if (
      body.status === "reschedule" &&
      (typeof body.to !== "string" ||
        body.to < today ||
        body.to > addDays(today, 366))
    )
      throw new Error("Reschedule from today up to one year ahead.")
    if (body.status === "completed" && row.date > today)
      throw new Error("Future tasks cannot be completed early.")
    changeOccurrence(
      row,
      String(body.status),
      new Date(),
      typeof body.to === "string" ? body.to : undefined,
    )
  } else if (body.action === "course") {
    const id = String(body.id)
    if (
      !courses.some((c) => c.id === id) ||
      !["later", "active", "finished"].includes(String(body.status))
    )
      throw new Error("Invalid course status.")
    if (
      typeof body.resumeUrl !== "string" ||
      body.resumeUrl.length > 2048 ||
      !safeUrl(body.resumeUrl) ||
      typeof body.note !== "string" ||
      body.note.length > 2000
    )
      throw new Error("Check the resume link and note.")
    daily.coursePlans[id] = {
      status: body.status as "later" | "active" | "finished",
      resumeUrl: body.resumeUrl,
      note: body.note,
      updatedAt: new Date().toISOString(),
    }
  } else if (body.action === "settings") {
    if (
      typeof body.timeZone !== "string" ||
      typeof body.reminderTime !== "string" ||
      !/^([01]\d|2[0-3]):[0-5]\d$/.test(body.reminderTime) ||
      typeof body.remindersEnabled !== "boolean"
    )
      throw new Error("Choose a valid time and time zone.")
    try {
      localDate(new Date(), body.timeZone)
    } catch {
      throw new Error("Use an IANA time zone, such as Asia/Kolkata.")
    }
    daily.settings = {
      timeZone: body.timeZone,
      reminderTime: body.reminderTime,
      remindersEnabled: body.remindersEnabled,
    }
    materialize(daily, localDate(new Date(), body.timeZone))
  } else throw new Error("Unknown action.")
}
// Extension point: an optional assistant may return TaskSpec proposals to the editor.
// It must never call mutateDaily or write completions; saving requires the user's form submission.
export type TaskProposal = { explanation: string; proposedTask: TaskSpec }
