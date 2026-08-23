import { Check, Play } from "lucide-react"
import Link from "next/link"

import type { Course, Lesson } from "@/data/courses"

export default function LessonSidebar({ course, currentLesson }: { course: Course; currentLesson: Lesson }) {
  return (
    <aside className="rounded-xl border bg-background" aria-labelledby="lesson-list-heading">
      <div className="border-b px-4 py-4"><h2 id="lesson-list-heading" className="font-semibold">Course lessons</h2><p className="mt-1 text-xs text-muted-foreground">{course.completedLessons} of {course.totalLessons} completed</p></div>
      <div className="max-h-[32rem] overflow-y-auto p-2">
        {course.sections.map((section) => <div key={section.id} className="mb-4 last:mb-0"><h3 className="px-2 py-2 text-xs font-semibold text-muted-foreground">{section.title}</h3><ol>{section.lessons.map((lesson) => <li key={lesson.id}><Link href={`/watch/${lesson.id}`} aria-current={lesson.id === currentLesson.id ? "page" : undefined} className={`flex items-center gap-2 rounded-lg px-2 py-2.5 text-sm hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${lesson.id === currentLesson.id ? "bg-muted font-medium" : "text-muted-foreground"}`}><span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-background text-xs">{lesson.completed ? <Check className="size-3.5" aria-label="Completed" /> : <Play className="size-3" aria-hidden="true" />}</span><span className="min-w-0 flex-1 truncate">{lesson.title}</span><span className="text-xs">{lesson.duration}</span></Link></li>)}</ol></div>)}
      </div>
    </aside>
  )
}
