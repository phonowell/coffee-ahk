// Source path resolution functions
import { getDirname, glob, read } from 'fire-keeper'
import { trim } from 'radash'

import { createTranspileError } from '../../utils/error.js'

import { listExt } from './utils.js'

export const getSource = async (
  source: string,
  path: string,
): Promise<string> => {
  const isFile = path.startsWith('.')
  const isInListExt = listExt.some((ext) => path.endsWith(ext))

  const group = isInListExt
    ? [path]
    : [`${path}.coffee`, `${path}/index.coffee`]

  group.forEach((it, i) => {
    group[i] = isFile ? `${source}/${it}` : `./node_modules/${it}`
  })
  const listResult = await glob(group)
  const firstResult = listResult[0]
  if (firstResult) return firstResult

  const pkg = await read<{ main: string }>(
    `./node_modules/${path}/package.json`,
  )
  if (!pkg?.main) {
    throw createTranspileError(
      'file',
      `package.json missing 'main' field for '${source}'`,
    )
  }

  const listResult2 = await glob(`./node_modules/${path}/${pkg.main}`)
  const secondResult = listResult2[0]
  if (!secondResult) {
    throw createTranspileError(
      'file',
      `resolved package main not found: '${source}'`,
    )
  }

  return secondResult
}

export const pickImport = async (
  source: string,
  line: string,
): Promise<{ default: string; named: string[]; path: string }> => {
  // 检测不支持的 import 语法
  if (/import\s+\*\s+as\s+/.test(line)) {
    throw createTranspileError(
      'import',
      `unsupported syntax "import * as" in '${source}'\n  Line: ${line}\n  Use named imports instead: import { foo, bar } from './module'`,
    )
  }
  if (/{\s*\w+\s+as\s+\w+/.test(line)) {
    throw createTranspileError(
      'import',
      `unsupported syntax "import { foo as bar }" in '${source}'\n  Line: ${line}\n  Use direct names without aliases: import { foo } from './module'`,
    )
  }

  // 支持 import m, { a, b } from ... 以及原有语法
  let defaultImport = ''
  let namedImports: string[] = []
  let path = ''

  if (line.includes(' from ')) {
    const importClause =
      line.replace('import ', '').split(' from ')[0]?.trim() ?? ''
    path = line.split(' from ')[1]?.trim() ?? ''
    // import m, { a, b } from ...
    if (/^[\w$]+\s*,\s*{.+}$/.test(importClause)) {
      const m = RegExp(/^([\w$]+)\s*,\s*{(.+)}$/).exec(importClause)
      if (m?.[1] && m[2]) {
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
