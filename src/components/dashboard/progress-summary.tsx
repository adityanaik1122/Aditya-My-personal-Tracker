import { BookOpen, CheckCircle2, Clock3, Layers3 } from "lucide-react"

import type { Course } from "@/data/courses"

function getLearningHours(courses: Course[]) {
  return courses.reduce((total, course) => {
    const hours = Number.parseFloat(course.duration)
    return total + (course.duration.includes("h") ? hours : 0)
  }, 0)
}

export default function ProgressSummary({ courses }: { courses: Course[] }) {
  const completedCourses = courses.filter((course) => course.progress === 100).length
  const inProgressCourses = courses.filter((course) => course.progress > 0 && course.progress < 100).length
  const completedLessons = courses.reduce((total, course) => total + course.completedLessons, 0)
  const learningHours = Math.round(getLearningHours(courses))

  const metrics = [
    { label: "Total courses", value: courses.length, icon: BookOpen },
    { label: "Courses completed", value: completedCourses, icon: CheckCircle2 },
    { label: "Courses in progress", value: inProgressCourses, icon: Layers3 },
    { label: "Lessons completed", value: completedLessons, icon: CheckCircle2 },
    { label: "Learning hours", value: `${learningHours}h`, icon: Clock3 },
  ]

  return (
    <section aria-labelledby="overall-progress-heading">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-muted-foreground">Your library at a glance</p>
          <h1 id="overall-progress-heading" className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Overall progress</h1>
        </div>
        <span className="hidden text-sm text-muted-foreground sm:block">{completedLessons} lessons completed</span>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {metrics.map(({ label, value, icon: Icon }) => (
          <div key={label} className="rounded-xl border bg-background p-4">
            <div className="flex items-center justify-between gap-3"><p className="text-xs font-medium text-muted-foreground">{label}</p><Icon className="size-4 text-muted-foreground" aria-hidden="true" /></div>
            <p className="mt-4 text-2xl font-semibold tracking-tight">{value}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
