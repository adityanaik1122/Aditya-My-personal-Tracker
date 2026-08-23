import { notFound } from "next/navigation"

import AppSidebar from "@/components/dashboard/app-sidebar"
import DashboardHeader from "@/components/dashboard/dashboard-header"
import LessonNavigation from "@/components/video/lesson-navigation"
import LessonSidebar from "@/components/video/lesson-sidebar"
import VideoPlayer from "@/components/video/video-player"
import { courses, getLessonById } from "@/data/courses"
import { applyProgress, readProgressStore } from "@/lib/progress-store"

function getLessonSequence(courseId: string) {
  const course = courses.find((item) => item.id === courseId)
  return course?.sections.flatMap((section) => section.lessons) ?? []
}

export function generateStaticParams() {
  return courses.flatMap((course) => course.sections.flatMap((section) => section.lessons.map((lesson) => ({ lessonId: lesson.id }))))
}

export default async function WatchPage({ params }: { params: Promise<{ lessonId: string }> }) {
  const { lessonId } = await params
  const result = getLessonById(lessonId)

  if (!result) {
    notFound()
  }

  const { course: baseCourse } = result
  const course = applyProgress(baseCourse, await readProgressStore())
  const lesson = course.sections.flatMap((section) => section.lessons).find((item) => item.id === lessonId)

  if (!lesson) {
    notFound()
  }
  const sequence = getLessonSequence(course.id)
  const lessonIndex = sequence.findIndex((item) => item.id === lesson.id)

  return (
    <div className="min-h-screen bg-muted/30">
      <AppSidebar />
      <main className="min-h-screen md:pl-64">
        <DashboardHeader />
        <div className="mx-auto max-w-7xl space-y-7 p-5 pt-20 sm:p-8 sm:pt-10 lg:p-12">
          <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_20rem]">
            <div className="min-w-0 space-y-6">
              <VideoPlayer video={lesson.video} lessonId={lesson.id} />
              <div><p className="text-sm font-medium text-muted-foreground">{course.title}</p><h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">{lesson.title}</h1><p className="mt-3 max-w-3xl leading-7 text-muted-foreground">A focused lesson from the {course.category} collection. This player is ready for a future video provider integration.</p></div>
              <LessonNavigation lesson={lesson} previousLesson={sequence[lessonIndex - 1]} nextLesson={sequence[lessonIndex + 1]} />
            </div>
            <LessonSidebar course={course} currentLesson={lesson} />
          </div>
        </div>
      </main>
    </div>
  )
}
