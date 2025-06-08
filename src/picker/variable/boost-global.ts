import Item from '../../models/Item'

import type { Context } from '../../types'

const main = (ctx: Context) => {
  const { content } = ctx
  const cache = new Set<string>()
  let flagIgnore = 0

  const listContent: Item[] = []

  content.list.forEach((item, i) => {
    if (flagIgnore) {
      flagIgnore--
      return
    }

    listContent.push(item)

    if (!item.is('sign', '=')) return

    const prev = content.at(i - 1)
    if (!prev?.is('identifier')) return
    if (prev.scope.length) return
    if (i - 2 >= 0 && !content.at(i - 2)?.is('new-line')) return

    if (cache.has(prev.value)) return
    cache.add(prev.value)

    if (
      content.at(i + 1)?.is('identifier', prev.value) &&
      content.at(i + 2)?.is('new-line')
    ) {
      listContent.splice(listContent.length - 2, 2)
      flagIgnore = 2
      return
    }

    listContent.splice(
      listContent.length - 2,
      0,
      new Item('native', 'global ', item.scope),
    )
  })

  content.reload(listContent)
  ctx.cache.global = cache
}

export default main
