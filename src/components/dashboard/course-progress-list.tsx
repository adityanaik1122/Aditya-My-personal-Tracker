import { ArrowRight, BookOpen } from "lucide-react"
import Link from "next/link"

import type { Course } from "@/data/courses"

export default function CourseProgressList({ courses }: { courses: Course[] }) {
  return (
    <section aria-labelledby="course-progress-list-heading">
      <div className="mb-5 flex items-center justify-between gap-4">
        <h2 id="course-progress-list-heading" className="text-xl font-semibold tracking-tight">Course progress</h2>
        <span className="text-sm text-muted-foreground">{courses.length} courses</span>
      </div>
      <div className="overflow-hidden rounded-xl border bg-background">
        {courses.map((course) => (
          <div key={course.id} className="flex flex-col gap-4 border-b p-4 last:border-0 sm:flex-row sm:items-center sm:p-5">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-muted text-lg font-semibold text-muted-foreground">{course.category.slice(0, 1)}</div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <div><p className="text-xs text-muted-foreground">{course.category}</p><h3 className="mt-1 truncate font-medium">{course.title}</h3></div>
                <span className="text-sm font-semibold">{course.progress}%</span>
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted" role="progressbar" aria-label={`${course.progress}% of ${course.title} completed`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={course.progress}><div className="h-full rounded-full bg-foreground" style={{ width: `${course.progress}%` }} /></div>
              <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground"><BookOpen className="size-3.5" aria-hidden="true" />{course.completedLessons} of {course.totalLessons} lessons</div>
            </div>
            <Link href={`/courses/${course.id}`} aria-label={`View ${course.title}`} className="inline-flex items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"><span className="sm:hidden">View course</span><ArrowRight className="size-4" aria-hidden="true" /></Link>
          </div>
        ))}
      </div>
    </section>
  )
}
