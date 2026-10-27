import { z } from 'zod'
import { isCountryCode } from './countries.ts'

const difficultyValues = ['1', '2', '3', '4', '5'] as const

export const courseFormSchema = z.object({
  title: z.string().trim().min(1, 'Enter a title.').max(80, 'Use 80 characters or fewer.'),
  description: z
    .string()
    .trim()
    .min(1, 'Enter a description.')
    .max(600, 'Use 600 characters or fewer.'),
  difficulty: z
    .string()
    .refine((value) => difficultyValues.some((option) => option === value), 'Choose a difficulty.'),
  par: z
    .string()
    .trim()
    .min(1, 'Enter a par.')
    .regex(/^\d+$/, 'Enter a whole number.')
    .refine((value) => {
      const par = Number(value)
      return par >= 54 && par <= 90
    }, 'Par must be between 54 and 90. Typical 18-hole courses are 68 to 74.'),
  featured: z.boolean(),
  city: z.string().trim().min(1, 'Enter a city.').max(60, 'Use 60 characters or fewer.'),
  country: z.string().refine(isCountryCode, 'Choose a country.'),
})

export type CourseFormValues = z.infer<typeof courseFormSchema>

export const emptyCourseForm: CourseFormValues = {
  title: '',
  description: '',
  difficulty: '',
  par: '',
  featured: false,
  city: '',
  country: '',
}

const imageTypes = new Set(['image/jpeg', 'image/png', 'image/webp'])
const imageExtension = /\.(jpe?g|png|webp)$/i
const maxImageBytes = 8 * 1024 * 1024

export function imageFileError(file: File): string | null {
  if (file.size > maxImageBytes) return 'Image must be 8 MB or smaller.'
  if (file.type) {
    return imageTypes.has(file.type) ? null : 'Use a JPG, PNG, or WebP image.'
  }
  return imageExtension.test(file.name) ? null : 'Use a JPG, PNG, or WebP image.'
}

export function readImageFile(file: File): Promise<string> {
  const error = imageFileError(file)
  if (error) return Promise.reject(new Error(error))

  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(new Error('Could not read that image.'))
    reader.readAsDataURL(file)
  })
}
