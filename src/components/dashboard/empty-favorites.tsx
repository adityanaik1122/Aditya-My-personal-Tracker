import { Bookmark, Compass } from "lucide-react"
import Link from "next/link"

export default function EmptyFavorites() {
  return (
    <div className="flex min-h-72 flex-col items-center justify-center rounded-xl border border-dashed bg-background px-6 text-center">
      <div className="flex size-12 items-center justify-center rounded-full bg-muted"><Bookmark className="size-5 text-muted-foreground" aria-hidden="true" /></div>
      <h2 className="mt-4 text-lg font-semibold">No favorites yet</h2>
      <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">Save courses you want to return to and they will appear here.</p>
      <Link href="/courses" className="mt-5 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"><Compass className="size-4" aria-hidden="true" />Explore courses</Link>
    </div>
  )
}
