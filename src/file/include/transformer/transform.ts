import { getExtname, read, run } from 'fire-keeper'
import iconv from 'iconv-lite'

import { MODULE_PREFIX } from '../../../constants.js'
import { createTranspileError, ErrorType, TranspileError } from '../../../utils/error.js'
import { pickImport as resolveImport } from '../source-resolver.js'

import { codeLineMask } from '../utils.js'

import { serializeDataModule } from './data-module.js'
import { hasClassDeclaration, validateClassExportConflict } from './detect-class.js'
import { parseExportsFromCoffee } from './parse-exports.js'
import { replaceAnchor as replaceMark } from './replace-anchor.js'
import { wrapInClosureAndAssign } from './wrap-closure.js'

import type { IncludeContext, ModuleMeta } from '../cache.js'
import type { Context } from '../../../types/index.js'

type Cache = IncludeContext['cache']
type Meta = ModuleMeta

/** Create minimal Context for file type errors */
const createFileTypeContext = (): Pick<Context, 'token'> => ({
  token: ['', '', { first_line: 0, last_line: 0 }] as Context['token'],
})

const handleAhk = (file: string, text: string, meta: Meta, cache: Cache, deps: string[]) => {
  const result = ['```', text, '```'].join('\n')
  cache.set(file, { ...meta, content: result, dependencies: deps })
}

const handleCoffee = async (
  file: string,
  text: string,
  meta: Meta,
  ctx: IncludeContext,
  deps: string[],
) => {
  const replaced = await replaceMark(file, text, ctx)
  const { exportDefault, exportNamed, codeLines } = parseExportsFromCoffee(replaced, file)

  const codeBody = codeLines.join('\n')
  const hasClass = hasClassDeclaration(codeBody)
  const hasExport = exportDefault.length > 0 || exportNamed.length > 0

  validateClassExportConflict(file, hasClass, hasExport)

  // Class-only modules: output class code directly
  if (hasClass && !hasExport) {
    ctx.cache.set(file, { ...meta, content: codeBody, dependencies: deps })
    return
  }

  // Modules with exports: wrap in closure
  const result = wrapInClosureAndAssign(codeLines, exportDefault, exportNamed, meta, ctx.salt)
  ctx.cache.set(file, { ...meta, content: result, dependencies: deps })
}

const handleDataModule = (
  file: string,
  data: unknown,
  meta: Meta,
  ctx: IncludeContext,
  deps: string[],
) => {
  const result = serializeDataModule(data, ctx.salt, meta.id)
  ctx.cache.set(file, { ...meta, content: result, dependencies: deps })
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

const collectCoffeeDeps = async (file: string, text: string): Promise<string[]> => {
  const depSet = new Set<string>()
  const mask = codeLineMask(text)
  for (const [i, line] of text.split('\n').entries()) {
    if (!mask[i] || !line.startsWith('import ')) continue
    const { path: depPath } = await resolveImport(file, line)
    depSet.add(depPath)
  }
  return Array.from(depSet)
}

const processFile = async (file: string, meta: Meta, ctx: IncludeContext) => {
  if (meta.content) return

  // 读取文件内容，支持 Buffer、string、object
  const raw = await read<Buffer | string | object>(file)
  if (!raw) {
    // Empty/missing module: keep a defined empty module object so importers
    // don't reference an undeclared ℓm_* variable
    ctx.cache.set(file, {
      ...meta,
      content: `${MODULE_PREFIX}_${ctx.salt}_${meta.id} = {}`,
      dependencies: [],
    })
    return
  }

  const text = run(() => {
    if (raw instanceof Buffer) return iconv.decode(raw, 'utf8', { stripBOM: true })
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
    handleAhk(file, text, meta, ctx.cache, deps)
    return
  }
  if (ext === '.coffee') {
    await handleCoffee(file, text, meta, ctx, deps)
    return
  }
  if (ext === '.json' || ext === '.yaml') {
    const data = parseDataModule(raw, text, file, ext)
    handleDataModule(file, data, meta, ctx, deps)
    return
  }
  throw new TranspileError(
    createFileTypeContext(),
    ErrorType.FILE_ERROR,
    `unsupported file type for transformation: '${file}'`,
    `Use .coffee, .ahk, .json, or .yaml files`,
  )
}

export const transformAll = async (ctx: IncludeContext) => {
  const filesToProcess = [...ctx.cache].filter(([, meta]) => !meta.content)
  for (const [file, meta] of filesToProcess) await processFile(file, meta, ctx)

  // 递归处理未完成的项
  if ([...ctx.cache].some(([, meta]) => !meta.content)) await transformAll(ctx)
}

/** Collect `class X` names declared by a class-only module (raw coffee body) */
const declaredClassNames = (content: string): Set<string> => {
  const names = new Set<string>()
  for (const m of content.matchAll(/^\s*class\s+([A-Za-z_]\w*)/gm)) {
    const name = m.at(1)
    if (name) names.add(name)
  }
  return names
}

/**
 * Remove `x = ℓm_salt_id.name` assignments referencing modules that produced
 * no ℓm binding (class-only modules emit raw code; raw .ahk modules embed
 * directly). Their names are already in scope, so the import line is a no-op.
 * A dropped `.default` binding or an unmatched name would dangle silently —
 * reject those instead.
 */
export const dropDanglingModuleRefs = (ctx: IncludeContext, text: string): string => {
  const dangling = new Map<string, Meta>()
  for (const [, meta] of ctx.cache) {
    const token = `${MODULE_PREFIX}_${ctx.salt}_${meta.id}`
    if (!meta.content.includes(`${token} =`)) dangling.set(token, meta)
  }
  if (!dangling.size) return text

  return text
    .split('\n')
    .filter((line) => {
      const match = /^\s*\w+\s*=\s*(ℓm_\w+)\.(\w+)\s*$/.exec(line)
      const meta = match?.[1] ? dangling.get(match[1]) : undefined
      const member = match?.[2]
      if (!meta || !member) return true

      if (member === 'default') {
        throw createTranspileError(
          ErrorType.UNSUPPORTED,
          `module '${meta.source}' has no default export`,
          `Import a declared name instead: import { Name } from '${meta.source}'`,
        )
      }

      // .ahk embeds raw globals — names can't be verified, keep the no-op drop
      if (meta.source.endsWith('.coffee') && !declaredClassNames(meta.content).has(member)) {
        throw createTranspileError(
          ErrorType.UNSUPPORTED,
          `module '${meta.source}' has no export named '${member}'`,
          `Check the class names declared in '${meta.source}'`,
        )
      }
      return false
    })
    .join('\n')
}

// Re-export for backward compatibility
export { parseExportsFromCoffee } from './parse-exports.js'
