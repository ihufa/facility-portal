import { useState } from 'react'
import { demoFlags } from '../data/demoFlags.ts'

const outOfBoundsSrc = '/images/out-of-bounds.jpg'

type CourseImageProps = {
  src: string | null
  alt: string
}

export function CourseImage({ src, alt }: CourseImageProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null)
  const [fallbackFailed, setFallbackFailed] = useState(false)
  const failed = src !== null && (failedSrc === src || demoFlags.failImages)

  if (!src || (failed && fallbackFailed)) {
    return <div className="checker" role="img" aria-label="No course image" />
  }

  if (failed) {
    return <img src={outOfBoundsSrc} alt="Image out of bounds" onError={() => setFallbackFailed(true)} />
  }

  return <img src={src} alt={alt} onError={() => setFailedSrc(src)} />
}
