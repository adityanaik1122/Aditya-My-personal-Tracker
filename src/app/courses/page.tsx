import DailyShell from "@/components/daily/daily-shell"
import CourseGrid from "@/components/dashboard/course-grid"
import { courses } from "@/data/courses"
import { applyProgress, readProgressStore } from "@/lib/progress-store"

export default async function CoursesPage({
  searchParams,
}: {
  searchParams?: Promise<{ category?: string | string[] }>
}) {
  const resolvedSearchParams = await searchParams
  const store = await readProgressStore()
  const userCourses = courses.map((course) => applyProgress(course, store))
  const categoryParam = resolvedSearchParams?.category
  const category = Array.isArray(categoryParam) ? categoryParam[0] : categoryParam
  const filteredCourses = category
    ? userCourses.filter((course) => course.category.toLowerCase().replaceAll(" ", "-") === category)
    : userCourses
  const categories = [...new Set(courses.map(course => course.category))].sort()

  return (
    <DailyShell current="/courses">
        <div className="space-y-8">
          <section>
            <p className="text-sm font-medium text-muted-foreground">Your personal library</p>
            <div className="mt-2 flex flex-wrap items-center justify-between gap-4">
              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Course library</h1>
              <form action="/courses" className="flex max-w-full flex-wrap items-center gap-2">
                <label htmlFor="category" className="sr-only">Course category</label>
                <select key={category || "all"} id="category" name="category" defaultValue={category || ""} className="min-h-11 max-w-full rounded-xl border bg-white px-3 text-sm">
                  <option value="">All categories</option>
                  {categories.map(item => <option key={item} value={item.toLowerCase().replaceAll(" ", "-")}>{item}</option>)}
                </select>
                <button className="min-h-11 rounded-xl bg-emerald-900 px-4 text-sm font-medium text-white">Filter</button>
              </form>
            </div>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">Browse everything in your Aditya | My personal Tracker collection.</p>
          </section>
          {filteredCourses.length > 0 ? <CourseGrid courses={filteredCourses} showViewAll={false} /> : <div className="rounded-xl border border-dashed bg-background p-10 text-center"><h2 className="font-semibold">No courses in this category yet</h2><p className="mt-2 text-sm text-muted-foreground">Try another category or browse your full library.</p></div>}
        </div>
    </DailyShell>
  )
}
