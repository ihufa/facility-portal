import { lazy, Suspense } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

const CourseListPage = lazy(() => import('./pages/CourseListPage.tsx'))
const CourseFormPage = lazy(() => import('./pages/CourseFormPage.tsx'))

function PageFallback() {
  return (
    <div className="page-body">
      <div className="frame">
        <div className="course-grid" aria-busy="true">
          <span className="sr-only">Loading page</span>
          {Array.from({ length: 4 }, (_, index) => (
            <div key={index} className="skeleton-card" />
          ))}
        </div>
      </div>
    </div>
  )
}

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <Suspense fallback={<PageFallback />}>
        <CourseListPage />
      </Suspense>
    ),
  },
  {
    path: '/courses/new',
    element: (
      <Suspense fallback={<PageFallback />}>
        <CourseFormPage />
      </Suspense>
    ),
  },
  {
    path: '/courses/:courseId/edit',
    element: (
      <Suspense fallback={<PageFallback />}>
        <CourseFormPage />
      </Suspense>
    ),
  },
])

export function AppRouter() {
  return <RouterProvider router={router} />
}
