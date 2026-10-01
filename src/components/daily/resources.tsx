"use client"
import { useState } from "react"
import { ExternalLink, Plus, Trash2 } from "lucide-react"
import type { DailyView } from "@/lib/daily-store"
import type { Catalog } from "./daily-ui"
import { button, primary, field } from "./daily-ui"
export default function Resources({ data, save }: { data: DailyView; catalog: Catalog; save: (body: Record<string, unknown>) => Promise<boolean> }) {
  const [country, setCountry] = useState("Canada")
  const [query, setQuery] = useState("")
  const [form, setForm] = useState({ title: "", url: "", type: "Jobs", notes: "" })
  const resources = (data.resources ?? []).filter((r) => `${r.title} ${r.country} ${r.type}`.toLowerCase().includes(query.toLowerCase()))
  const countries = [...new Set((data.resources ?? []).map((r) => r.country))]
  return <div className="space-y-6">
    <div><p className="text-sm text-zinc-500">Research library</p><h1 className="mt-1 text-3xl font-semibold">Country resources</h1><p className="mt-2 text-zinc-600">Keep job sites, government portals, housing links, and useful videos together.</p></div>
    <section className="rounded-2xl border bg-white p-5"><h2 className="font-semibold">Add a resource</h2><form className="mt-4 grid gap-3 sm:grid-cols-2" onSubmit={async (e) => { e.preventDefault(); if (await save({ action: "resource", country, ...form })) setForm({ title: "", url: "", type: "Jobs", notes: "" }) }}>
      <input className={field} required placeholder="Resource title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
      <input className={field} required type="url" placeholder="https://..." value={form.url} onChange={e => setForm({ ...form, url: e.target.value })} />
      <input className={field} placeholder="Country" value={country} onChange={e => setCountry(e.target.value)} />
      <select className={field} value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>{["Jobs", "Government", "Housing", "Video", "Other"].map(t => <option key={t}>{t}</option>)}</select>
      <input className={`${field} sm:col-span-2`} placeholder="Notes (optional)" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
      <button className={`${primary} sm:w-fit`}><Plus size={16} />Save resource</button>
    </form></section>
    <div className="flex flex-wrap gap-2">{countries.map(c => <button key={c} className={`${button} ${country === c ? "border-emerald-600 bg-emerald-50 text-emerald-800" : ""}`} onClick={() => setCountry(c)}>{c}</button>)}<input className={`${field} ml-auto max-w-xs`} placeholder="Search resources" value={query} onChange={e => setQuery(e.target.value)} /></div>
    <div className="grid gap-4 md:grid-cols-2">{resources.filter(r => r.country === country || query).map(r => <article key={r.id} className="rounded-2xl border bg-white p-5"><div className="flex items-start justify-between gap-3"><div><p className="text-xs font-medium text-emerald-700">{r.country} · {r.type}</p><h2 className="mt-1 font-semibold">{r.title}</h2></div><button className="text-zinc-400 hover:text-red-600" aria-label={`Delete ${r.title}`} onClick={() => save({ action: "resource", method: "delete", id: r.id })}><Trash2 size={16} /></button></div><p className="mt-3 text-sm text-zinc-500">{r.notes || "No notes yet."}</p><a className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-emerald-700 underline" href={r.url} target="_blank" rel="noreferrer">Open link <ExternalLink size={14} /></a></article>)}</div>
    {!resources.length && <p className="rounded-2xl border border-dashed p-8 text-center text-sm text-zinc-500">No resources match this view yet.</p>}
  </div>
}
