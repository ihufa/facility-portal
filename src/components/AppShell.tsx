import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { useOnline } from '../pwa/useOnline.ts'
import { LogoMark } from './icons.tsx'

export function AppShell({ children }: { children: ReactNode }) {
  const online = useOnline()

  return (
    <div className="app">
      <header className="topbar">
        <div className="frame">
          <Link className="brand" to="/" aria-label="Facility portal home">
            <LogoMark />
            <span className="brand-rule" />
            <span>Facility portal</span>
          </Link>
        </div>
      </header>
      {online ? null : (
        <div className="offline-bar" role="status">
          You're offline. The saved course list is still available.
        </div>
      )}
      {children}
    </div>
  )
}

export function PageHeading() {
  return (
    <div className="page-head">
      <div className="frame head-row">
        <div>
          <h1>Courses</h1>
          <p>Browse and add golf courses</p>
        </div>
      </div>
    </div>
  )
}

export function PageToolbar({ children }: { children: ReactNode }) {
  return <div className="page-toolbar">{children}</div>
}
