import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ReactNode } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { Course } from '../domain/types.ts'
import { courseKeys } from './keys.ts'
import { useDeleteCourse } from './useCourses.ts'

const pending: { reject?: (error: Error) => void } = vi.hoisted(() => ({ reject: undefined }))

vi.mock('../data/courseService.ts', () => ({
  courseService: {
    remove: () =>
      new Promise((_resolve, reject: (error: Error) => void) => {
        pending.reject = reject
      }),
  },
}))

const albany: Course = {
  id: 'albany',
  title: 'Albany',
  description: 'Parkland holes.',
  city: 'California',
  country: 'US',
  par: 72,
  difficulty: 4,
  featured: false,
  featuredAt: null,
  createdAt: 20,
  updatedAt: 20,
  imageSrc: null,
  imageName: null,
}

function Harness() {
  const { data = [] } = useQuery({
    queryKey: courseKeys.all,
    queryFn: () => Promise.resolve([albany]),
    initialData: [albany],
    staleTime: Number.POSITIVE_INFINITY,
  })
  const deletion = useDeleteCourse()

  return (
    <>
      <ul>
        {data.map((course) => (
          <li key={course.id}>{course.title}</li>
        ))}
      </ul>
      <button type="button" onClick={() => deletion.mutate(albany)}>
        Delete Albany
      </button>
      {deletion.isError ? <p role="alert">Could not delete Albany. The course was restored.</p> : null}
    </>
  )
}

describe('useDeleteCourse', () => {
  let client: QueryClient

  beforeEach(() => {
    pending.reject = undefined
    client = new QueryClient({
      defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
    })
  })

  function renderHarness() {
    function wrapper({ children }: { children: ReactNode }) {
      return <QueryClientProvider client={client}>{children}</QueryClientProvider>
    }
    return render(<Harness />, { wrapper })
  }

  it('removes the course immediately and restores it when the delete fails', async () => {
    const user = userEvent.setup()
    renderHarness()

    await user.click(screen.getByRole('button', { name: 'Delete Albany' }))

    await waitFor(() => expect(screen.queryByText('Albany')).not.toBeInTheDocument())

    pending.reject?.(new Error('The server rejected the delete.'))

    await waitFor(() => expect(screen.getByText('Albany')).toBeInTheDocument())
    expect(screen.getByRole('alert')).toHaveTextContent('The course was restored')
    expect(client.getQueryData<Course[]>(courseKeys.all)?.map((course) => course.id)).toEqual(['albany'])
  })
})
