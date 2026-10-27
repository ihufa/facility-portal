import { useEffect, useRef } from 'react'
import type { Course } from '../domain/types.ts'
import { CloseIcon } from './icons.tsx'

type DeleteCourseDialogProps = {
  course: Course
  onCancel: () => void
  onConfirm: (course: Course) => void
}

function focusableElements(container: HTMLElement): HTMLElement[] {
  return [...container.querySelectorAll<HTMLElement>('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')].filter(
    (element) => !element.hasAttribute('disabled'),
  )
}

export function DeleteCourseDialog({ course, onCancel, onConfirm }: DeleteCourseDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const cancelRef = useRef<HTMLButtonElement>(null)
  const titleId = 'delete-course-title'
  const descriptionId = 'delete-course-description'

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    cancelRef.current?.focus()

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault()
        onCancel()
        return
      }
      if (event.key !== 'Tab' || !dialogRef.current) return
      const items = focusableElements(dialogRef.current)
      const first = items[0]
      const last = items[items.length - 1]
      if (!first || !last) return
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [onCancel])

  return (
    <div
      className="overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onCancel()
      }}
    >
      <div
        ref={dialogRef}
        className="dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
      >
        <div className="dialog__head">
          <h2 id={titleId}>Delete course</h2>
          <button type="button" className="icon-btn" aria-label="Close" onClick={onCancel}>
            <CloseIcon />
          </button>
        </div>
        <p id={descriptionId}>
          Are you sure you want to delete this course? You will lose all data attached to it.
        </p>
        <div className="dialog__actions">
          <button ref={cancelRef} type="button" className="btn btn-muted" onClick={onCancel}>
            Cancel
          </button>
          <button type="button" className="btn btn-danger" onClick={() => onConfirm(course)}>
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}
