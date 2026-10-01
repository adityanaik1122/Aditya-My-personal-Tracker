import Link from "next/link"
import Image from "next/image"
import {
  CalendarDays,
  ListChecks,
  BookOpen,
  ChartNoAxesCombined,
  Bell,
  Library,
  Globe2,
} from "lucide-react"
import type { ReactNode } from "react"

const navigation = [
  { href: "/today", label: "Today", icon: CalendarDays },
  { href: "/tasks", label: "Tasks & routines", icon: ListChecks },
  { href: "/resources", label: "Country resources", icon: Globe2 },
  { href: "/study", label: "Study plan", icon: BookOpen },
  { href: "/insights", label: "Consistency", icon: ChartNoAxesCombined },
  { href: "/settings", label: "Reminders", icon: Bell },
  { href: "/courses", label: "Course library", icon: Library },
]
export default function DailyShell({
  children,
  current,
}: {
  children: ReactNode
  current: string
}) {
  const libraryPage = ["/", "/courses", "/favorites", "/progress"].includes(current)
  const libraryNavigation = [
    { href: "/courses", label: "All courses" },
    { href: "/", label: "Overview" },
    { href: "/favorites", label: "Favorites" },
    { href: "/progress", label: "Course progress" },
    { href: "/#continue-watching", label: "Continue watching" },
  ]
  return (
    <div className="min-h-dvh bg-[#f6f7f4] text-zinc-900">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-white focus:p-3">Skip to content</a>
      <header className="border-b border-black/5 bg-white/90">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-5 sm:px-8">
          <Link
            href="/today"
            className="flex min-w-0 items-center gap-3 font-semibold tracking-tight"
          >
            <Image src="/icon-192.png" alt="" width={40} height={40} className="size-10 shrink-0 rounded-xl object-cover" unoptimized />
            <span className="max-w-56 text-sm leading-5 sm:max-w-none sm:text-base">Aditya | My personal Tracker</span>
          </Link>
          <Link
            href="/settings"
            className="flex min-h-11 shrink-0 items-center gap-2 text-sm text-zinc-600"
          >
            <Bell size={17} aria-hidden="true" />
            <span className="hidden sm:inline">Account & reminders</span><span className="sr-only sm:hidden">Account & reminders</span>
          </Link>
        </div>
      </header>
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <nav
          aria-label="Primary navigation"
          className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-3 border-t bg-white pb-[env(safe-area-inset-bottom)] md:static md:flex md:flex-wrap md:gap-1 md:border-t-0 md:border-b md:bg-transparent md:py-3"
        >
          {navigation.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              aria-current={(href === "/courses" ? libraryPage : current === href) ? "page" : undefined}
              className={`flex min-h-14 min-w-0 items-center justify-center gap-2 rounded-lg px-2 text-xs font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 md:min-h-11 md:px-3 md:text-sm ${(href === "/courses" ? libraryPage : current === href) ? "bg-emerald-900/5 text-emerald-800" : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"}`}
            >
              <Icon size={18} className="shrink-0" aria-hidden="true" />
              {label}
            </Link>
          ))}
        </nav>
        {libraryPage && (
          <nav aria-label="Course library navigation" className="flex flex-wrap gap-2 border-b py-4">
            {libraryNavigation.map(({ href, label }) => (
              <Link key={href} href={href} aria-current={current === href ? "page" : undefined}
                className={`inline-flex min-h-11 items-center rounded-full px-4 text-sm font-medium focus-visible:outline-2 focus-visible:outline-emerald-700 ${current === href ? "bg-emerald-900 text-white" : "text-zinc-600 hover:bg-white"}`}>
                {label}
              </Link>
            ))}
          </nav>
        )}
        <main id="main-content" className="pb-40 pt-8 md:pb-14 md:pt-10">{children}</main>
      </div>
    </div>
  )
}
