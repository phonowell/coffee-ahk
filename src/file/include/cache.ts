// Cache and utility functions for include processing

const cache = new Map<
  string,
  {
    id: number
    content: string
    dependencies: string[]
  }
>()

let cacheSalt = ''
let idModule = 0

export const getCache = () => cache
export const setCacheSalt = (salt: string) => {
  cacheSalt = salt
}
export const getCacheSalt = () => cacheSalt
export const getNextModuleId = () => ++idModule

export const clearCache = () => {
  cache.clear()
  idModule = 0
}

export const sortModules = (
  listContent: string[] = [],
  listReady: string[] = [],
): string[] => {
  const cache2 = [...cache]
  cache2.forEach((item) => {
    const [source, { content, dependencies }] = item
    if (dependencies.length) return
    listContent.push(content)
    listReady.push(source)
    cache.delete(source)
  })
  if (!cache.size) return listContent

  for (const item of [...cache]) {
    const [source, { dependencies }] = item
    cache.set(source, {
      ...item[1],
      dependencies: dependencies.filter((it) => !listReady.includes(it)),
    })
  }
  return sortModules(listContent, listReady)
}
