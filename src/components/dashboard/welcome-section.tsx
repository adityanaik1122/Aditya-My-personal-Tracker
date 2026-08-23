import { ArrowUpRight } from "lucide-react"
import Link from "next/link"

export default function WelcomeSection() {
  return (
    <section>
      <p className="text-sm font-medium text-muted-foreground">Welcome back.</p>
      <div className="mt-2 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Keep learning.</h1>
          <p className="mt-3 max-w-lg text-sm leading-6 text-muted-foreground sm:text-base">
            Continue your learning journey with your personal course library.
          </p>
        </div>
        <Link
          href="/courses"
          className="inline-flex items-center gap-2 text-sm font-medium text-foreground underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Browse all courses
          <ArrowUpRight className="size-4" aria-hidden="true" />
        </Link>
      </div>
    </section>
  )
}
