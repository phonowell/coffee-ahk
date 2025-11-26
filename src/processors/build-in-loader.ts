// Built-in function loader
import Item from '../models/Item.js'

import { changeIndex_ahk, typeof_ahk } from './builtins.gen.js'

import type { Context } from '../types'

/**
 * 获取内置函数内容（静态集成版）
 */
const getBuiltin = (functionName: string): Item[] => {
  if (functionName === 'changeIndex') {
    return [
      new Item('native', changeIndex_ahk, []),
      new Item('new-line', '0', []),
    ]
  }
  if (functionName === 'typeof')
    return [new Item('native', typeof_ahk, []), new Item('new-line', '0', [])]

  return []
}

const insert = (
  ctx: Context,
  flag: keyof Context['flag'],
  functionName: string,
) => {
  const { content } = ctx

  if (ctx.flag[flag]) {
    const listItem = getBuiltin(functionName)
    if (listItem.length > 0) {
      // 替换salt占位符
      listItem.forEach((item) => {
        if (typeof item.value === 'string') {
          const { value: originalValue } = item
          let value = originalValue
          const salt = ctx.options.salt ?? 'salt'
          if (value.includes('__ci_SALT_PLACEHOLDER__'))
            value = value.replace(/__ci_SALT_PLACEHOLDER__/g, `__ci_${salt}__`)

          if (value.includes('__typeof_SALT_PLACEHOLDER__')) {
            value = value.replace(
              /__typeof_SALT_PLACEHOLDER__/g,
              `__typeof_${salt}__`,
            )
            // Replace generated function name salt_1 -> {salt}_typeof
            value = value.replace(/salt_1/g, `${salt}_typeof`)
          }

          item.value = value
        }
      })
      content.reload([...listItem, ...content.toArray()])
    }
  }
}

const main = (ctx: Context) => {
  insert(ctx, 'isChangeIndexUsed', 'changeIndex')
  insert(ctx, 'isTypeofUsed', 'typeof')
}

export default main
