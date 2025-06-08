s

const asArray = <T>(input: T[], index: number) =>
  input[index < 0 ? input.length + index : index] as T | undefined

const asObject = <T>(input: Record<string, T>, key: string) =>
  input[key] as T | undefined

/**
 * Returns the value at the specified index/key in the input array/object.
 * @template T - The type of the elements in the input array/object.
 * @param {T[] | Record<string, T>} input - The input array/object.
 * @param {number | string} key - The index/key of the value to retrieve.
 * @returns {T | undefined} - The value at the specified index/key, or undefined if it does not exist.
 */
const at = <T>(
  input: T[] | Record<string, T>,
  key: number | string,
): T | undefined => {
  if (Array.isArray(input)) return asArray(input, key as number)
  return asObject(input, key as string)
}

export default at
