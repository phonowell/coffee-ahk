import { getExtname, read, run } from 'fire-keeper'
import iconv from 'iconv-lite'

import {
  createTranspileError,
  ErrorType,
  TranspileError,
} from '../../../utils/error.js'
import { getCache as fetchCache, getCacheSalt as fetchSalt } from '../cache.js'
import { pickImport as resolveImport } from '../source-resolver.js'

import { serializeDataModule } from './data-module.js'
import {
  hasClassDeclaration,
  validateClassExportConflict,
} from './detect-class.js'
import { parseExportsFromCoffee } from './parse-exports.js'
import { replaceAnchor as replaceMark } from './replace-anchor.js'
import { wrapInClosureAndAssign } from './wrap-closure.js'

import type { Context } from '../../../types/index.js'

type Cache = ReturnType<typeof fetchCache>
type Meta = Cache extends Map<unknown, infer V> ? V : never

/** Create minimal Context for file type errors */
const createFileTypeContext = (): Pick<Context, 'token'> => ({
  token: ['', '', { first_line: 0, last_line: 0 }] as Context['token'],
})

const handleAhk = (
  file: string,
  text: string,
  meta: Meta,
  cache: Cache,
  deps: string[],
) => {
  const result = ['```', text, '```'].join('\n')
  cache.set(file, { ...meta, content: result, dependencies: deps })
}

const handleCoffee = async (
  file: string,
  text: string,
  meta: Meta,
  cache: Cache,
  salt: string,
  deps: string[],
) => {
  const replaced = await replaceMark(file, text)
  const { exportDefault, exportNamed, codeLines } = parseExportsFromCoffee(
    replaced,
    file,
  )

  const codeBody = codeLines.join('\n')
  const hasClass = hasClassDeclaration(codeBody)
  const hasExport = exportDefault.length > 0 || exportNamed.length > 0

  validateClassExportConflict(file, hasClass, hasExport)

  // Class-only modules: output class code directly
  if (hasClass && !hasExport) {
    cache.set(file, { ...meta, content: codeBody, dependencies: deps })
    return
  }

  // Modules with exports: wrap in closure
  const result = wrapInClosureAndAssign(
    codeLines,
    exportDefault,
    exportNamed,
    meta,
    salt,
  )
  cache.set(file, { ...meta, content: result, dependencies: deps })
}

const handleDataModule = (
  file: string,
  data: unknown,
  meta: Meta,
  cache: Cache,
  salt: string,
  deps: string[],
) => {
  const result = serializeDataModule(data, salt, meta.id)
  cache.set(file, { ...meta, content: result, dependencies: deps })
}

const parseDataModule = (
  raw: Buffer | string | object,
  text: string,
  file: string,
  ext: string,
): unknown => {
  if (!(raw instanceof Buffer) && typeof raw === 'object') return raw

  try {
    return JSON.parse(text)
  } catch {
    const format = ext === '.yaml' ? 'YAML' : 'JSON'
    throw createTranspileError(
      ErrorType.FILE_ERROR,
      `failed to parse ${format} module '${file}'`,
      `Ensure the file contains valid ${format} data`,
    )
  }
}

const collectCoffeeDeps = async (
  file: string,
  text: string,
): Promise<string[]> => {
  const depSet = new Set<string>()
  for (const line of text.split('\n')) {
    if (!line.startsWith('import ')) continue
    const { path: depPath } = await resolveImport(file, line)
    depSet.add(depPath)
  }
  return Array.from(depSet)
}

const processFile = async (
  file: string,
  meta: Meta,
  cache: Cache,
  salt: string,
) => {
  if (meta.content) return

  // 读取文件内容，支持 Buffer、string、object
  const raw = await read<Buffer | string | object>(file)
  if (!raw) {
    cache.delete(file)
    return
  }

  const text = run(() => {
    if (raw instanceof Buffer)
      return iconv.decode(raw, 'utf8', { stripBOM: true })
    if (typeof raw === 'string') return raw
    return JSON.stringify(raw)
  })

  // 获取文件扩展名
  const ext = getExtname(file)

  // 收集依赖，仅处理 .coffee 文件，去重
  let deps: string[] = []
  if (ext === '.coffee') deps = await collectCoffeeDeps(file, text)

  // 处理内容
  if (ext === '.ahk') {
    handleAhk(file, text, meta, cache, deps)
    return
  }
  if (ext === '.coffee') {
    await handleCoffee(file, text, meta, cache, salt, deps)
    return
  }
  if (ext === '.json' || ext === '.yaml') {
    const data = parseDataModule(raw, text, file, ext)
    handleDataModule(file, data, meta, cache, salt, deps)
    return
  }
  throw new TranspileError(
    createFileTypeContext(),
    ErrorType.FILE_ERROR,
    `unsupported file type for transformation: '${file}'`,
    `Use .coffee, .ahk, .json, or .yaml files`,
  )
}

export const transformAll = async () => {
  const cache = fetchCache()
  const salt = fetchSalt()

  const filesToProcess = [...cache].filter(([, meta]) => !meta.content)
  for (const [file, meta] of filesToProcess)
    await processFile(file, meta, cache, salt)

  // 递归处理未完成的项
  if ([...cache].some(([, meta]) => !meta.content)) await transformAll()
}

// Re-export for backward compatibility
export { parseExportsFromCoffee } from './parse-exports.js'
