import { BookOpen, Heart } from "lucide-react"
import Link from "next/link"

import type { Course } from "@/data/courses"

const thumbnailStyles = [
  "from-slate-900 via-slate-700 to-slate-500",
  "from-stone-800 via-stone-600 to-amber-500",
  "from-zinc-900 via-zinc-700 to-cyan-500",
  "from-neutral-800 via-neutral-600 to-emerald-500",
]

export default function CourseCard({ course }: { course: Course }) {
  const colorIndex = course.id.length % thumbnailStyles.length

  return (
    <article className="group overflow-hidden rounded-xl border bg-background transition-shadow hover:shadow-md">
      <Link href={`/courses/${course.id}`} className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset">
        <div className={`relative flex aspect-[16/9] items-end overflow-hidden bg-gradient-to-br ${thumbnailStyles[colorIndex]} p-5 text-white`}>
          <span className="absolute right-4 top-4 rounded-full bg-black/20 px-2.5 py-1 text-[11px] font-medium backdrop-blur-sm">
            {course.category}
          </span>
          <span className="text-4xl font-semibold tracking-tight opacity-80">{course.category.slice(0, 1)}</span>
        </div>
      </Link>
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-semibold leading-5 tracking-tight group-hover:underline group-hover:underline-offset-4">{course.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{course.instructor}</p>
          </div>
          <button type="button" aria-label={`${course.isFavorite ? "Remove" : "Add"} ${course.title} ${course.isFavorite ? "from" : "to"} favorites`} className="flex size-8 shrink-0 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <Heart className={`size-4 ${course.isFavorite ? "fill-current text-foreground" : ""}`} aria-hidden="true" />
          </button>
        </div>
        <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5"><BookOpen className="size-3.5" aria-hidden="true" />{course.totalLessons} lessons</span>
          <span>{course.progress}% complete</span>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted" aria-label={`${course.progress}% complete`} role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={course.progress}>
          <div className="h-full rounded-full bg-foreground transition-all" style={{ width: `${course.progress}%` }} />
        </div>
      </div>
    </article>
  )
}
