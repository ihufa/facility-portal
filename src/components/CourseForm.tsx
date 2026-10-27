import { useEffect, useId, useRef, useState, type ComponentProps, type ReactNode } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { countries, formatLocation } from '../domain/countries.ts'
import { courseFormSchema, type CourseFormValues } from '../domain/schema.ts'
import { isDifficulty, type CourseInput, type Difficulty } from '../domain/types.ts'
import { CourseCard } from './CourseCard.tsx'
import { ImageField, type CourseImageValue } from './ImageField.tsx'

type CourseFormProps = {
  defaultValues: CourseFormValues
  defaultImage: CourseImageValue
  saving: boolean
  onDirtyChange: (dirty: boolean) => void
  onSubmit: (input: CourseInput) => Promise<void>
}

const difficulties = ['1', '2', '3', '4', '5'] as const

function toInput(values: CourseFormValues, image: CourseImageValue): CourseInput {
  const difficulty = Number(values.difficulty)
  if (!isDifficulty(difficulty)) throw new Error('Choose a difficulty.')
  return {
    title: values.title.trim(),
    description: values.description.trim(),
    city: values.city.trim(),
    country: values.country,
    par: Number(values.par),
    difficulty,
    featured: values.featured,
    imageSrc: image.src,
    imageName: image.name,
  }
}

export function CourseForm({ defaultValues, defaultImage, saving, onDirtyChange, onSubmit }: CourseFormProps) {
  const initialImage = useRef(defaultImage)
  const [image, setImage] = useState(defaultImage)
  const [imageError, setImageError] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isDirty },
  } = useForm<CourseFormValues>({
    resolver: zodResolver(courseFormSchema),
    defaultValues,
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  })

  const imageDirty = image.src !== initialImage.current.src || image.name !== initialImage.current.name
  const dirty = isDirty || imageDirty

  useEffect(() => {
    onDirtyChange(dirty)
  }, [dirty, onDirtyChange])

  const values = watch()
  const difficulty = difficulties.some((option) => option === values.difficulty)
    ? (Number(values.difficulty) as Difficulty)
    : null
  const par = /^\d+$/.test(values.par) ? Number(values.par) : null
  const location = formatLocation(values.city, values.country)
  const title = values.title.trim()

  return (
    <form
      id="course-form"
      className="editor"
      noValidate
      aria-busy={saving}
      onSubmit={(event) => {
        const missingImage = !image.src
        setImageError(missingImage ? 'Add an image.' : null)
        void handleSubmit(async (parsed) => {
          if (!image.src) return
          await onSubmit(toInput(parsed, image))
        })(event)
      }}
    >
      <div className="editor-fields">
        <section className="section">
          <h2 className="section-title">Course details</h2>
          <p className="section-help">Review the information and make changes if necessary.</p>
          <div className="form-grid">
            <TextField label="Title" required error={errors.title?.message} autoComplete="off" {...register('title')} />
            <SelectField label="Difficulty" required error={errors.difficulty?.message} {...register('difficulty')}>
              <option value="">Choose an option</option>
              {difficulties.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </SelectField>
            <TextAreaField
              className="span-2"
              label="Course description"
              required
              error={errors.description?.message}
              rows={4}
              {...register('description')}
            />
            <TextField
              label="Par"
              required
              error={errors.par?.message}
              inputMode="numeric"
              autoComplete="off"
              {...register('par')}
            />
            <div className="span-2 check-row">
              <label className="check">
                <input type="checkbox" {...register('featured')} />
                Featured course
              </label>
            </div>
          </div>
        </section>

        <section className="section">
          <h2 className="section-title">Location</h2>
          <div className="form-grid">
            <TextField
              label="City/State"
              required
              error={errors.city?.message}
              autoComplete="address-level2"
              {...register('city')}
            />
            <SelectField label="Country" required error={errors.country?.message} {...register('country')}>
              <option value="">Choose an option</option>
              {countries.map((country) => (
                <option key={country.code} value={country.code}>
                  {country.name}
                </option>
              ))}
            </SelectField>
          </div>
        </section>

        <section className="section">
          <ImageField
            value={image}
            error={imageError}
            onChange={(next) => {
              setImage(next)
              if (next.src) setImageError(null)
            }}
          />
        </section>
      </div>

      <aside className="preview-sticky" aria-label="Card preview">
        <p className="preview-label">Card preview</p>
        <CourseCard
          title={title || 'Course title'}
          titleMuted={!title}
          location={location || 'Location'}
          locationMuted={!location}
          par={par}
          difficulty={difficulty}
          featured={values.featured}
          imageSrc={image.src}
          imageAlt={title || 'Course preview'}
        />
      </aside>
    </form>
  )
}

type SharedField = {
  label: string
  required?: boolean
  error?: string
  className?: string
}

function FieldShell({
  label,
  required,
  error,
  className,
  children,
}: SharedField & { children: (ids: { id: string; errorId?: string; invalid: boolean }) => ReactNode }) {
  const id = useId()
  const errorId = error ? `${id}-error` : undefined
  return (
    <div className={['field', 'float-field', className, error ? 'is-invalid' : ''].filter(Boolean).join(' ')}>
      {children({ id, errorId, invalid: Boolean(error) })}
      <label htmlFor={id}>
        {label}
        {required ? <span aria-hidden="true">*</span> : null}
      </label>
      {error ? (
        <p id={errorId} className="field-error">
          {error}
        </p>
      ) : null}
    </div>
  )
}

function TextField({ label, required, error, className, ...props }: SharedField & ComponentProps<'input'>) {
  return (
    <FieldShell label={label} required={required} error={error} className={className}>
      {({ id, errorId, invalid }) => (
        <input
          {...props}
          id={id}
          className="control"
          placeholder=" "
          aria-invalid={invalid || undefined}
          aria-describedby={errorId}
        />
      )}
    </FieldShell>
  )
}

function TextAreaField({
  label,
  required,
  error,
  className,
  ...props
}: SharedField & ComponentProps<'textarea'>) {
  return (
    <FieldShell label={label} required={required} error={error} className={className}>
      {({ id, errorId, invalid }) => (
        <textarea
          {...props}
          id={id}
          className="control"
          placeholder=" "
          aria-invalid={invalid || undefined}
          aria-describedby={errorId}
        />
      )}
    </FieldShell>
  )
}

function SelectField({
  label,
  required,
  error,
  className,
  children,
  ...props
}: SharedField & ComponentProps<'select'>) {
  return (
    <FieldShell label={label} required={required} error={error} className={className}>
      {({ id, errorId, invalid }) => (
        <select
          {...props}
          id={id}
          className="control"
          aria-invalid={invalid || undefined}
          aria-describedby={errorId}
        >
          {children}
        </select>
      )}
    </FieldShell>
  )
}
