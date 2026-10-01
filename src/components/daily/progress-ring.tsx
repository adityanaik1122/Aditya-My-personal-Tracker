export default function ProgressRing({
  value,
  label,
  detail,
  tone = "emerald",
}: {
  value: number | null
  label: string
  detail: string
  tone?: "emerald" | "amber" | "sky"
}) {
  const percent = value === null ? 0 : Math.max(0, Math.min(100, value))
  const tones = {
    emerald: "text-emerald-500",
    amber: "text-amber-500",
    sky: "text-cyan-500",
  }
  return (
    <div className="flex items-center gap-4">
      <div className={`relative size-20 shrink-0 ${tones[tone]}`}>
        <svg viewBox="0 0 36 36" className="size-full -rotate-90" aria-hidden="true">
          <circle cx="18" cy="18" r="15.5" fill="none" stroke="currentColor" strokeWidth="3" className="text-zinc-100" />
          <circle
            cx="18"
            cy="18"
            r="15.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={`${percent} 100`}
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-sm font-semibold text-zinc-900">
          {value === null ? "—" : `${Math.round(value)}%`}
        </span>
      </div>
      <div className="min-w-0">
        <p className="text-sm font-medium text-zinc-900">{label}</p>
        <p className="mt-1 text-xs leading-5 text-zinc-500">{detail}</p>
      </div>
    </div>
  )
}
