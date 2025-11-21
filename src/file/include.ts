// Main include processing orchestrator
import { read } from 'fire-keeper'

import { clearCache, setCacheSalt, sortModules } from './include/cache.js'
import { replaceAnchor, transformAll } from './include/transformer.js'

const main = async (source: string, salt: string) => {
  clearCache()
  setCacheSalt(salt)

  const content = await read<string>(source)
  if (!content) {
    throw new Error(
      `ahk/file: include failed, source file not found or empty: '${source}'`,
    )
  }

  const result = await replaceAnchor(source, content)
  await transformAll()
  return [...sortModules(), result].join('\n')
}

export default main
