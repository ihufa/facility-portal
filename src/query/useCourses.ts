import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { sortCourses } from '../domain/ordering.ts'
import type { Course, CourseInput } from '../domain/types.ts'
import { courseService } from '../data/courseService.ts'
import { courseKeys } from './keys.ts'

export function useCourses() {
  return useQuery({
    queryKey: courseKeys.all,
    queryFn: () => courseService.list(),
    retry: false,
  })
}

export function useCourse(id: string | undefined) {
  const queryClient = useQueryClient()
  return useQuery({
    queryKey: courseKeys.detail(id ?? 'none'),
    queryFn: () => courseService.get(id ?? ''),
    enabled: Boolean(id),
    initialData: () => {
      if (!id) return undefined
      return queryClient.getQueryData<Course[]>(courseKeys.all)?.find((course) => course.id === id)
    },
    initialDataUpdatedAt: () =>
      id ? queryClient.getQueryState(courseKeys.all)?.dataUpdatedAt : undefined,
  })
}

function upsertCourse(current: Course[] | undefined, course: Course): Course[] {
  const without = (current ?? []).filter((item) => item.id !== course.id)
  return sortCourses([...without, course])
}

export function useSaveCourse(id?: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: CourseInput) =>
      id ? courseService.update(id, input) : courseService.create(input),
    onSuccess: (course) => {
      queryClient.setQueryData<Course[]>(courseKeys.all, (current) => upsertCourse(current, course))
      queryClient.setQueryData(courseKeys.detail(course.id), course)
    },
  })
}

export function useDeleteCourse() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (course: Course) => courseService.remove(course.id),
    onMutate: async (course) => {
      await queryClient.cancelQueries({ queryKey: courseKeys.all })
      const previous = queryClient.getQueryData<Course[]>(courseKeys.all)
      queryClient.setQueryData<Course[]>(courseKeys.all, (current) =>
        current?.filter((item) => item.id !== course.id),
      )
      return { previous }
    },
    onError: (_error, _course, context) => {
      if (context?.previous) {
        queryClient.setQueryData(courseKeys.all, context.previous)
      }
    },
    onSuccess: (_result, course) => {
      queryClient.removeQueries({ queryKey: courseKeys.detail(course.id) })
    },
  })
}
