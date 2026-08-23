import { Check, Circle, Play } from "lucide-react"
import Link from "next/link"

import type { Course } from "@/data/courses"

export default function LessonList({ course }: { course: Course }) {
  return (
    <section aria-labelledby="course-content-heading">
      <div className="mb-5 flex items-center justify-between gap-4">
        <h2 id="course-content-heading" className="text-xl font-semibold tracking-tight">Course content</h2>
        <p className="text-sm text-muted-foreground">{course.totalLessons} lessons</p>
      </div>
      <div className="space-y-4">
        {course.sections.map((section, sectionIndex) => (
          <div key={section.id} className="overflow-hidden rounded-xl border bg-background">
            <div className="flex items-center justify-between gap-4 border-b bg-muted/30 px-4 py-3 sm:px-5">
              <h3 className="text-sm font-semibold">Section {sectionIndex + 1}: {section.title}</h3>
              <span className="text-xs text-muted-foreground">{section.lessons.length} lessons</span>
            </div>
            <ol>
              {section.lessons.map((lesson, lessonIndex) => (
                <li key={lesson.id} className="border-b last:border-0">
                  <Link href={`/watch/${lesson.id}`} className="flex items-center gap-3 px-4 py-3.5 hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset sm:px-5">
                    <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-muted text-xs text-muted-foreground">{lesson.completed ? <Check className="size-3.5" aria-label="Completed" /> : lessonIndex + 1}</span>
                    <span className="min-w-0 flex-1"><span className="block truncate text-sm font-medium">{lesson.title}</span><span className="mt-0.5 block text-xs text-muted-foreground">Lesson {lessonIndex + 1}</span></span>
                    <span className="flex items-center gap-3 text-xs text-muted-foreground"><span>{lesson.duration}</span>{lesson.completed ? <Check className="size-4 text-foreground" aria-label="Completed" /> : <Circle className="size-3.5" aria-hidden="true" />}<Play className="hidden size-3.5 sm:block" aria-hidden="true" /></span>
                  </Link>
                </li>
              ))}
            </ol>
          </div>
        ))}
      </div>
    </section>
  )
}
