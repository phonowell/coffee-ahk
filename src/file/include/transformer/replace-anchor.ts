import { getCache, getCacheSalt, getNextModuleId } from '../cache.js'
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

    const importInfo = await pickImport(source, line)
    const { default: defaultImport, named: namedImports, path } = importInfo

    const hasExports = defaultImport || namedImports.length > 0

    if (!cache.has(path)) {
      // All modules get an id for dependency sorting
      // Side-effect modules (no exports) still participate in ordering
      cache.set(path, {
        content: '',
        dependencies: [],
        id: getNextModuleId(),
      })
    }

    const meta = cache.get(path)
    if (!meta || !hasExports) continue

    // 生成 default 导入赋值
    if (defaultImport) {
      listResult.push(
        `${defaultImport} = __${cacheSalt}_module_${meta.id}__.default`,
      )
    }

    // 生成 named 导入赋值
    for (const named of namedImports) {
      const key = (named.split(':')[0] ?? '').trim()
      listResult.push(`${named} = __${cacheSalt}_module_${meta.id}__.${key}`)
    }
  }

  return listResult.join('\n')
}
