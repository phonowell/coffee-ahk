import type { Context } from '../types'

const main = (ctx: Context): boolean => {
  const { content, type, value } = ctx

  if (type === 'identifier') {
    // 检测Promise相关标识符
    if (value === 'Promise') ctx.flag.isPromiseUsed = true
    
    content.push('identifier', value)
    return true
  }

  return false
}

export default main
