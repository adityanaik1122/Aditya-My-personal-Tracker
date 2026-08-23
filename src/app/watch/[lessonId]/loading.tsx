export default function WatchLoading() {
  return (
    <div className="min-h-screen animate-pulse bg-muted/30">
      <div className="h-16 border-b bg-background" />
      <main className="mx-auto max-w-7xl space-y-7 p-5 pt-20 sm:p-8 sm:pt-10 lg:p-12"><div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_20rem]"><div className="space-y-6"><div className="aspect-video rounded-xl bg-zinc-900" /><div className="space-y-3"><div className="h-4 w-40 rounded bg-muted" /><div className="h-8 w-2/3 rounded bg-muted" /><div className="h-12 rounded bg-muted" /></div></div><div className="h-96 rounded-xl bg-muted" /></div></main>
    </div>
  )
}
