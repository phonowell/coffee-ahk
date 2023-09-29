// functions

const asArray = <T>(input: T[], index: number) =>
  input[index < 0 ? input.length + index : index] as T | undefined

const asObject = <T>(input: Record<string, T>, key: string) =>
  input[key] as T | undefined

/**
 * Returns the value at the specified index/key in the provided array or object.
 * @param input The array or object to retrieve the value from.
 * @param key The index or key of the value to retrieve.
 * @returns The value at the specified index/key.
 * @throws An error if the provided input is not an array or object, or if the specified index/key is out of bounds.
 */
const at = <T>(input: T[] | Record<string, T>, key: number | string) => {
  if (Array.isArray(input)) return asArray(input, key as number)
  return asObject(input, key as string)
}

// export
export default at
