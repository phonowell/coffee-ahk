// Built-in function loader
import { read } from 'fire-keeper'

import Item from '../models/Item.js'

import type { Context } from '../types'

// 从编译好的.ahk文件读取built-in函数
const loadBuiltinFromFile = async (functionName: string): Promise<Item[]> => {
  const filePath = `./script/segment/${functionName}.ahk`

  try {
    const content = await read<string>(filePath)
    if (!content) return []

    // 确保content是字符串
    const contentStr = String(content)

    // 直接将整个文件内容作为一个native item插入
    // 替换salt占位符 - 保持完整的模式
    let processedContent = contentStr.replace(
      /__ci_salt__/g,
      '__ci_SALT_PLACEHOLDER__',
    )
    processedContent = processedContent.replace(
      /__rf_salt__/g,
      '__rf_SALT_PLACEHOLDER__',
    )

    return [
      new Item('native', processedContent, []),
      new Item('new-line', '0', []),
    ]
  } catch (err) {
    console.warn(`Built-in file not found: ${filePath}`, err)
    return []
  }
}

const insert = async (ctx: Context, flag: string, functionName: string) => {
  const { content } = ctx

  if (ctx.flag[flag]) {
    try {
      const listItem = await loadBuiltinFromFile(functionName)
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
            if (value.includes('__rf_SALT_PLACEHOLDER__')) {
              value = value.replace(
                /__rf_SALT_PLACEHOLDER__/g,
                `__rf_${ctx.options.salt ?? 'salt'}__`,
              )
            }
            item.value = value
          }
        })
        content.reload([...listItem, ...content.list])
      }
    } catch (error) {
      console.warn(`Failed to load built-in function ${functionName}:`, error)
    }
  }
}

const main = async (ctx: Context) => {
  if (!ctx.options.builtins) return

  await insert(ctx, 'isChangeIndexUsed', 'changeIndex')
  await insert(ctx, 'isPromiseUsed', 'Promise')
}

export default main
