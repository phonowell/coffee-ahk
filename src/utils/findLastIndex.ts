type Predicate<T> = (value: T, index: number, array: T[]) => boolean
type PropertyPath = string | number
type PartialObject<T> = Partial<T>

const findLastIndex = <T>(
  array: T[],
  predicate: Predicate<T> | PartialObject<T> | PropertyPath,
): number => {
  if (!Array.isArray(array)) return -1

  const getIteratee = (): Predicate<T> | null => {
    if (typeof predicate === 'function') return predicate

    if (typeof predicate === 'string' || typeof predicate === 'number')
      return (item: T) => Boolean(item[predicate])

    if (typeof predicate === 'object') {
      return (item: T) => {
        for (const key in predicate)
          if (item[key] !== predicate[key]) return false
        return true
      }
    }

    return null
  }

  const iteratee = getIteratee()
  if (!iteratee) return -1

  for (let i = array.length - 1; i >= 0; i--)
    if (iteratee(array[i], i, array)) return i

  return -1
}

export default findLastIndex
