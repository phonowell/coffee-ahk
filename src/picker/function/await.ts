import type { Context } from '../../types'

const main = (ctx: Context) => {
  const { content } = ctx
  content.list.forEach((item) => {
    if (item.type !== 'await') return void 0
  })
}

export default main
