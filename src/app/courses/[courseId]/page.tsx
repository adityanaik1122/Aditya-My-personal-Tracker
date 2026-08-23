import { notFound } from "next/navigation"

import AppSidebar from "@/components/dashboard/app-sidebar"
import DashboardHeader from "@/components/dashboard/dashboard-header"
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
    <div className="min-h-screen bg-muted/30">
      <AppSidebar />
      <main className="min-h-screen md:pl-64">
        <DashboardHeader />
        <div className="mx-auto max-w-7xl space-y-10 p-5 pt-20 sm:p-8 sm:pt-10 lg:p-12">
          <CourseHeader course={course} />
          <CourseProgress course={course} />
          <LessonList course={course} />
        </div>
      </main>
    </div>
  )
}
