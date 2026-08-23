import { ArrowLeft, Compass } from "lucide-react"
import Link from "next/link"

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/30 px-6">
      <div className="max-w-md text-center">
        <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-background shadow-sm"><Compass className="size-5 text-muted-foreground" aria-hidden="true" /></div>
        <p className="mt-6 text-sm font-medium text-muted-foreground">404</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">We couldn&apos;t find that page.</h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">The course or lesson may have moved, or the address may be incorrect.</p>
        <Link href="/" className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"><ArrowLeft className="size-4" aria-hidden="true" />Back to dashboard</Link>
      </div>
    </main>
  )
}
