import Link from "next/link"
import { addDays, summary, consistency, visibleOn } from "@/lib/daily-model"
import type { DailyView } from "@/lib/daily-store"
import { Badge, cadenceOf, type Catalog } from "./daily-ui"
import ProgressRing from "./progress-ring"
export default function Insights({
  data,
  catalog,
}: {
  data: DailyView
  catalog: Catalog
}) {
  const rows = data.occurrences.filter((r) => r.date <= data.today && (r.task.recurrence !== "once" || r.status !== "pending"))
  const categories = data.categories
  const todayRows = data.occurrences.filter((r) => visibleOn(r, data.today, data.today))
  const routineRows = todayRows.filter((r) => r.task.recurrence !== "once")
  const oneOffRows = todayRows.filter((r) => r.task.recurrence === "once")
  const todaySummary = summary(todayRows)
  const routineSummary = summary(routineRows)
  const oneOffSummary = summary(oneOffRows)
  const categoryColors = ["#10b981", "#06b6d4", "#f59e0b", "#8b5cf6", "#ec4899", "#3b82f6"]
  const categoryMinutes = categories.map((category) => ({
    category,
    minutes: todayRows
      .filter((r) => r.task.category === category)
      .reduce((total, r) => total + r.task.minutes, 0),
  }))
  const totalMinutes = categoryMinutes.reduce((total, item) => total + item.minutes, 0)
  let categoryOffset = 0
  const categoryStops = categoryMinutes.map((item, index) => {
    const start = totalMinutes ? (categoryOffset / totalMinutes) * 100 : 0
    categoryOffset += item.minutes
    const end = totalMinutes ? (categoryOffset / totalMinutes) * 100 : 0
    return `${categoryColors[index % categoryColors.length]} ${start}% ${end}%`
  })
  const windows = [
    { label: "Today", start: data.today },
    { label: "Last 7 days", start: addDays(data.today, -6) },
    { label: "Last 30 days", start: addDays(data.today, -29) },
  ]
  const recent = Array.from({ length: 14 }, (_, i) =>
    addDays(data.today, i - 13),
  )
  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-3">
        {windows.map((w) => {
          const s = summary(rows.filter((r) => r.date >= w.start))
          return (
            <div key={w.label} className="rounded-2xl border bg-white p-5">
              <p className="text-sm text-zinc-500">{w.label}</p>
              <p className="mt-3 text-3xl font-semibold">
                {s.rate === null ? "—" : `${s.rate}%`}
              </p>
              <p className="mt-2 text-xs text-zinc-500">
                {s.completed}/{s.total} completed · {s.skipped} skipped
              </p>
            </div>
          )
        })}
      </div>
      <section className="rounded-2xl border bg-white p-5 sm:p-7">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-sm text-zinc-500">Today at a glance</p>
            <h2 className="mt-1 text-xl font-semibold">Keep the streak moving</h2>
          </div>
          <p className="text-xs text-zinc-500">Completion is counted from scheduled tasks</p>
        </div>
        <div className="mt-6 grid gap-6 sm:grid-cols-3">
          <ProgressRing value={todaySummary.rate} label="All tasks" detail={`${todaySummary.completed}/${todaySummary.total} completed`} />
          <ProgressRing value={routineSummary.rate} label="Routines due today" detail={routineSummary.total ? `${routineSummary.completed}/${routineSummary.total} completed` : "No routine is due today"} tone="sky" />
          <ProgressRing value={oneOffSummary.rate} label="One-off tasks" detail={oneOffSummary.total ? `${oneOffSummary.completed}/${oneOffSummary.total} completed` : "Nothing due today"} tone="amber" />
        </div>
      </section>
      <section className="rounded-2xl border bg-white p-5 sm:p-7">
        <h2 className="font-semibold">The last two weeks</h2>
        <p className="mt-1 text-xs text-zinc-500">
          Routines count on the days they were due; one-off tasks only on the
          day you finished them.
        </p>
        <div className="mt-6 flex h-36 items-end gap-1.5 sm:gap-3">
          {recent.map((date) => {
            const s = summary(rows.filter((r) => r.date === date))
            return (
              <div
                key={date}
                className="flex h-full min-w-0 flex-1 flex-col justify-end text-center"
              >
                <div
                  className="flex h-28 items-end rounded-md bg-zinc-50"
                  title={`${date}: ${s.completed}/${s.total} complete, ${s.skipped} skipped`}
                >
                  <div
                    className="w-full rounded-md bg-gradient-to-t from-emerald-500 to-cyan-400"
                    style={{
                      height:
                        s.rate === null ? "0%" : `${Math.max(3, s.rate)}%`,
                      opacity: s.rate === 0 ? 0.25 : 1,
                    }}
                  />
                </div>
                <span className="mt-2 text-[10px] text-zinc-500">
                  {date.slice(-2)}
                </span>
              </div>
            )
          })}
        </div>
        <details className="mt-5 text-sm">
          <summary className="cursor-pointer text-zinc-500">
            Daily numbers
          </summary>
          <div className="mt-3 overflow-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr>
                  <th className="py-2">Date</th>
                  <th>Complete</th>
                  <th>Scheduled</th>
                  <th>Skipped</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((date) => {
                  const s = summary(rows.filter((r) => r.date === date))
                  return (
                    <tr key={date} className="border-t">
                      <td className="py-2">{date}</td>
                      <td>{s.completed}</td>
                      <td>{s.total}</td>
                      <td>{s.skipped}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </details>
      </section>
      <div className="grid gap-5 lg:grid-cols-2">
        {["weekly", "monthly"].map((period) => {
          const groups = Array.from(
            { length: period === "weekly" ? 6 : 6 },
            (_, i) => {
              if (period === "weekly") {
                const weekday = new Date(`${data.today}T12:00:00Z`).getUTCDay()
                const end = addDays(
                  data.today,
                  (-(weekday + 6) % 7) - i * 7 + 6,
                )
                return {
                  start: addDays(end, -6),
                  end,
                  label: `Week of ${addDays(end, -6)}`,
                }
              }
              const d = new Date(`${data.today.slice(0, 7)}-01T12:00:00Z`)
              d.setUTCMonth(d.getUTCMonth() - i)
              const start = d.toISOString().slice(0, 10)
              d.setUTCMonth(d.getUTCMonth() + 1)
              return {
                start,
                end: addDays(d.toISOString().slice(0, 10), -1),
                label: start.slice(0, 7),
              }
            },
          )
          return (
            <section key={period} className="rounded-2xl border bg-white p-5">
              <h2 className="mb-5 font-semibold">
                {period === "weekly" ? "Weekly" : "Monthly"} completion
              </h2>
              {groups.reverse().map((g) => {
                const s = summary(
                  rows.filter((r) => r.date >= g.start && r.date <= g.end),
                )
                return (
                  <div key={g.start} className="mb-4">
                    <div className="flex justify-between text-xs text-zinc-500">
                      <span>{g.label}</span>
                      <span>
                        {s.rate === null
                          ? "No tasks"
                          : `${s.rate}% · ${s.completed}/${s.total}`}
                      </span>
                    </div>
                    <div className="mt-2 h-2 rounded-full bg-zinc-100">
                      <div
                        className="h-2 rounded-full bg-gradient-to-r from-cyan-400 to-emerald-500"
                        style={{ width: `${s.rate || 0}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </section>
          )
        })}
      </div>
      <section className="rounded-2xl border bg-white p-5">
        <h2 className="mb-5 font-semibold">By category · last 30 days</h2>
        <div className="grid gap-5 sm:grid-cols-2">
          {categories.map((category) => {
            const s = summary(
              rows.filter(
                (r) =>
                  r.date >= addDays(data.today, -29) &&
                  r.task.category === category,
              ),
            )
            return (
              <div key={category}>
                <div className="flex justify-between text-sm">
                  <span>{category}</span>
                  <span className="text-zinc-500">
                    {s.completed}/{s.total} · {s.skipped} skipped
                  </span>
                </div>
                <div className="mt-3 h-2 rounded-full bg-zinc-100">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500"
                    style={{ width: `${s.rate || 0}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </section>
      <section className="rounded-2xl border bg-white p-5 sm:p-7">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="font-semibold">Where today’s time goes</h2>
            <p className="mt-1 text-xs text-zinc-500">Planned minutes by category</p>
          </div>
          <span className="text-sm text-zinc-500">{totalMinutes} min planned</span>
        </div>
        <div className="mt-6 flex flex-wrap items-center gap-7">
          <div
            className="relative size-36 shrink-0 rounded-full"
            style={{ background: totalMinutes ? `conic-gradient(${categoryStops.join(", ")})` : "#f4f4f5" }}
            role="img"
            aria-label="Today’s planned minutes by category"
          >
            <div className="absolute inset-4 flex items-center justify-center rounded-full bg-white text-center">
              <span className="text-xs text-zinc-500">today<br /><strong className="text-lg text-zinc-900">{totalMinutes}m</strong></span>
            </div>
          </div>
          <div className="grid min-w-48 flex-1 gap-3 sm:grid-cols-2">
            {categoryMinutes.map((item, index) => (
              <div key={item.category} className="flex items-center justify-between gap-3 text-sm">
                <span className="flex items-center gap-2"><span className="size-2.5 rounded-full" style={{ backgroundColor: categoryColors[index % categoryColors.length] }} />{item.category}</span>
                <span className="text-zinc-500">{item.minutes}m</span>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="rounded-2xl border-l-4 border-l-sky-300 border bg-white p-5">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2 className="font-semibold">Routines · consistency on your schedule</h2>
          <p className="text-xs text-zinc-500">
            Each routine is counted only on the days it is actually due
          </p>
        </div>
        {!data.tasks.some((t) => t.recurrence !== "once") && (
          <p className="mt-4 text-sm text-zinc-500">No routines yet.</p>
        )}
        {data.tasks
          .filter((t) => t.recurrence !== "once")
          .map((t) => {
            const own = rows.filter((r) => r.taskId === t.id)
            const s = summary(own)
            const month = summary(
              own.filter((r) => r.date >= addDays(data.today, -29)),
            )
            const cadence = cadenceOf(t)
            return (
              <div key={t.id} className="mt-4 border-t pt-4 text-sm">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-medium">{t.title}</span>
                  <Badge tone={cadence.tone} title={cadence.note || undefined}>
                    {cadence.label}
                  </Badge>
                </div>
                <p className="mt-2 text-zinc-500">
                  {s.completed}/{s.total} completed all time · due{" "}
                  {month.total} {month.total === 1 ? "day" : "days"} in the last
                  30 · {consistency(own, data.today)} scheduled occurrences in a
                  row
                </p>
                {cadence.perWeek > 0 && cadence.perWeek < 7 && (
                  <p className="mt-2 inline-flex rounded-lg bg-violet-50 px-2 py-1 text-xs font-medium text-violet-900 ring-1 ring-violet-200">
                    {cadence.note}
                  </p>
                )}
              </div>
            )
          })}
      </section>
      <section className="rounded-2xl border-l-4 border-l-amber-300 border bg-white p-5">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2 className="font-semibold">One-off tasks</h2>
          <p className="text-xs text-zinc-500">
            Counted once, on the day you finish them — never day after day
          </p>
        </div>
        {!data.tasks.some((t) => t.recurrence === "once") && (
          <p className="mt-4 text-sm text-zinc-500">No one-off tasks yet.</p>
        )}
        {data.tasks
          .filter((t) => t.recurrence === "once")
          .map((t) => {
            const own = data.occurrences.filter((r) => r.taskId === t.id)
            const done = own.find((r) => r.status !== "pending")
            return (
              <div
                key={t.id}
                className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t pt-4 text-sm"
              >
                <span className="flex flex-wrap items-center gap-2">
                  <span className="font-medium">{t.title}</span>
                  <Badge tone="amber">Do once</Badge>
                </span>
                <span className="text-zinc-500">
                  {done
                    ? `${done.status === "completed" ? "Completed" : "Skipped"} on ${done.date}`
                    : t.paused
                      ? "Paused"
                      : "Still open · no due date"}
                </span>
              </div>
            )
          })}
      </section>
      <section className="rounded-2xl border bg-white p-5">
        <h2 className="mb-4 font-semibold">Active courses</h2>
        {catalog
          .filter((c) => data.coursePlans[c.id]?.status === "active")
          .map((c) => {
            const s = summary(rows.filter((r) => r.task.courseId === c.id))
            return (
              <div key={c.id} className="border-t py-4">
                <Link href="/study" className="font-medium text-emerald-800">
                  {c.title}
                </Link>
                <p className="mt-1 text-xs text-zinc-500">
                  {s.completed}/{s.total} study tasks completed · last note{" "}
                  {data.coursePlans[c.id].updatedAt.slice(0, 10)}
                </p>
                <p className="mt-2 text-sm">{data.coursePlans[c.id].note}</p>
              </div>
            )
          })}
        <Link href="/study" className="text-sm text-emerald-800 underline">
          Manage study plan
        </Link>
      </section>
      <p className="text-xs leading-6 text-zinc-500">
        Rates = completed ÷ actually scheduled tasks, including intentional
        skips. A weekly routine is only ever counted on its one scheduled
        weekday, and a one-off task only on the day you finish it — neither is
        added to every day. Rescheduled tasks count on their destination date.
        Off-days have no denominator and do not break consistency. A skipped or
        unfinished past occurrence ends a run; today stays open until the day
        ends. History begins when you create a routine and is never backfilled
        before creation. If a routine used to repeat daily, those older days
        stay in its history after you switch it to weekly.
      </p>
    </div>
  )
}
