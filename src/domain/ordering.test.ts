import { describe, expect, it } from 'vitest'
import { nextFeaturedAt, sortCourses } from './ordering.ts'
import type { Course } from './types.ts'

function course(overrides: Partial<Course> & Pick<Course, 'id' | 'title'>): Course {
  return {
    description: '',
    city: 'California',
    country: 'US',
    par: 72,
    difficulty: 4,
    featured: false,
    featuredAt: null,
    createdAt: 0,
    updatedAt: 0,
    imageSrc: null,
    imageName: null,
    ...overrides,
  }
}

describe('sortCourses', () => {
  it('keeps featured courses oldest-first, then non-featured newest-first', () => {
    const feat1 = course({ id: '1', title: 'Feat 1', featured: true, featuredAt: 10, createdAt: 10 })
    const feat2 = course({ id: '2', title: 'Feat 2', featured: true, featuredAt: 20, createdAt: 20 })
    const feat3 = course({ id: '3', title: 'Feat 3', featured: true, featuredAt: 30, createdAt: 30 })
    const newest = course({ id: '4', title: 'Newest', createdAt: 100 })
    const older = course({ id: '5', title: 'Older', createdAt: 50 })
    const feat4 = course({
      id: '6',
      title: 'Feat 4',
      featured: true,
      featuredAt: nextFeaturedAt(null, true, 40),
      createdAt: 40,
    })

    const input = [older, feat3, newest, feat1, feat4, feat2]
    expect(sortCourses(input).map((item) => item.id)).toEqual(['1', '2', '3', '6', '4', '5'])
    expect(input.map((item) => item.id)).toEqual(['5', '3', '4', '1', '6', '2'])
  })
})

describe('nextFeaturedAt', () => {
  it('stamps the save time only when a course becomes featured', () => {
    expect(nextFeaturedAt(null, true, 99)).toBe(99)
    expect(nextFeaturedAt(null, false, 99)).toBeNull()
    expect(nextFeaturedAt({ featured: true, featuredAt: 10 }, true, 99)).toBe(10)
    expect(nextFeaturedAt({ featured: false, featuredAt: null }, true, 99)).toBe(99)
    expect(nextFeaturedAt({ featured: true, featuredAt: 10 }, false, 99)).toBeNull()
  })
})
