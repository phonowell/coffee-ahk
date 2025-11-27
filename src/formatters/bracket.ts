import type { ItemTypeMap } from '../models/ItemType'
import type { Context } from '../types'

const main = (ctx: Context) => {
  const { content, type, value } = ctx

  if (type === '(' || type === ')') {
    content.push({ type: 'bracket', value: value as ItemTypeMap['bracket'] })
    return true
  }

  return false
}

export default main
