import type { ItemTypeMap } from '../models/ItemType.js'
import type { Context } from '../types/index.js'

const main = (ctx: Context) => {
  const { content, type, value } = ctx

  if (type === 'bool') {
    content.push({ type: 'boolean', value: value as ItemTypeMap['boolean'] })
    return true
  }

  return false
}

export default main
