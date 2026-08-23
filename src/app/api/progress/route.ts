import { NextResponse } from "next/server"

import { getLessonById } from "@/data/courses"
import { readProgressStore, saveLessonProgress } from "@/lib/progress-store"

export async function GET() {
  return NextResponse.json(await readProgressStore())
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const lessonId = typeof body?.lessonId === "string" ? body.lessonId : ""
  const completed = typeof body?.completed === "boolean" ? body.completed : undefined
  const positionSeconds = typeof body?.positionSeconds === "number" ? body.positionSeconds : 0

  if (!lessonId || completed === undefined || !getLessonById(lessonId)) {
    return NextResponse.json({ error: "Invalid lesson progress payload." }, { status: 400 })
  }

  const progress = await saveLessonProgress(lessonId, {
    completed,
    positionSeconds: Math.max(0, Math.floor(positionSeconds)),
  })

  return NextResponse.json(progress)
}