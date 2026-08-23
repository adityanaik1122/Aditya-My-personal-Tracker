import { BookOpen, CheckCircle2, Clock3, Layers3 } from "lucide-react"

import type { Course } from "@/data/courses"

interface Stat {
  label: string
  value: string
  icon: typeof BookOpen
}

export default function StatsCards({ courses }: { courses: Course[] }) {
  const stats: Stat[] = [
    { label: "Total Courses", value: String(courses.length), icon: BookOpen },
    { label: "In Progress", value: String(courses.filter((course) => course.progress > 0 && course.progress < 100).length), icon: Layers3 },
    { label: "Completed", value: String(courses.filter((course) => course.progress === 100).length), icon: CheckCircle2 },
    { label: "Learning Hours", value: "Self-paced", icon: Clock3 },
  ]

  return (
    <section aria-labelledby="learning-stats-heading">
      <h2 id="learning-stats-heading" className="sr-only">Learning statistics</h2>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map(({ label, value, icon: Icon }) => (
          <div key={label} className="rounded-xl border bg-background p-4 sm:p-5">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-medium text-muted-foreground sm:text-sm">{label}</p>
              <Icon className="size-4 text-muted-foreground" aria-hidden="true" />
            </div>
            <p className="mt-3 text-2xl font-semibold tracking-tight">{value}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
