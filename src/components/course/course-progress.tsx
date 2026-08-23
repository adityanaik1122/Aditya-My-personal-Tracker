import { CheckCircle2, Clock3, ListChecks } from "lucide-react"

import type { Course } from "@/data/courses"

export default function CourseProgress({ course }: { course: Course }) {
  return (
    <section className="rounded-xl border bg-background p-5 sm:p-6" aria-labelledby="course-progress-heading">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 id="course-progress-heading" className="text-base font-semibold">Your progress</h2>
          <p className="mt-1 text-sm text-muted-foreground">{course.completedLessons} of {course.totalLessons} lessons completed</p>
        </div>
        <span className="text-2xl font-semibold tracking-tight">{course.progress}%</span>
      </div>
      <div className="mt-4 h-2 overflow-hidden rounded-full bg-muted" role="progressbar" aria-label={`${course.progress}% of course completed`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={course.progress}>
        <div className="h-full rounded-full bg-foreground" style={{ width: `${course.progress}%` }} />
      </div>
      <div className="mt-5 grid gap-4 border-t pt-5 text-sm sm:grid-cols-3">
        <div className="flex items-center gap-2 text-muted-foreground"><CheckCircle2 className="size-4" aria-hidden="true" /><span>{course.completedLessons} completed</span></div>
        <div className="flex items-center gap-2 text-muted-foreground"><ListChecks className="size-4" aria-hidden="true" /><span>{course.totalLessons} total lessons</span></div>
        <div className="flex items-center gap-2 text-muted-foreground"><Clock3 className="size-4" aria-hidden="true" /><span>{course.duration} total</span></div>
      </div>
    </section>
  )
}
