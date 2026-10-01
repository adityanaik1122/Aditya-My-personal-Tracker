"use client"

import { useId, useState, type ReactNode, type DragEventHandler } from "react"
import { ChevronDown, CircleCheck } from "lucide-react"

export default function CategoryCard({ name, total, completed, children, onDrop, onDragOver, highlighted }: {
  name: string
  total: number
  completed?: number
  children: ReactNode
  onDrop?: DragEventHandler<HTMLElement>
  onDragOver?: DragEventHandler<HTMLElement>
  highlighted?: boolean
}) {
  const [expanded, setExpanded] = useState(true)
  const id = useId()
  const done = completed !== undefined && total > 0 && completed === total
  return (
    <section onDrop={onDrop} onDragOver={onDragOver} className={`overflow-hidden rounded-2xl border border-emerald-900/10 bg-white shadow-sm ${highlighted ? "ring-2 ring-cyan-500" : ""}`}>
      <h3>
        <button type="button" aria-expanded={expanded} aria-controls={id}
          onClick={() => setExpanded(!expanded)}
          className="flex w-full items-center gap-3 bg-gradient-to-r from-emerald-50 to-cyan-50 px-4 py-4 text-left focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-emerald-700">
          {done ? <CircleCheck size={18} className="shrink-0 text-emerald-700" aria-hidden="true" /> : <span className="size-2.5 shrink-0 rounded-full bg-emerald-500" />}
          <span className="min-w-0 flex-1 text-sm font-semibold text-zinc-800">{name}</span>
          <span className="shrink-0 rounded-full bg-white/80 px-2.5 py-1 text-xs font-medium text-emerald-800">
            {completed === undefined ? `${total} ${total === 1 ? "task" : "tasks"}` : `${completed}/${total} done`}
          </span>
          <ChevronDown size={18} aria-hidden="true" className={`shrink-0 text-emerald-800 motion-safe:transition-transform ${expanded ? "rotate-180" : ""}`} />
        </button>
      </h3>
      {completed !== undefined && <div className="h-1 bg-emerald-100" aria-hidden="true"><div className="h-full bg-emerald-500 motion-safe:transition-[width]" style={{ width: `${total ? completed / total * 100 : 0}%` }} /></div>}
      <div id={id} hidden={!expanded} className="space-y-3 border-t border-emerald-900/10 p-3 sm:p-4">{children}</div>
    </section>
  )
}
