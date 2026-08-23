"use client"

import { ArrowRight, LockKeyhole } from "lucide-react"
import { useRouter } from "next/navigation"
import { FormEvent, useState } from "react"

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError("")
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      })

      if (!response.ok) {
        setError("The username or password is incorrect.")
        return
      }

      const nextPath = new URLSearchParams(window.location.search).get("next")
      window.sessionStorage.setItem("learning_hub_just_logged_in", "true")
      router.replace(nextPath?.startsWith("/") ? nextPath : "/")
      router.refresh()
    } catch {
      setError("Unable to sign in right now. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/30 px-5 py-10">
      <div className="w-full max-w-sm rounded-2xl border bg-background p-7 shadow-sm sm:p-8">
        <div className="flex size-11 items-center justify-center rounded-xl bg-primary text-lg font-bold text-primary-foreground">L</div>
        <p className="mt-8 text-sm font-medium text-muted-foreground">Private course library</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Welcome back</h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">Sign in to continue to your Learning Tracking library.</p>
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div><label htmlFor="username" className="mb-1.5 block text-sm font-medium">Username</label><input id="username" name="username" autoComplete="username" required value={username} onChange={(event) => setUsername(event.target.value)} className="h-10 w-full rounded-lg border bg-background px-3 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/20" /></div>
          <div><label htmlFor="password" className="mb-1.5 block text-sm font-medium">Password</label><input id="password" name="password" type="password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} className="h-10 w-full rounded-lg border bg-background px-3 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/20" /></div>
          {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
          <button type="submit" disabled={isSubmitting} className="flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-primary text-sm font-medium text-primary-foreground hover:bg-primary/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-60">{isSubmitting ? "Signing in..." : "Sign in"}<ArrowRight className="size-4" aria-hidden="true" /></button>
        </form>
        <div className="mt-6 flex items-center gap-2 text-xs text-muted-foreground"><LockKeyhole className="size-3.5" aria-hidden="true" />Private access only</div>
      </div>
    </main>
  )
}
