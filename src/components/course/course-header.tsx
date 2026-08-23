import { ArrowLeft, Play } from "lucide-react"
import Link from "next/link"

import type { Course } from "@/data/courses"

export default function CourseHeader({ course }: { course: Course }) {
  const continueLesson = course.lastWatchedLessonId ?? course.sections[0]?.lessons[0]?.id

  return (
    <section className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,0.8fr)] lg:items-center">
      <div className="order-2 lg:order-1">
        <Link href="/courses" className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back to courses
        </Link>
        <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-muted-foreground">
          <span>{course.category}</span>
          <span aria-hidden="true">/</span>
          <span>{course.totalLessons} lessons</span>
          <span aria-hidden="true">/</span>
          <span>{course.duration}</span>
        </div>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">{course.title}</h1>
        <p className="mt-4 max-w-2xl leading-7 text-muted-foreground">{course.description}</p>
        <p className="mt-5 text-sm text-muted-foreground">Taught by <span className="font-medium text-foreground">{course.instructor}</span></p>
        {continueLesson && (
          <Link href={`/watch/${continueLesson}`} className="mt-7 inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <Play className="size-4 fill-current" aria-hidden="true" />
            Continue learning
          </Link>
        )}
      </div>
      <div className="order-1 flex aspect-video items-end overflow-hidden rounded-xl border bg-gradient-to-br from-slate-900 via-slate-700 to-slate-500 p-6 text-white shadow-sm lg:order-2">
        <span className="text-7xl font-semibold tracking-tight opacity-80">{course.category.slice(0, 1)}</span>
      </div>
    </section>
  )
}
