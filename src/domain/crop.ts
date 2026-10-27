export const cardAspect = 3 / 4

export type Box = {
  x: number
  y: number
  width: number
  height: number
}

export function displayedImageSize(
  naturalWidth: number,
  naturalHeight: number,
  maxWidth: number,
  maxHeight: number,
) {
  if (naturalWidth <= 0 || naturalHeight <= 0) return { width: 0, height: 0 }
  const scale = Math.min(1, maxWidth / naturalWidth, maxHeight / naturalHeight)
  return {
    width: Math.max(1, Math.round(naturalWidth * scale)),
    height: Math.max(1, Math.round(naturalHeight * scale)),
  }
}

export function sourceRect(crop: Box, rendered: { width: number; height: number }, natural: { width: number; height: number }) {
  const scaleX = natural.width / rendered.width
  const scaleY = natural.height / rendered.height
  return {
    x: crop.x * scaleX,
    y: crop.y * scaleY,
    width: crop.width * scaleX,
    height: crop.height * scaleY,
  }
}

export function outputSize(width: number, height: number, maxEdge = 1600) {
  const scale = Math.min(1, maxEdge / Math.max(width, height))
  return {
    width: Math.max(1, Math.round(width * scale)),
    height: Math.max(1, Math.round(height * scale)),
  }
}
