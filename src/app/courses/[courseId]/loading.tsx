export default function CourseLoading() {
  return (
    <div className="min-h-screen animate-pulse bg-muted/30">
      <div className="h-16 border-b bg-background" />
      <main className="mx-auto max-w-7xl space-y-8 p-5 pt-20 sm:p-8 sm:pt-10 lg:p-12">
        <div className="grid gap-8 lg:grid-cols-2"><div className="space-y-4"><div className="h-4 w-32 rounded bg-muted" /><div className="h-10 w-3/4 rounded bg-muted" /><div className="h-20 rounded bg-muted" /></div><div className="aspect-video rounded-xl bg-muted" /></div>
        <div className="h-32 rounded-xl bg-muted" />
        <div className="h-64 rounded-xl bg-muted" />
      </main>
    </div>
  )
}
