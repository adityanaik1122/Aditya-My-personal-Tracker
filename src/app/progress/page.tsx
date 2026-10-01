import DailyShell from "@/components/daily/daily-shell"
import CourseProgressList from "@/components/dashboard/course-progress-list"
import ProgressSummary from "@/components/dashboard/progress-summary"
import { courses } from "@/data/courses"
import { applyProgress, readProgressStore } from "@/lib/progress-store"

export default async function ProgressPage() {
  const store = await readProgressStore()
  const userCourses = courses.map((course) => applyProgress(course, store))

  return (
    <DailyShell current="/progress">
        <div className="space-y-10">
          <ProgressSummary courses={userCourses} />
          <CourseProgressList courses={userCourses} />
        </div>
    </DailyShell>
  )
}
