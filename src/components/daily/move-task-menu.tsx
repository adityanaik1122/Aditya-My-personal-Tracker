"use client"
import { useState } from "react"
import type { Task } from "@/lib/daily-model"
import { button, field, type Save } from "./daily-ui"

export default function MoveTaskMenu({ task, tasks, categories, save, busy }: { task: Task; tasks: Task[]; categories: string[]; save: Save; busy: boolean }) {
  const [destination, setDestination] = useState("")
  return <details className="relative">
    <summary className={`${button} cursor-pointer`}>Move…</summary>
    <div className="mt-2 flex max-w-full flex-wrap gap-2 rounded-xl border bg-white p-3">
      <select aria-label={`Move destination for ${task.title}`} className={`${field} max-w-64`} value={destination} disabled={busy} onChange={(event) => setDestination(event.target.value)}>
        <option value="">Choose a position</option>
        <optgroup label="End of category">{categories.map((category) => <option key={category} value={`category:${category}`}>{category}</option>)}</optgroup>
        <optgroup label="Before task">{tasks.filter((item) => item.id !== task.id).map((item) => <option key={item.id} value={`task:${item.id}`}>{item.title}</option>)}</optgroup>
      </select>
      <button type="button" className={button} disabled={busy || !destination} onClick={async () => {
        const body = destination.startsWith("category:") ? { category: destination.slice(9) } : { targetId: destination.slice(5), placement: "before" }
        if (await save({ action: "reorder", id: task.id, ...body })) setDestination("")
      }}>Move</button>
    </div>
  </details>
}
