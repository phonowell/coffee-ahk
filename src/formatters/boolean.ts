import type { ItemTypeMap } from '../models/ItemType'
import type { Context } from '../types'

const main = (ctx: Context) => {
  const { content, type, value } = ctx

  if (type === 'bool') {
    content.push({ type: 'boolean', value: value as ItemTypeMap['boolean'] })
    return true
  }

  return false
}

export default main
