import type { Context } from '../../types'

const main = (ctx: Context) => {
  const { content } = ctx

  content.toArray().forEach((item, i) => {
    if (!item.is('edge', 'parameter-start')) return

    const prev = content.at(i - 1)
    if (!prev?.is('identifier')) return

    prev.type = 'function'
  })
}

export default main
