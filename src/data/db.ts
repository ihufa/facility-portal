import type { Course } from '../domain/types.ts'

const DB_NAME = 'facility-portal'
const DB_VERSION = 1
const STORE = 'courses'

function requestToPromise<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error ?? new Error('IndexedDB request failed'))
  })
}

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)
    request.onupgradeneeded = () => {
      const database = request.result
      if (!database.objectStoreNames.contains(STORE)) {
        database.createObjectStore(STORE, { keyPath: 'id' })
      }
    }
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error ?? new Error('Could not open the course database'))
  })
}

let databasePromise: Promise<IDBDatabase> | null = null

function database(): Promise<IDBDatabase> {
  databasePromise ??= openDatabase()
  return databasePromise
}

export async function readCourses(): Promise<Course[]> {
  const db = await database()
  const transaction = db.transaction(STORE, 'readonly')
  return requestToPromise(transaction.objectStore(STORE).getAll() as IDBRequest<Course[]>)
}

export async function readCourse(id: string): Promise<Course | null> {
  const db = await database()
  const transaction = db.transaction(STORE, 'readonly')
  const course = await requestToPromise(
    transaction.objectStore(STORE).get(id) as IDBRequest<Course | undefined>,
  )
  return course ?? null
}

export async function countCourses(): Promise<number> {
  const db = await database()
  const transaction = db.transaction(STORE, 'readonly')
  return requestToPromise(transaction.objectStore(STORE).count())
}

export async function saveCourseRecord(course: Course): Promise<void> {
  const db = await database()
  const transaction = db.transaction(STORE, 'readwrite')
  await requestToPromise(transaction.objectStore(STORE).put(course))
}

export async function deleteCourseRecord(id: string): Promise<void> {
  const db = await database()
  const transaction = db.transaction(STORE, 'readwrite')
  await requestToPromise(transaction.objectStore(STORE).delete(id))
}
