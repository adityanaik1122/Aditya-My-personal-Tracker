import DailyShell from "@/components/daily/daily-shell"
import ContinueWatching from "@/components/dashboard/continue-watching"
import CourseGrid from "@/components/dashboard/course-grid"
import StatsCards from "@/components/dashboard/stats-cards"
import WelcomeSection from "@/components/dashboard/welcome-section"
import { courses } from "@/data/courses"
import { applyProgress, readProgressStore } from "@/lib/progress-store"

export default async function Home() {
  const store = await readProgressStore()
  const userCourses = courses.map((course) => applyProgress(course, store))

  return (
    <DailyShell current="/">
        <div className="space-y-10">
          <WelcomeSection />
          <StatsCards courses={userCourses} />
          <ContinueWatching courses={userCourses} />
          <CourseGrid courses={userCourses} />
        </div>
    </DailyShell>
  )
}
