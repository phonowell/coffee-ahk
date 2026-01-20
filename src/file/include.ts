// Main include processing orchestrator
import { read } from 'fire-keeper'

import { createTranspileError, ErrorType } from '../utils/error.js'

import {
  clearCache,
  getLineMapping,
  setCacheSalt,
  sortModules,
} from './include/cache.js'
import {
  parseExportsFromCoffee,
  replaceAnchor,
  transformAll,
} from './include/transformer.js'

export type FileMapping = { file: string; line: number; content: string }
export type FileMappingRef = { mapping?: FileMapping[] }

const main = async (
  source: string,
  salt: string,
  mappingRef?: FileMappingRef,
) => {
  clearCache()
  setCacheSalt(salt)

  const content = await read<string>(source)
  if (!content) {
    throw createTranspileError(
      ErrorType.FILE_ERROR,
      `include failed - source file not found or empty: '${source}'`,
      `Check file path and ensure file has content`,
    )
  }

  const replaced = await replaceAnchor(source, content)
  await transformAll()

  // Strip export statements from main file (entry point doesn't need exports)
  const { codeLines } = parseExportsFromCoffee(replaced)
  const result = codeLines.join('\n')
  const merged = [...sortModules(), result].join('\n')

  // Append line mapping as special marker
  const mapping = getLineMapping()
  const mainLines = result.split('\n')
  mainLines.forEach((line, i) => {
    mapping.push({ file: source, line: i + 1, content: line })
  })

  if (mappingRef) mappingRef.mapping = mapping

  return merged
}

export default main
