import type { SVGProps } from 'react'

function icon(props: SVGProps<SVGSVGElement> = {}) {
  return {
    width: 16,
    height: 16,
    viewBox: '0 0 16 16',
    fill: 'none',
    'aria-hidden': true as const,
    ...props,
  }
}

export function LogoMark() {
  return <img className="brand-mark" src="/logo.png" alt="" width={20} height={20} />
}

export function StarIcon() {
  return (
    <svg {...icon({ width: 10, height: 10, viewBox: '0 0 12 12' })}>
      <path
        fill="currentColor"
        d="M6 1.1 7.3 4.2l3.3.3-2.5 2.2.8 3.2L6 8.3 3.1 9.9l.8-3.2L1.4 4.5l3.3-.3L6 1.1z"
      />
    </svg>
  )
}

export function KebabIcon() {
  return (
    <svg {...icon({ width: 14, height: 14, viewBox: '0 0 14 14' })}>
      <circle cx="2.5" cy="7" r="1.15" fill="currentColor" />
      <circle cx="7" cy="7" r="1.15" fill="currentColor" />
      <circle cx="11.5" cy="7" r="1.15" fill="currentColor" />
    </svg>
  )
}

export function PencilIcon() {
  return (
    <svg {...icon()}>
      <path
        d="M11.2 2.4a1.3 1.3 0 0 1 1.8 1.8L5.6 11.6 3 12.4l.8-2.6 7.4-7.4z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      <path d="M9.6 3.6 12 6" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  )
}

export function TrashIcon() {
  return (
    <svg {...icon()}>
      <path d="M3.2 4.2h9.6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <path d="M6.2 4.1V3.2h3.6v.9" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
      <path
        d="M4.2 4.4 4.8 13h6.4l.6-8.6"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function CloseIcon() {
  return (
    <svg {...icon({ width: 18, height: 18, viewBox: '0 0 18 18' })}>
      <path d="M4.5 4.5 13.5 13.5M13.5 4.5 4.5 13.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

export function CloudIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden="true">
      <path
        d="M12.5 25.5h12.2a5.3 5.3 0 0 0 .6-10.6 7.2 7.2 0 0 0-13.8-1.8A4.6 4.6 0 0 0 12.5 25.5z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M18 16.5v8M15.2 19.2 18 16.5l2.8 2.7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
