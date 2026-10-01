import { notFound } from "next/navigation"

import DailyShell from "@/components/daily/daily-shell"
import CourseHeader from "@/components/course/course-header"
import CourseProgress from "@/components/course/course-progress"
import LessonList from "@/components/course/lesson-list"
import { courses, getCourseById } from "@/data/courses"
import { applyProgress, readProgressStore } from "@/lib/progress-store"

export function generateStaticParams() {
  return courses.map((course) => ({ courseId: course.id }))
}

export default async function CourseDetailsPage({
  params,
}: {
  params: Promise<{ courseId: string }>
}) {
  const { courseId } = await params
  const courseRecord = getCourseById(courseId)

  if (!courseRecord) {
    notFound()
  }
  const course = applyProgress(courseRecord, await readProgressStore())

  return (
    <DailyShell current="/courses">
        <div className="space-y-10">
          <CourseHeader course={course} />
          <CourseProgress course={course} />
          <LessonList course={course} />
        </div>
    </DailyShell>
  )
}
