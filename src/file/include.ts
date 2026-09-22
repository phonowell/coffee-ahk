// Main include processing orchestrator
import { read } from 'fire-keeper'

import { createTranspileError, ErrorType } from '../utils/error.js'

import { IncludeContext, type FileMapping } from './include/cache.js'
import {
  dropDanglingModuleRefs,
  parseExportsFromCoffee,
  replaceAnchor,
  transformAll,
} from './include/transformer.js'

export type { FileMapping }
export type FileMappingRef = { mapping?: FileMapping[] }

const main = async (source: string, salt: string, mappingRef?: FileMappingRef) => {
  const ctx = new IncludeContext(salt)

  const content = await read<string>(source)
  if (!content) {
    throw createTranspileError(
      ErrorType.FILE_ERROR,
      `include failed - source file not found or empty: '${source}'`,
      `Check file path and ensure file has content`,
    )
  }

  const replaced = await replaceAnchor(source, content, ctx)
  await transformAll(ctx)

  // Drop import assignments referencing modules that emit no ℓm binding
  // (class-only / raw .ahk modules expose their names directly)
  for (const [, meta] of ctx.cache)
    if (meta.content) meta.content = dropDanglingModuleRefs(ctx, meta.content)
  const cleaned = dropDanglingModuleRefs(ctx, replaced)

  // Strip export statements from main file (entry point doesn't need exports)
  const { codeLines } = parseExportsFromCoffee(cleaned)
  const result = codeLines.join('\n')
  const merged = [...ctx.sortModules(), result].join('\n')

  // Append line mapping as special marker
  const mapping = ctx.getLineMapping()
  const mainLines = result.split('\n')
  mainLines.forEach((line, i) => {
    mapping.push({ file: source, line: i + 1, content: line })
  })

  if (mappingRef) mappingRef.mapping = mapping

  return merged
}

export default main
