import AppSidebar from "@/components/dashboard/app-sidebar"
import CourseProgressList from "@/components/dashboard/course-progress-list"
import DashboardHeader from "@/components/dashboard/dashboard-header"
import ProgressSummary from "@/components/dashboard/progress-summary"
import { courses } from "@/data/courses"
import { applyProgress, readProgressStore } from "@/lib/progress-store"

export default async function ProgressPage() {
  const store = await readProgressStore()
  const userCourses = courses.map((course) => applyProgress(course, store))

  return (
    <div className="min-h-screen bg-muted/30">
      <AppSidebar />
      <main className="min-h-screen md:pl-64">
        <DashboardHeader />
        <div className="mx-auto max-w-7xl space-y-10 p-5 pt-20 sm:p-8 sm:pt-10 lg:p-12">
          <ProgressSummary courses={userCourses} />
          <CourseProgressList courses={userCourses} />
        </div>
      </main>
    </div>
  )
}
