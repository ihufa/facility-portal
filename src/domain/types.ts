export type Difficulty = 1 | 2 | 3 | 4 | 5

export type Course = {
  id: string
  title: string
  description: string
  city: string
  country: string
  par: number
  difficulty: Difficulty
  featured: boolean
  /** When the course last became featured. Null when it is not featured. */
  featuredAt: number | null
  createdAt: number
  updatedAt: number
  imageSrc: string | null
  imageName: string | null
}

export type CourseInput = {
  title: string
  description: string
  city: string
  country: string
  par: number
  difficulty: Difficulty
  featured: boolean
  imageSrc: string | null
  imageName: string | null
}

export function isDifficulty(value: number): value is Difficulty {
  return value === 1 || value === 2 || value === 3 || value === 4 || value === 5
}
