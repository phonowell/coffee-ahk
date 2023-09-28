// functions

const asArray = <T>(input: T[], index: number) =>
  input[index < 0 ? input.length + index : index] as T | undefined

const asObject = <T>(input: Record<string, T>, key: string) =>
  input[key] as T | undefined

const at = <T>(input: T[] | Record<string, T>, key: number | string) => {
  if (Array.isArray(input)) return asArray(input, key as number)
  return asObject(input, key as string)
}

// export
export default at
