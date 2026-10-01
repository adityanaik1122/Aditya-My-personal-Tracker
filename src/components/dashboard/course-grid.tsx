import Link from "next/link"

import type { Course } from "@/data/courses"
import CourseCard from "@/components/course/course-card"

export default function CourseGrid({ courses, showViewAll = true }: { courses: Course[]; showViewAll?: boolean }) {
  return (
    <section aria-labelledby="my-courses-heading">
      <div className="mb-5 flex items-center justify-between gap-4">
        <h2 id="my-courses-heading" className="text-lg font-semibold tracking-tight">{courses.length} courses</h2>
        {showViewAll && <Link href="/courses" className="text-sm font-medium text-emerald-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">View all</Link>}
      </div>
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {courses.map((course) => <CourseCard key={course.id} course={course} />)}
      </div>
    </section>
  )
}
