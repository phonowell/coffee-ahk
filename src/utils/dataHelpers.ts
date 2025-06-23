/** Utility functions for data manipulation */

type Iteratee<T> = (value: T) => string | number | boolean | null | undefined
type PropertyPath = string | number
type SortIteratee<T> = Iteratee<T> | PropertyPath
type ComparableValue = string | number | boolean

/** Handle null and undefined values in comparison */
const handleNullUndefined = (
  aValue: unknown,
  bValue: unknown,
): number | null => {
  const aIsNull = aValue === null || aValue === undefined
  const bIsNull = bValue === null || bValue === undefined

  if (aIsNull && bIsNull) return 0
  if (aIsNull) return -1
  if (bIsNull) return 1
  return null
}

/** Compare two values of any type */
const compareValues = (aValue: unknown, bValue: unknown): number => {
  if (typeof aValue === typeof bValue) {
    if (
      typeof aValue === 'string' ||
      typeof aValue === 'number' ||
      typeof aValue === 'boolean'
    ) {
      if ((aValue as ComparableValue) < (bValue as ComparableValue)) return -1
      if ((aValue as ComparableValue) > (bValue as ComparableValue)) return 1
      return 0
    }
  }

  const aStr = String(aValue)
  const bStr = String(bValue)
  if (aStr < bStr) return -1
  if (aStr > bStr) return 1
  return 0
}

/** Sort array by multiple iteratees */
export const sortBy = <T>(array: T[], ...iteratees: SortIteratee<T>[]): T[] => {
  if (!Array.isArray(array)) return []
  if (iteratees.length === 0) return [...array]

  const getIteratee = (iteratee: SortIteratee<T>): Iteratee<T> => {
    if (typeof iteratee === 'function') return iteratee

    if (typeof iteratee === 'string' || typeof iteratee === 'number')
      return (item: T) => item[iteratee]

    return () => undefined
  }

  const compiledIteratees = iteratees.map(getIteratee)

  return [...array].sort((a, b) => {
    for (const iteratee of compiledIteratees) {
      const aValue = iteratee(a)
      const bValue = iteratee(b)

      const nullResult = handleNullUndefined(aValue, bValue)
      if (nullResult !== null) {
        if (nullResult === 0) continue
        return nullResult
      }

      const compareResult = compareValues(aValue, bValue)
      if (compareResult !== 0) return compareResult
    }
    return 0
  })
}

export default { sortBy }
