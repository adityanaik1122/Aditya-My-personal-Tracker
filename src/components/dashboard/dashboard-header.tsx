import { Search, UserRound } from "lucide-react"

export default function DashboardHeader() {
  return (
    <header className="flex min-h-16 items-center justify-between gap-4 border-b bg-background px-5 py-3 sm:px-8">
      <div className="relative w-full max-w-md">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <label htmlFor="course-search" className="sr-only">
          Search courses
        </label>
        <input
          id="course-search"
          type="search"
          placeholder="Search your library"
          className="h-9 w-full rounded-lg border bg-muted/40 pl-9 pr-3 text-sm outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-ring focus:ring-2 focus:ring-ring/20"
        />
      </div>

      <button
        type="button"
        aria-label="Open profile"
        className="flex size-9 shrink-0 items-center justify-center rounded-full border bg-muted/50 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <UserRound className="size-4" aria-hidden="true" />
      </button>
    </header>
  )
}