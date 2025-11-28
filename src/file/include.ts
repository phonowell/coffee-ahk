// Main include processing orchestrator
import { read } from 'fire-keeper'

import { clearCache, setCacheSalt, sortModules } from './include/cache.js'
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
    throw new Error(
      `Coffee-AHK/file: include failed, source file not found or empty: '${source}'`,
    )
  }

  const replaced = await replaceAnchor(source, content)
  await transformAll()

  // Strip export statements from main file (entry point doesn't need exports)
  const { codeLines } = parseExportsFromCoffee(replaced)
  const result = codeLines.join('\n')

  return [...sortModules(), result].join('\n')
}

export default main
