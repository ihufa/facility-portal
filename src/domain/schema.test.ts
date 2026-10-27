import { describe, expect, it } from 'vitest'
import { courseFormSchema, imageFileError } from './schema.ts'

const valid = {
  title: 'Pebble Beach Golf Links',
  description: 'Cliff-top fairways along the Pacific.',
  difficulty: '4',
  par: '72',
  featured: true,
  city: 'California',
  country: 'US',
}

describe('courseFormSchema', () => {
  it('accepts a complete course', () => {
    expect(courseFormSchema.safeParse(valid).success).toBe(true)
  })

  it('requires a title and a known country', () => {
    const missingTitle = courseFormSchema.safeParse({ ...valid, title: '   ' })
    const missingCountry = courseFormSchema.safeParse({ ...valid, country: '' })
    expect(missingTitle.success).toBe(false)
    expect(missingCountry.success).toBe(false)
  })

  it('rejects par outside a plausible round, including decimals', () => {
    expect(courseFormSchema.safeParse({ ...valid, par: '' }).success).toBe(false)
    expect(courseFormSchema.safeParse({ ...valid, par: '72.5' }).success).toBe(false)
    expect(courseFormSchema.safeParse({ ...valid, par: '12' }).success).toBe(false)
    expect(courseFormSchema.safeParse({ ...valid, par: '71' }).success).toBe(true)
  })

  it('only allows difficulty 1 through 5', () => {
    expect(courseFormSchema.safeParse({ ...valid, difficulty: '' }).success).toBe(false)
    expect(courseFormSchema.safeParse({ ...valid, difficulty: '6' }).success).toBe(false)
  })
})

describe('imageFileError', () => {
  it('accepts jpg, png, and webp, and rejects everything else', () => {
    expect(imageFileError(new File(['a'], 'photo.jpg', { type: 'image/jpeg' }))).toBeNull()
    expect(imageFileError(new File(['a'], 'photo.png', { type: 'image/png' }))).toBeNull()
    expect(imageFileError(new File(['a'], 'photo.webp', { type: '' }))).toBeNull()
    expect(imageFileError(new File(['a'], 'photo.gif', { type: 'image/gif' }))).toMatch(/JPG, PNG, or WebP/)
    expect(imageFileError(new File(['a'], 'notes.pdf', { type: 'application/pdf' }))).toMatch(/JPG, PNG, or WebP/)
  })

  it('rejects very large files', () => {
    const huge = new File([new Uint8Array(8 * 1024 * 1024 + 1)], 'big.jpg', { type: 'image/jpeg' })
    expect(imageFileError(huge)).toMatch(/8 MB/)
  })
})
