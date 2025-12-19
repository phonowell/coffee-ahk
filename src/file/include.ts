// Main include processing orchestrator
import { read } from 'fire-keeper'

import { createTranspileError } from '../utils/error.js'

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

const main = async (source: string, salt: string) => {
  clearCache()
  setCacheSalt(salt)

  const content = await read<string>(source)
  if (!content) {
    throw createTranspileError(
      'file',
      `include failed, source file not found or empty: '${source}'`,
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

  // Store mapping in global for error handler
  ;(global as Record<string, unknown>).__fileMapping = mapping

  return merged
}

export default main
