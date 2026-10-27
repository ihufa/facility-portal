import type { Course } from './types.ts'

/**
 * Featured courses come first, oldest featured moment first.
 * Everyone else follows, newest created first.
 */
export function sortCourses(courses: readonly Course[]): Course[] {
  return [...courses].sort((a, b) => {
    if (a.featured !== b.featured) return a.featured ? -1 : 1

    if (a.featured && b.featured) {
      const featuredDelta = (a.featuredAt ?? a.createdAt) - (b.featuredAt ?? b.createdAt)
      if (featuredDelta !== 0) return featuredDelta
    } else if (a.createdAt !== b.createdAt) {
      return b.createdAt - a.createdAt
    }

    return a.title.localeCompare(b.title) || a.id.localeCompare(b.id)
  })
}

/**
 * Featuring a course stamps the save time. A course that is already featured
 * keeps the original moment, so later edits do not jump it to the front.
 */
export function nextFeaturedAt(
  previous: { featured: boolean; featuredAt: number | null } | null,
  featured: boolean,
  savedAt: number,
): number | null {
  if (!featured) return null
  if (previous?.featured) return previous.featuredAt ?? savedAt
  return savedAt
}
