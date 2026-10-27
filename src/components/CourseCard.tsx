import type { ReactNode } from 'react'
import { StarIcon } from './icons.tsx'
import { CourseImage } from './CourseImage.tsx'

export type CourseCardModel = {
  title: string
  titleMuted?: boolean
  location: string
  locationMuted?: boolean
  par: number | null
  difficulty: number | null
  featured: boolean
  imageSrc: string | null
  imageAlt: string
  menu?: ReactNode
}

export function CourseCard({
  title,
  titleMuted = false,
  location,
  locationMuted = false,
  par,
  difficulty,
  featured,
  imageSrc,
  imageAlt,
  menu,
}: CourseCardModel) {
  const parText = par == null ? '–' : String(par)
  const difficultyText = difficulty == null ? '–' : String(difficulty)
  const TitleTag = menu ? 'h2' : 'p'

  return (
    <article className="course-card">
      <div className="course-card__photo">
        <CourseImage src={imageSrc} alt={imageSrc ? imageAlt : ''} />
        {featured ? (
          <span className="badge">
            <StarIcon />
            Featured
          </span>
        ) : null}
      </div>
      <div className="course-card__body">
        <p className={locationMuted ? 'course-card__location is-muted' : 'course-card__location'}>
          {location}
        </p>
        <TitleTag className={titleMuted ? 'course-card__title is-muted' : 'course-card__title'}>
          {title}
        </TitleTag>
        <p className="course-card__meta">
          Par {parText} • Difficulty: {difficultyText}/5
        </p>
      </div>
      {menu}
    </article>
  )
}
