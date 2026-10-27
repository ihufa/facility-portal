import { nextFeaturedAt, sortCourses } from '../domain/ordering.ts'
import type { Course, CourseInput } from '../domain/types.ts'
import { countCourses, deleteCourseRecord, readCourse, readCourses, saveCourseRecord } from './db.ts'
import { demoFlags } from './demoFlags.ts'
import { createSeedCourses } from './seed.ts'

export const LATENCY_MS = 650

export class CourseServiceError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'CourseServiceError'
  }
}

function wait(ms = LATENCY_MS): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

let seeding: Promise<void> | null = null

function ensureSeeded(): Promise<void> {
  seeding ??= seedIfEmpty().catch((error: unknown) => {
    seeding = null
    throw error
  })
  return seeding
}

async function seedIfEmpty(): Promise<void> {
  const count = await countCourses()
  if (count > 0) return
  for (const course of createSeedCourses()) {
    await saveCourseRecord(course)
  }
}

/**
 * The only module that talks to storage. A real API would replace these
 * methods and leave the React Query hooks unchanged.
 */
export const courseService = {
  async list(): Promise<Course[]> {
    await wait()
    if (demoFlags.failReads) {
      throw new CourseServiceError('Could not load courses.')
    }
    await ensureSeeded()
    return sortCourses(await readCourses())
  },

  async get(id: string): Promise<Course> {
    await wait()
    await ensureSeeded()
    const course = await readCourse(id)
    if (!course) throw new CourseServiceError('Course not found.')
    return course
  },

  async create(input: CourseInput): Promise<Course> {
    await wait()
    const now = Date.now()
    const course: Course = {
      id: crypto.randomUUID(),
      ...input,
      featuredAt: nextFeaturedAt(null, input.featured, now),
      createdAt: now,
      updatedAt: now,
    }
    await saveCourseRecord(course)
    return course
  },

  async update(id: string, input: CourseInput): Promise<Course> {
    await wait()
    const existing = await readCourse(id)
    if (!existing) throw new CourseServiceError('Course not found.')
    const now = Date.now()
    const course: Course = {
      ...existing,
      ...input,
      featuredAt: nextFeaturedAt(existing, input.featured, now),
      updatedAt: now,
    }
    await saveCourseRecord(course)
    return course
  },

  async remove(id: string): Promise<void> {
    await wait()
    if (demoFlags.failDeletes) {
      throw new CourseServiceError('The server rejected the delete.')
    }
    const existing = await readCourse(id)
    if (!existing) throw new CourseServiceError('Course not found.')
    await deleteCourseRecord(id)
  },
}
