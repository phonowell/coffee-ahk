import { getCache, getCacheSalt } from '../cache.js'
import { pickImport } from '../source-resolver.js'

export const replaceAnchor = async (source: string, content: string) => {
  const listResult: string[] = []
  const cache = getCache()
  const cacheSalt = getCacheSalt()

  for (const line of content.split('\n')) {
    if (!line.startsWith('import ')) {
      listResult.push(line)
      continue
    }

    const [entry, path] = await pickImport(source, line)

    if (!cache.has(path)) {
      const { getNextModuleId } = await import('../cache.js')
      cache.set(path, {
        content: '',
        dependencies: [],
        id: entry ? getNextModuleId() : 0,
      })
    }

    const id = cache.get(path)?.id ?? 0
    if (!id) continue

    const anchor = entry ? `${entry} = __${cacheSalt}_module_${id}__` : ''
    if (anchor) listResult.push(anchor)
  }

  return listResult.join('\n')
}
