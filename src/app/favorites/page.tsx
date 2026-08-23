import { Bookmark } from "lucide-react"

import AppSidebar from "@/components/dashboard/app-sidebar"
import CourseGrid from "@/components/dashboard/course-grid"
import DashboardHeader from "@/components/dashboard/dashboard-header"
import EmptyFavorites from "@/components/dashboard/empty-favorites"
import { courses } from "@/data/courses"
import { applyProgress, readProgressStore } from "@/lib/progress-store"

export default async function FavoritesPage() {
  const store = await readProgressStore()
  const favoriteCourses = courses.map((course) => applyProgress(course, store)).filter((course) => course.isFavorite)

  return (
    <div className="min-h-screen bg-muted/30">
      <AppSidebar />
      <main className="min-h-screen md:pl-64">
        <DashboardHeader />
        <div className="mx-auto max-w-7xl space-y-8 p-5 pt-20 sm:p-8 sm:pt-10 lg:p-12">
          <section>
            <div className="flex items-center gap-3"><div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground"><Bookmark className="size-4" aria-hidden="true" /></div><div><p className="text-sm font-medium text-muted-foreground">Your saved learning</p><h1 className="mt-1 text-3xl font-semibold tracking-tight sm:text-4xl">Favorites</h1></div></div>
            <p className="mt-4 max-w-xl text-sm leading-6 text-muted-foreground">Keep the courses you are most excited about close at hand.</p>
          </section>
          {favoriteCourses.length > 0 ? <CourseGrid courses={favoriteCourses} /> : <EmptyFavorites />}
        </div>
      </main>
    </div>
  )
}
