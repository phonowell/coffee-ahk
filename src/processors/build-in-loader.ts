// Built-in function loader
import Item from '../models/Item.js'

import { changeIndex_ahk } from './builtins.gen.js'

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
          if (value.includes('__ci_SALT_PLACEHOLDER__')) {
            value = value.replace(
              /__ci_SALT_PLACEHOLDER__/g,
              `__ci_${ctx.options.salt ?? 'salt'}__`,
            )
          }
          item.value = value
        }
      })
      content.reload([...listItem, ...content.list])
    }
  }
}

const main = (ctx: Context) => {
  insert(ctx, 'isChangeIndexUsed', 'changeIndex')
}

export default main
