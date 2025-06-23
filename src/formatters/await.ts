import type { Context } from '../types'

const main = (ctx: Context) => {
  const { content, type } = ctx

  if (type === 'await') {
    // await 关键字意味着使用了Promise
    ctx.flag.isPromiseUsed = true
    content.push('await')
    return true
  }

  return false
}

export default main
