import { Bookmark } from "lucide-react"

import DailyShell from "@/components/daily/daily-shell"
import CourseGrid from "@/components/dashboard/course-grid"
import EmptyFavorites from "@/components/dashboard/empty-favorites"
import { courses } from "@/data/courses"
import { applyProgress, readProgressStore } from "@/lib/progress-store"

export default async function FavoritesPage() {
  const store = await readProgressStore()
  const favoriteCourses = courses.map((course) => applyProgress(course, store)).filter((course) => course.isFavorite)

  return (
    <DailyShell current="/favorites">
        <div className="space-y-8">
          <section>
            <div className="flex items-center gap-3"><div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground"><Bookmark className="size-4" aria-hidden="true" /></div><div><p className="text-sm font-medium text-muted-foreground">Your saved learning</p><h1 className="mt-1 text-3xl font-semibold tracking-tight sm:text-4xl">Favorites</h1></div></div>
            <p className="mt-4 max-w-xl text-sm leading-6 text-muted-foreground">Keep the courses you are most excited about close at hand.</p>
          </section>
          {favoriteCourses.length > 0 ? <CourseGrid courses={favoriteCourses} /> : <EmptyFavorites />}
        </div>
    </DailyShell>
  )
}
