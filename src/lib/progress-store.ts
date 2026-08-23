import "server-only"

import { mkdir, readFile, writeFile } from "node:fs/promises"
import path from "node:path"

import type { Course } from "@/data/courses"

interface LessonProgress {
  completed: boolean
  positionSeconds: number
  playlistIndex?: number
  updatedAt: string
}

export interface ProgressStore {
  lessons: Record<string, LessonProgress>
}

const dataDirectory = path.join(process.cwd(), ".data")
const dataFile = path.join(dataDirectory, "learning-hub.json")

const emptyStore: ProgressStore = { lessons: {} }

export async function readProgressStore(): Promise<ProgressStore> {
  try {
    const content = await readFile(dataFile, "utf8")
    return JSON.parse(content) as ProgressStore
  } catch {
    return emptyStore
  }
}

export async function saveLessonProgress(
  lessonId: string,
  progress: Pick<LessonProgress, "completed" | "positionSeconds" | "playlistIndex">,
) {
  const store = await readProgressStore()
  store.lessons[lessonId] = {
    ...progress,
    updatedAt: new Date().toISOString(),
  }
  await mkdir(dataDirectory, { recursive: true })
  await writeFile(dataFile, `${JSON.stringify(store, null, 2)}\n`, "utf8")
  return store.lessons[lessonId]
}

export function applyProgress(course: Course, store: ProgressStore): Course {
  const sections = course.sections.map((section) => ({
    ...section,
    lessons: section.lessons.map((lesson) => ({
      ...lesson,
      completed: store.lessons[lesson.id]?.completed ?? lesson.completed,
    })),
  }))
  const lessons = sections.flatMap((section) => section.lessons)
  const completedLessons = lessons.filter((lesson) => lesson.completed).length

  return {
    ...course,
    sections,
    completedLessons,
    progress: lessons.length === 0 ? 0 : Math.round((completedLessons / lessons.length) * 100),
  }
}