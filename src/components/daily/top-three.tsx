"use client"
import { visibleOn } from "@/lib/daily-model"
import type { DailyView } from "@/lib/daily-store"
import type { Save } from "./daily-ui"
import OccurrenceCard from "./occurrence-card"

export default function TopThree({ data, save, busy, kind }: { data: DailyView; save: Save; busy: boolean; kind: "routines" | "once" }) {
  const today = data.occurrences.filter((row) => visibleOn(row, data.today, data.today) && row.status !== "skipped")
  const chosen = data.focus.flatMap((id) => today.filter((row) => row.id === id))
  const choices = today.filter((row) => (row.task.recurrence === "once") === (kind === "once"))
  return <section className="space-y-4 rounded-2xl border border-violet-200 bg-violet-50/60 p-4 sm:p-6" aria-label="Top 3 today">
    <div className="flex flex-wrap items-center justify-between gap-2"><h2 className="text-lg font-semibold text-violet-950">Top 3 today</h2><span className="text-sm text-violet-800">{chosen.filter((row) => row.status === "completed").length}/{chosen.length} done</span></div>
    <p className="text-sm text-zinc-600">Choose up to three tasks to focus on. Your selection starts fresh each day.</p>
    {!chosen.length && <p className="text-sm text-violet-800">No priorities selected yet.</p>}
    {chosen.map((row) => <OccurrenceCard key={row.id} row={row} today={data.today} save={save} busy={busy} />)}
    <details className="rounded-xl border border-violet-200 bg-white p-3"><summary className="cursor-pointer py-1 text-sm font-medium text-violet-800">Choose or change priorities ({chosen.length}/3)</summary>
      <div className="mt-3 space-y-1">{choices.map((row) => <label key={row.id} className="flex min-h-11 items-center gap-3 rounded-lg px-2 text-sm hover:bg-violet-50"><input type="checkbox" className="size-5 accent-violet-600" checked={data.focus.includes(row.id)} disabled={busy || (!data.focus.includes(row.id) && chosen.length >= 3)} onChange={(event) => save({ action: "focus", id: row.id, selected: event.target.checked })} /><span>{row.task.title}<span className="ml-2 text-xs text-zinc-500">{row.task.category}</span></span></label>)}</div>
      {!choices.length && <p className="text-sm text-zinc-500">{kind === "once" ? "No unfinished one-off tasks." : "No routines scheduled for today."}</p>}
    </details>
  </section>
}
