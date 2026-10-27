import { describe, expect, it } from 'vitest'
import { displayedImageSize, outputSize, sourceRect } from './crop.ts'

describe('displayedImageSize', () => {
  it('keeps a photo that already fits the window', () => {
    expect(displayedImageSize(400, 300, 1200, 800)).toEqual({ width: 400, height: 300 })
  })

  it('shrinks a photo that is taller than the window', () => {
    const size = displayedImageSize(1600, 2400, 1000, 600)
    expect(size.height).toBe(600)
    expect(size.width).toBe(400)
  })
})

describe('sourceRect', () => {
  it('maps the box on the screen back onto the original photo', () => {
    const rect = sourceRect(
      { x: 50, y: 10, width: 100, height: 40 },
      { width: 200, height: 100 },
      { width: 400, height: 200 },
    )
    expect(rect).toEqual({ x: 100, y: 20, width: 200, height: 80 })
  })
})

describe('outputSize', () => {
  it('does not enlarge a small crop', () => {
    expect(outputSize(300, 400)).toEqual({ width: 300, height: 400 })
  })

  it('caps the long edge of a large crop', () => {
    expect(outputSize(3000, 4000)).toEqual({ width: 1200, height: 1600 })
  })
})
