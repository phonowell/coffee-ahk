import type { ItemTypeMap } from '../models/ItemType.js'
import type { Context } from '../types/index.js'

const main = (ctx: Context) => {
  const { content, type, value } = ctx

  if (type === '(' || type === ')') {
    content.push({ type: 'bracket', value: value as ItemTypeMap['bracket'] })
    return true
  }

  return false
}

export default main
