export const courseKeys = {
  all: ['courses'] as const,
  detail: (id: string) => ['courses', id] as const,
}
