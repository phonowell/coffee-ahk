import { Context } from '../../types'
import Item from '../../module/Item'

// function

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

    if (!Item.is(item, 'sign', '=')) return

    const prev = content.at(i - 1)
    if (!Item.is(prev, 'identifier')) return
    if (prev.scope.length) return
    if (i - 2 >= 0 && !Item.is(content.at(i - 2), 'new-line')) return

    if (cache.has(prev.value)) return
    cache.add(prev.value)

    if (
      Item.is(content.at(i + 1), 'identifier', prev.value) &&
      Item.is(content.at(i + 2), 'new-line')
    ) {
      listContent.splice(listContent.length - 2, 2)
      flagIgnore = 2
      return
    }

    listContent.splice(
      listContent.length - 2,
      0,
      Item.new('native', 'global ', item.scope),
    )
  })

  content.load(listContent)
  ctx.cache.global = cache
}

// export
export default main
