import type { ReactNode } from "react"
import type { TaskSpec } from "@/lib/daily-model"
export type Catalog = Array<{
  id: string
  title: string
  category: string
  totalLessons: number
  lessons: Array<{ id: string; title: string }>
}>
export type Save = (body: Record<string, unknown>) => Promise<boolean>
export const field =
  "min-h-11 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-base outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/15"
export const button =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-medium hover:bg-zinc-50 disabled:opacity-50 disabled:cursor-not-allowed"
export const primary = `${button} border-emerald-900! bg-emerald-900! text-white hover:bg-emerald-800!`
export function Label({
  name,
  children,
}: {
  name: string
  children: ReactNode
}) {
  return (
    <label className="block space-y-2 text-sm font-medium">
      <span>{name}</span>
      {children}
    </label>
  )
}
export const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
export type Tone = "sky" | "violet" | "amber"
const tones: Record<Tone, string> = {
  sky: "bg-sky-50 text-sky-900 ring-sky-200",
  violet: "bg-violet-50 text-violet-900 ring-violet-200",
  amber: "bg-amber-50 text-amber-900 ring-amber-200",
}
export function Badge({
  tone,
  title,
  children,
}: {
  tone: Tone
  title?: string
  children: ReactNode
}) {
  return (
    <span
      title={title}
      className={`inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-[11px] font-semibold ring-1 ${tones[tone]}`}
    >
      {children}
    </span>
  )
}
const weekdayOf = (date: string) =>
  days[new Date(`${date}T12:00:00Z`).getUTCDay()] ?? "its start day"
// One source of truth for how often a task is due, so Today, Routines and
// Consistency never imply a weekly task is expected every day.
export function cadenceOf(task: TaskSpec) {
  const routine = { kind: "Routine", kindTone: "sky" as Tone }
  if (task.recurrence === "once")
    return {
      kind: "One-off",
      kindTone: "amber" as Tone,
      label: "Do once",
      tone: "amber" as Tone,
      note: "One-off task — do it once, any day. It stays here until you complete it.",
      perWeek: 0,
    }
  if (task.recurrence === "weekly")
    return {
      ...routine,
      label: `Once a week · ${weekdayOf(task.startDate)}`,
      tone: "violet" as Tone,
      note: `Only once a week, on ${weekdayOf(task.startDate)}. Other days are not counted against it.`,
      perWeek: 1,
    }
  if (task.recurrence === "weekdays") {
    const chosen = [...task.weekdays].sort((a, b) => a - b).map((d) => days[d])
    return {
      ...routine,
      label:
        chosen.length === 1
          ? `Once a week · ${chosen[0]}`
          : `${chosen.length}× a week · ${chosen.join(", ")}`,
      tone: chosen.length <= 2 ? ("violet" as Tone) : ("sky" as Tone),
      note:
        chosen.length === 1
          ? `Only once a week, on ${chosen[0]}. Other days are not counted against it.`
          : `Only on ${chosen.join(", ")} — ${chosen.length} days a week. Other days are not counted against it.`,
      perWeek: chosen.length,
    }
  }
  return {
    ...routine,
    label: "Every day",
    tone: "sky" as Tone,
    note: "",
    perWeek: 7,
  }
}
