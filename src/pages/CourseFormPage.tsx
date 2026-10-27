import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate, useParams, useBlocker } from 'react-router-dom'
import { emptyCourseForm, type CourseFormValues } from '../domain/schema.ts'
import type { Course, CourseInput } from '../domain/types.ts'
import { useCourse, useSaveCourse } from '../query/useCourses.ts'
import { AppShell, PageHeading, PageToolbar } from '../components/AppShell.tsx'
import { CourseForm } from '../components/CourseForm.tsx'
import type { CourseImageValue } from '../components/ImageField.tsx'

function toFormValues(course: Course): CourseFormValues {
  return {
    title: course.title,
    description: course.description,
    difficulty: String(course.difficulty),
    par: String(course.par),
    featured: course.featured,
    city: course.city,
    country: course.country,
  }
}

export default function CourseFormPage() {
  const { courseId } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(courseId)
  const existing = useCourse(courseId)
  const course = isEdit ? existing.data : undefined
  const save = useSaveCourse(courseId)
  const [dirty, setDirty] = useState(false)
  const skipBlock = useRef(false)
  const onDirtyChange = useCallback((value: boolean) => setDirty(value), [])

  useEffect(() => {
    document.title = `${isEdit ? 'Edit course' : 'Create course'} · Facility Portal`
  }, [isEdit])

  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      dirty && !skipBlock.current && currentLocation.pathname !== nextLocation.pathname,
  )

  useEffect(() => {
    if (blocker.state !== 'blocked') return
    const leave = window.confirm('Leave without saving your changes?')
    if (leave) blocker.proceed()
    else blocker.reset()
  }, [blocker])

  useEffect(() => {
    if (!dirty) return
    function onLeave(event: BeforeUnloadEvent) {
      event.preventDefault()
    }
    window.addEventListener('beforeunload', onLeave)
    return () => window.removeEventListener('beforeunload', onLeave)
  }, [dirty])

  async function handleSubmit(input: CourseInput) {
    skipBlock.current = true
    try {
      await save.mutateAsync(input)
      navigate('/')
    } catch {
      skipBlock.current = false
    }
  }

  const ready = !isEdit || Boolean(course)
  const image: CourseImageValue = {
    src: course?.imageSrc ?? null,
    name: course?.imageName ?? null,
  }

  return (
    <AppShell>
      <PageHeading />
      <div className="page-body">
        <div className="frame">
          <PageToolbar>
            {isEdit ? null : (
              <button type="button" className="btn btn-muted" onClick={() => navigate('/')} disabled={save.isPending}>
                Cancel
              </button>
            )}
            <button
              type="submit"
              form="course-form"
              className="btn btn-primary"
              disabled={!ready || save.isPending}
            >
              {save.isPending ? 'Saving…' : 'Save'}
            </button>
          </PageToolbar>
          {save.isError ? (
            <div className="banner" role="alert">
              <p>{save.error instanceof Error ? save.error.message : 'Could not save this course.'}</p>
            </div>
          ) : null}

          {isEdit && existing.isPending ? <FormSkeleton /> : null}

          {isEdit && existing.isError ? (
            <div className="status-panel" role="alert">
              <h2>Course not found</h2>
              <p>That course is not in the portal anymore.</p>
              <button type="button" className="btn btn-primary" onClick={() => navigate('/')}>
                Back to courses
              </button>
            </div>
          ) : null}

          {ready ? (
            <CourseForm
              key={course?.id ?? 'new'}
              defaultValues={course ? toFormValues(course) : emptyCourseForm}
              defaultImage={image}
              saving={save.isPending}
              onDirtyChange={onDirtyChange}
              onSubmit={handleSubmit}
            />
          ) : null}
        </div>
      </div>
    </AppShell>
  )
}

function FormSkeleton() {
  return (
    <div className="editor" aria-busy="true">
      <span className="sr-only">Loading course</span>
      <div className="skeleton-form" />
      <div className="skeleton-card" />
    </div>
  )
}
