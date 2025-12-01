// Built-in function loader
import { CI, TYPEOF } from '../constants.js'
import Item from '../models/Item.js'

import { changeIndex_ahk, typeof_ahk } from './builtins.gen.js'

import type { Context } from '../types'

/** 获取内置函数内容（静态集成版） */
const getBuiltin = (functionName: string): Item[] => {
  if (functionName === 'changeIndex') {
    return [
      new Item({ type: 'native', value: changeIndex_ahk, scope: [] }),
      new Item({ type: 'new-line', value: '0', scope: [] }),
    ]
  }
  if (functionName === 'typeof') {
    return [
      new Item({ type: 'native', value: typeof_ahk, scope: [] }),
      new Item({ type: 'new-line', value: '0', scope: [] }),
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
      // 替换 salt 占位符
      listItem.forEach((item) => {
        if (typeof item.value === 'string') {
          const { value: originalValue } = item
          let value = originalValue
          const salt = ctx.options.salt ?? 'salt'

          if (value.includes(`${CI}_SALT_PLACEHOLDER`)) {
            value = value.replace(
              new RegExp(`${CI}_SALT_PLACEHOLDER`, 'g'),
              `${CI}_${salt}`,
            )
          }

          if (value.includes(`${TYPEOF}_SALT_PLACEHOLDER`)) {
            value = value.replace(
              new RegExp(`${TYPEOF}_SALT_PLACEHOLDER`, 'g'),
              `${TYPEOF}_${salt}`,
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
