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

    const importInfo = await pickImport(source, line)
    const { default: defaultImport, named: namedImports, path } = importInfo

    if (!cache.has(path)) {
      const { getNextModuleId } = await import('../cache.js')
      cache.set(path, {
        content: '',
        dependencies: [],
        id: defaultImport || namedImports.length ? getNextModuleId() : 0,
      })
    }

    const id = cache.get(path)?.id ?? 0
    if (!id) continue

    // 生成 default 导入赋值
    if (defaultImport) {
      listResult.push(
        `${defaultImport} = __${cacheSalt}_module_${id}__.default`,
      )
    }

    // 生成 named 导入赋值
    if (namedImports.length) {
      namedImports.forEach((named) => {
        listResult.push(
          `${named} = __${cacheSalt}_module_${id}__.${named.split(':')[0].trim()}`,
        )
      })
    }
  }

  return listResult.join('\n')
}
