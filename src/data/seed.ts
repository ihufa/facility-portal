import type { Course } from '../domain/types.ts'

const hour = 60 * 60 * 1000
const start = Date.UTC(2024, 5, 1, 12)

function course(
  partial: Pick<Course, 'id' | 'title' | 'description' | 'difficulty' | 'imageSrc' | 'imageName'> &
    Partial<Pick<Course, 'featured' | 'featuredAt' | 'createdAt'>>,
): Course {
  const createdAt = partial.createdAt ?? start
  return {
    id: partial.id,
    title: partial.title,
    description: partial.description,
    city: 'California',
    country: 'US',
    par: 72,
    difficulty: partial.difficulty,
    featured: partial.featured ?? false,
    featuredAt: partial.featured ? (partial.featuredAt ?? createdAt) : null,
    createdAt,
    updatedAt: createdAt,
    imageSrc: partial.imageSrc,
    imageName: partial.imageName,
  }
}

/**
 * Locations follow the Figma labels, including St Andrews shown as California, US.
 * Featured Pebble is oldest-featured. The other courses are newest-created first,
 * which matches the order on the list frame.
 */
export function createSeedCourses(): Course[] {
  return [
    course({
      id: 'seed-pebble',
      title: 'Pebble Beach Golf Links',
      description:
        'Cliff-top fairways along the Pacific, with small greens and a wind that changes the club you thought you needed.',
      difficulty: 4,
      featured: true,
      featuredAt: start,
      createdAt: start,
      imageSrc: '/images/pebble.jpg',
      imageName: 'pebble.jpg',
    }),
    course({
      id: 'seed-albany',
      title: 'Albany',
      description:
        'A parkland routing through cypress and sand, with a clubhouse that looks out over the closing holes.',
      difficulty: 4,
      createdAt: start + 4 * hour,
      imageSrc: '/images/albany.jpg',
      imageName: 'albany.jpg',
    }),
    course({
      id: 'seed-canyon',
      title: 'Hidden Canyon',
      description:
        'Desert wash and elevated tees. The canyon walls frame every approach, and the bunkers are larger than they look.',
      difficulty: 4,
      createdAt: start + 3 * hour,
      imageSrc: '/images/canyon.jpg',
      imageName: 'canyon.jpg',
    }),
    course({
      id: 'seed-andrews',
      title: 'St. Andrews',
      description:
        'Wide links turf, deep pot bunkers, and a wind that makes the same hole play differently all afternoon.',
      difficulty: 2,
      createdAt: start + 2 * hour,
      imageSrc: '/images/andrews.jpg',
      imageName: 'andrews.jpg',
    }),
    course({
      id: 'seed-spyglass',
      title: 'Spyglass Hill',
      description:
        'A clifftop run of holes above the water, with long views and greens that fall away toward the ocean.',
      difficulty: 3,
      createdAt: start + hour,
      imageSrc: '/images/spyglass.jpg',
      imageName: 'spyglass.jpg',
    }),
  ]
}
