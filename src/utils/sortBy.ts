type Iteratee<T> = (value: T) => string | number | boolean | null | undefined
type PropertyPath = string | number
type SortIteratee<T> = Iteratee<T> | PropertyPath

const sortBy = <T>(array: T[], ...iteratees: SortIteratee<T>[]): T[] => {
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

      // Handle null/undefined values
      if (
        (aValue === null || aValue === undefined) &&
        (bValue === null || bValue === undefined)
      )
        continue
      if (aValue === null || aValue === undefined) return -1
      if (bValue === null || bValue === undefined) return 1

      // Safe comparison for primitive types
      if (typeof aValue === typeof bValue) {
        if (aValue < bValue) return -1
        if (aValue > bValue) return 1
      } else {
        // Convert to string for mixed type comparison
        const aStr = String(aValue)
        const bStr = String(bValue)
        if (aStr < bStr) return -1
        if (aStr > bStr) return 1
      }
    }
    return 0
  })
}

export default sortBy
