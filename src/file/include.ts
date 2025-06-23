// Main include processing orchestrator
import { read } from 'fire-keeper'

import { setCacheSalt, sortModules } from './include/cache.js'
import { replaceAnchor, transform } from './include/transformer.js'

const main = async (source: string, salt: string) => {
  setCacheSalt(salt)

  const content = await read<string>(source)
  if (!content) throw new Error(`invalid source '${source}'`)

  const result = await replaceAnchor(source, content)
  await transform()
  return [...sortModules(), result].join('\n')
}

export default main
