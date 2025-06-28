// Source path resolution functions
import { getDirname, glob, read } from 'fire-keeper'
import { trim } from 'radash'

import { listExt } from './utils.js'

export const getSource = async (source: string, path: string) => {
  const isFile = path.startsWith('.')
  const isInListExt = listExt.some((ext) => path.endsWith(ext))

  const group = isInListExt
    ? [path]
    : [`${path}.coffee`, `${path}/index.coffee`]

  group.forEach((it, i) => {
    group[i] = isFile ? `${source}/${it}` : `./node_modules/${it}`
  })
  const listResult = await glob(group)
  if (listResult.length) return listResult[0]

  const pkg = await read<{ main: string }>(
    `./node_modules/${path}/package.json`,
  )
  if (!pkg?.main) throw new Error(`invalid package '${source}'`)

  const listResult2 = await glob(`./node_modules/${path}/${pkg.main}`)
  if (!listResult2.length) throw new Error(`invalid package '${source}'`)

  return listResult2[0]
}

export const pickImport = async (source: string, line: string) => {
  // 支持 import m, { a, b } from ... 以及原有语法
  let defaultImport = ''
  let namedImports: string[] = []
  let path = ''

  if (line.includes(' from ')) {
    const importClause = line.replace('import ', '').split(' from ')[0].trim()
    path = line.split(' from ')[1].trim()
    // import m, { a, b } from ...
    if (/^[\w$]+\s*,\s*{.+}$/.test(importClause)) {
      const m = RegExp(/^([\w$]+)\s*,\s*{(.+)}$/).exec(importClause)
      if (m) {
        defaultImport = m[1].trim()
        namedImports = m[2]
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean)
      }
    } else if (/^{.+}$/.test(importClause)) {
      // import { a, b } from ...
      namedImports = importClause
        .slice(1, -1)
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
    } else if (importClause) {
      // import m from ...
      defaultImport = importClause
    }
  } else {
    // import './foo'
    path = line.replace('import ', '').trim()
  }

  const src = await getSource(getDirname(source), trim(path, ' /\'"'))
  return { default: defaultImport, named: namedImports, path: src }
}
