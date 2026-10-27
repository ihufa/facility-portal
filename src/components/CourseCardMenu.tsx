import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Course } from '../domain/types.ts'
import { KebabIcon, PencilIcon, TrashIcon } from './icons.tsx'

const closeMenusEvent = 'portal:close-menus'

type CourseCardMenuProps = {
  course: Course
  onDelete: (course: Course, trigger: HTMLButtonElement | null) => void
}

export function CourseCardMenu({ course, onDelete }: CourseCardMenuProps) {
  const [open, setOpen] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const menuId = `course-menu-${course.id}`

  useEffect(() => {
    if (!open) return

    function closeFromOutside() {
      setOpen(false)
    }

    function onPointerDown(event: PointerEvent) {
      const target = event.target as Node
      if (buttonRef.current?.contains(target) || menuRef.current?.contains(target)) return
      setOpen(false)
    }

    function onKeyDown(event: KeyboardEvent) {
      const items = [...(menuRef.current?.querySelectorAll<HTMLButtonElement>('[role="menuitem"]') ?? [])]
      const index = items.indexOf(document.activeElement as HTMLButtonElement)

      if (event.key === 'Escape') {
        event.preventDefault()
        setOpen(false)
        buttonRef.current?.focus()
        return
      }

      if (event.key === 'ArrowDown') {
        event.preventDefault()
        const next = index < 0 ? 0 : (index + 1) % items.length
        items[next]?.focus()
        return
      }

      if (event.key === 'ArrowUp') {
        event.preventDefault()
        const next = index < 0 ? items.length - 1 : (index - 1 + items.length) % items.length
        items[next]?.focus()
        return
      }

      if (event.key === 'Home') {
        event.preventDefault()
        items[0]?.focus()
        return
      }

      if (event.key === 'End') {
        event.preventDefault()
        items[items.length - 1]?.focus()
        return
      }

      if (event.key === 'Tab') setOpen(false)
    }

    document.addEventListener(closeMenusEvent, closeFromOutside)
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    menuRef.current?.querySelector<HTMLButtonElement>('[role="menuitem"]')?.focus()

    return () => {
      document.removeEventListener(closeMenusEvent, closeFromOutside)
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  function toggle() {
    setOpen((current) => {
      if (!current) document.dispatchEvent(new Event(closeMenusEvent))
      return !current
    })
  }

  return (
    <div className="card-menu">
      <button
        ref={buttonRef}
        type="button"
        className="kebab"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        aria-label={`Actions for ${course.title}`}
        onClick={toggle}
      >
        <KebabIcon />
      </button>
      {open ? (
        <div ref={menuRef} id={menuId} role="menu" aria-label={`${course.title} actions`} className="menu">
          <button
            type="button"
            role="menuitem"
            onClick={() => navigate(`/courses/${course.id}/edit`)}
          >
            <PencilIcon />
            Edit
          </button>
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setOpen(false)
              onDelete(course, buttonRef.current)
            }}
          >
            <TrashIcon />
            Delete
          </button>
        </div>
      ) : null}
    </div>
  )
}
