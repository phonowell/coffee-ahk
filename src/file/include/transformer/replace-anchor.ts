import { MODULE_PREFIX } from '../../../constants.js'
import { pickImport } from '../source-resolver.js'
import { codeLineMask } from '../utils.js'

import type { IncludeContext } from '../cache.js'

export const replaceAnchor = async (source: string, content: string, ctx: IncludeContext) => {
  const listResult: string[] = []
  const { cache, salt } = ctx
  const mask = codeLineMask(content)

  for (const [i, line] of content.split('\n').entries()) {
    if (!mask[i] || !line.startsWith('import ')) {
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
        id: ctx.nextId(),
        originalContent: '',
        source: path,
      })
    }

    const meta = cache.get(path)
    if (!meta || !hasExports) continue

    // 生成 default 导入赋值
    if (defaultImport) {
      listResult.push(`${defaultImport} = ${MODULE_PREFIX}_${salt}_${meta.id}.default`)
    }

    // 生成 named 导入赋值
    for (const named of namedImports) {
      const key = (named.split(':')[0] ?? '').trim()
      listResult.push(`${named} = ${MODULE_PREFIX}_${salt}_${meta.id}.${key}`)
    }
  }

  return listResult.join('\n')
}
