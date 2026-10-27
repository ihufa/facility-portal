import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { formatLocation } from '../domain/countries.ts'
import type { Course } from '../domain/types.ts'
import { demoFlags } from '../data/demoFlags.ts'
import { courseKeys } from '../query/keys.ts'
import { useCourses, useDeleteCourse } from '../query/useCourses.ts'
import { useQueryClient } from '@tanstack/react-query'
import { AppShell, PageHeading, PageToolbar } from '../components/AppShell.tsx'
import { CourseCard } from '../components/CourseCard.tsx'
import { CourseCardMenu } from '../components/CourseCardMenu.tsx'
import { DeleteCourseDialog } from '../components/DeleteCourseDialog.tsx'

export default function CourseListPage() {
  const queryClient = useQueryClient()
  const courses = useCourses()
  const deletion = useDeleteCourse()
  const [pending, setPending] = useState<Course | null>(null)
  const triggerRef = useRef<HTMLButtonElement | null>(null)
  const [failDeletes, setFailDeletes] = useState(demoFlags.failDeletes)
  const [failReads, setFailReads] = useState(demoFlags.failReads)
  const [failImages, setFailImages] = useState(demoFlags.failImages)

  useEffect(() => {
    document.title = 'Courses · Facility Portal'
  }, [])

  function askDelete(course: Course, trigger: HTMLButtonElement | null) {
    triggerRef.current = trigger
    setPending(course)
  }

  const closeDialog = useCallback(() => {
    setPending(null)
    triggerRef.current?.focus()
  }, [])

  const data = courses.data

  return (
    <AppShell>
      <PageHeading />
      <div className="page-body">
        <div className="frame">
          <PageToolbar>
            <Link className="btn btn-primary" to="/courses/new">
              Create a course
            </Link>
          </PageToolbar>
          {deletion.isError ? (
            <div className="banner" role="alert">
              <p>
                Could not delete {deletion.variables?.title ?? 'that course'}. The course was restored.
              </p>
              <button type="button" className="btn btn-muted" onClick={() => deletion.reset()}>
                Dismiss
              </button>
            </div>
          ) : null}

          {courses.isError && data ? (
            <div className="banner" role="alert">
              <p>Could not refresh courses. The list below is the last one that loaded.</p>
            </div>
          ) : null}

          {courses.isPending ? <CourseSkeletons /> : null}

          {courses.isError && !data ? (
            <div className="status-panel" role="alert">
              <h2>Could not load courses</h2>
              <p>{courses.error instanceof Error ? courses.error.message : 'Something went wrong.'}</p>
              <button type="button" className="btn btn-primary" onClick={() => void courses.refetch()}>
                Try again
              </button>
            </div>
          ) : null}

          {data && data.length === 0 ? (
            <div className="status-panel">
              <h2>No courses yet</h2>
              <p>Add a course and it will show up here.</p>
              <Link className="btn btn-primary" to="/courses/new">
                Create a course
              </Link>
            </div>
          ) : null}

          {data && data.length > 0 ? (
            <div className="course-grid">
              {data.map((course) => (
                <CourseCard
                  key={course.id}
                  title={course.title}
                  location={formatLocation(course.city, course.country)}
                  par={course.par}
                  difficulty={course.difficulty}
                  featured={course.featured}
                  imageSrc={course.imageSrc}
                  imageAlt={course.title}
                  menu={<CourseCardMenu course={course} onDelete={askDelete} />}
                />
              ))}
            </div>
          ) : null}

          <details className="review-tools">
            <summary>Review tools</summary>
            <p>These switches simulate the failure paths used to review loading, images, and rollback.</p>
            <div className="review-tools__checks">
              <label className="check">
                <input
                  type="checkbox"
                  checked={failDeletes}
                  onChange={(event) => {
                    demoFlags.failDeletes = event.target.checked
                    setFailDeletes(event.target.checked)
                  }}
                />
                Simulate delete failure
              </label>
              <label className="check">
                <input
                  type="checkbox"
                  checked={failReads}
                  onChange={(event) => {
                    demoFlags.failReads = event.target.checked
                    setFailReads(event.target.checked)
                    void queryClient.invalidateQueries({ queryKey: courseKeys.all })
                  }}
                />
                Simulate load failure
              </label>
              <label className="check">
                <input
                  type="checkbox"
                  checked={failImages}
                  onChange={(event) => {
                    demoFlags.failImages = event.target.checked
                    setFailImages(event.target.checked)
                  }}
                />
                Simulate image load failure
              </label>
            </div>
          </details>
        </div>
      </div>
      {pending ? (
        <DeleteCourseDialog
          course={pending}
          onCancel={closeDialog}
          onConfirm={(course) => {
            setPending(null)
            triggerRef.current?.focus()
            deletion.mutate(course)
          }}
        />
      ) : null}
    </AppShell>
  )
}

function CourseSkeletons() {
  return (
    <div className="course-grid" aria-busy="true">
      <span className="sr-only">Loading courses</span>
      {Array.from({ length: 4 }, (_, index) => (
        <div key={index} className="skeleton-card" />
      ))}
    </div>
  )
}
